// app/api/stripe/webhook/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import dbConnect from "@/lib/db/mongodb"; // ✅ Changed from connectDB to dbConnect
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
    await dbConnect(); // ✅ Fixed

    console.log('📦 Processing payment success for:', paymentIntent.id);

    const bookingData = JSON.parse(paymentIntent.metadata.bookingData);

    // Create Booking
    const booking = await Booking.create({
      user: paymentIntent.metadata.userId,
      serviceId: bookingData.serviceId || 1,
      serviceName: bookingData.serviceName,
      category: bookingData.category,
      serviceIcon: bookingData.serviceIcon || '🏥',
      serviceType: bookingData.serviceType || 'baby-care',
      serviceRate: bookingData.serviceRate || bookingData.totalCost,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email || paymentIntent.metadata.userEmail,
      durationType: bookingData.durationType,
      duration: bookingData.duration,
      date: bookingData.date || new Date(),
      startTime: bookingData.startTime || "TBD",
      endTime: bookingData.endTime || "TBD",
      division: bookingData.division || 'Dhaka',
      district: bookingData.district,
      city: bookingData.city,
      area: bookingData.area,
      address: bookingData.address || `${bookingData.area}, ${bookingData.city}`,
      notes: bookingData.notes || "",
      totalCost: bookingData.totalCost,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "card",
    });

    console.log('✅ Booking created:', booking._id);

    // Create Payment Record
    const payment = await Payment.create({
      user: paymentIntent.metadata.userId,
      booking: booking._id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: "completed",
      paymentMethod: "card",
      stripePaymentIntentId: paymentIntent.id,
      stripeChargeId: paymentIntent.latest_charge,
      paidAt: new Date(),
      metadata: {
        serviceName: bookingData.serviceName,
        customerEmail: paymentIntent.metadata.userEmail,
        customerName: paymentIntent.metadata.userName,
      },
    });

    console.log('✅ Payment record created:', payment._id);

    // Update booking with payment reference
    booking.payment = payment._id;
    await booking.save();

    console.log('✅ All data saved successfully!');

  } catch (error) {
    console.error("❌ Error handling payment success:", error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    await dbConnect();

    await Payment.create({
      user: paymentIntent.metadata.userId,
      booking: null,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: "failed",
      paymentMethod: "card",
      stripePaymentIntentId: paymentIntent.id,
      failureReason: paymentIntent.last_payment_error?.message || "Payment failed",
      metadata: {
        customerEmail: paymentIntent.metadata.userEmail,
        customerName: paymentIntent.metadata.userName,
      },
    });

    console.log("❌ Payment failed recorded:", paymentIntent.id);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}