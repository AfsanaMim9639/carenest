// app/api/stripe/webhook/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import dbConnect from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent) {
  try {
    await dbConnect();

    console.log('📦 Processing payment success for:', paymentIntent.id);

    const bookingId = paymentIntent.metadata.bookingId;

    if (!bookingId) {
      console.error('❌ No bookingId in payment intent metadata');
      return;
    }

    // ✅ Find and UPDATE existing booking (don't create new one!)
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error('❌ Booking not found:', bookingId);
      return;
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    console.log('✅ Booking updated:', booking._id);

    // Update payment record
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.status = 'completed';
      payment.paidAt = new Date();
      payment.stripeChargeId = paymentIntent.latest_charge;
      await payment.save();
      console.log('✅ Payment record updated:', payment._id);
    }

    console.log('✅ Payment success handled!');

  } catch (error) {
    console.error("❌ Error handling payment success:", error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    await dbConnect();

    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      // Update booking to cancelled
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'cancelled',
        paymentStatus: 'failed',
        cancellationReason: 'Payment failed'
      });
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message || "Payment failed",
      }
    );

    console.log("❌ Payment failed handled:", paymentIntent.id);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}