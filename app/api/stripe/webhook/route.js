import { NextResponse } from "next/server";
import Stripe from "stripe";

import dbConnect from "@/lib/db/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { sendInvoiceEmail } from "@/lib/email/emailService";

export const runtime = "nodejs";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key missing");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe webhook secret missing");
    }

    const stripe = getStripe();

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    await dbConnect();

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id,
  }).populate("booking user");

  if (!payment || payment.status === "succeeded") return;

  payment.status = "succeeded";
  payment.receiptUrl =
    paymentIntent.charges?.data?.[0]?.receipt_url;

  await payment.save();

  const booking = await Booking.findById(payment.booking._id).populate("user");

  if (!booking) return;

  booking.status = "confirmed";
  booking.paymentStatus = "paid";
  await booking.save();

  try {
    await sendInvoiceEmail({
      to: booking.user?.email || booking.email,
      booking,
      payment,
    });
  } catch (err) {
    console.error("Invoice email failed:", err);
  }
}

async function handlePaymentFailure(paymentIntent) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id,
  });

  if (!payment || payment.status === "failed") return;

  payment.status = "failed";
  payment.failureMessage =
    paymentIntent.last_payment_error?.message;

  await payment.save();

  await Booking.findByIdAndUpdate(payment.booking, {
    paymentStatus: "failed",
  });
}

async function handleRefund(charge) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: charge.payment_intent,
  });

  if (!payment || payment.status === "refunded") return;

  payment.status = "refunded";
  payment.refundId = charge.refunds?.data?.[0]?.id;
  payment.refundedAt = new Date();

  await payment.save();

  await Booking.findByIdAndUpdate(payment.booking, {
    paymentStatus: "refunded",
    status: "cancelled",
  });
}
