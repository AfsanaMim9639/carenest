import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

import dbConnect from "@/lib/db/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { authOptions } from "@/lib/auth";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key missing");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    console.log('Creating payment for user:', session.user.id);

    await dbConnect();

    const { bookingData } = await req.json();

    if (!bookingData?.totalCost) {
      return NextResponse.json(
        { error: "Invalid booking data - totalCost required" },
        { status: 400 }
      );
    }

    console.log('Booking data received:', {
      serviceName: bookingData.serviceName,
      totalCost: bookingData.totalCost,
      duration: bookingData.duration
    });

    // 1️⃣ Create booking first
    const booking = await Booking.create({
      user: session.user.id,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      category: bookingData.category,
      serviceIcon: bookingData.serviceIcon || '🏥',
      serviceType: bookingData.serviceType || 'baby-care',
      serviceRate: bookingData.totalCost / bookingData.duration,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email || '',
      durationType: bookingData.durationType,
      duration: bookingData.duration,
      division: bookingData.division,
      district: bookingData.district,
      city: bookingData.city,
      area: bookingData.area,
      address: bookingData.address,
      notes: bookingData.notes || '',
      totalCost: bookingData.totalCost,
      status: "pending",
      paymentStatus: "pending",
      bookingDate: new Date(),
      // Set default times
      startTime: "TBD",
      endTime: "TBD",
      date: new Date()
    });

    console.log('Booking created:', booking._id.toString());

    // 2️⃣ Initialize Stripe
    const stripe = getStripe();

    // 3️⃣ Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(bookingData.totalCost * 100), // Convert to paisa/cents
      currency: "bdt",
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: booking._id.toString(),
        userId: session.user.id,
        serviceId: bookingData.serviceId.toString(),
        serviceName: bookingData.serviceName,
        userName: bookingData.name,
        userPhone: bookingData.phone,
      },
      description: `${bookingData.serviceName} - ${bookingData.duration} ${bookingData.durationType}`,
    });

    console.log('Payment intent created:', paymentIntent.id);

    // 4️⃣ Create Payment record in database
    const payment = await Payment.create({
      user: session.user.id,
      booking: booking._id,
      amount: bookingData.totalCost,
      currency: "bdt",
      status: "pending",
      paymentMethod: "card",
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        bookingId: booking._id.toString(),
        serviceName: bookingData.serviceName,
      },
    });

    console.log('Payment record created:', payment._id.toString());

    // 5️⃣ Link payment to booking
    booking.payment = payment._id;
    await booking.save();

    console.log('Payment linked to booking');

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      bookingId: booking._id.toString(),
      paymentId: payment._id.toString(),
    });

  } catch (error) {
    console.error("Payment intent creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error.message,
      },
      { status: 500 }
    );
  }
}