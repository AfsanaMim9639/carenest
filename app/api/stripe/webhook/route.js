import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!webhookSecret) {
      console.error("Stripe webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    await dbConnect();

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        
        console.log("Payment succeeded:", paymentIntent.id);
        console.log("Metadata:", paymentIntent.metadata);

        // Update payment record
        const payment = await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            status: "completed",
            paidAt: new Date(),
            stripePaymentIntentId: paymentIntent.id,
          },
          { new: true }
        );

        if (payment) {
          // Update booking
          await Booking.findByIdAndUpdate(payment.booking, {
            paymentStatus: "paid",
            status: "confirmed" // Automatically confirm on payment
          });

          console.log("Booking and payment updated successfully");
        } else {
          console.error("Payment record not found for:", paymentIntent.id);
        }

        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        
        console.log("Payment failed:", failedPayment.id);

        // Update payment record
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: failedPayment.id },
          { status: "failed" }
        );

        // Update booking
        const failedBooking = await Payment.findOne({
          stripePaymentIntentId: failedPayment.id
        });

        if (failedBooking) {
          await Booking.findByIdAndUpdate(failedBooking.booking, {
            paymentStatus: "failed"
          });
        }

        break;

      case "payment_intent.canceled":
        const canceledPayment = event.data.object;
        
        console.log("Payment canceled:", canceledPayment.id);

        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: canceledPayment.id },
          { status: "cancelled" }
        );

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

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};