import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import dbConnect from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // ✅ Step 1: Database connect করুন
    await dbConnect();
    
    // ✅ Step 2: Session check
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingData } = await req.json();

    console.log('📦 Booking Data Received:', bookingData);

    // ✅ Step 3: Booking তৈরি করুন MongoDB তে
    const booking = await Booking.create({
      user: session.user.id,
      serviceId: bookingData.serviceId || 1,
      serviceName: bookingData.serviceName,
      category: bookingData.category,
      serviceRate: bookingData.serviceRate || bookingData.totalCost,
      name: bookingData.name || session.user.name,
      phone: bookingData.phone,
      email: bookingData.email || session.user.email,
      durationType: bookingData.durationType,
      duration: bookingData.duration,
      division: bookingData.division || 'Dhaka',
      district: bookingData.district,
      city: bookingData.city,
      area: bookingData.area,
      address: bookingData.address || `${bookingData.area}, ${bookingData.city}`,
      totalCost: bookingData.totalCost,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'card',
      notes: bookingData.notes || '',
    });

    console.log('✅ Booking Created:', booking._id);

    // ✅ Step 4: Stripe payment intent তৈরি করুন
    const amount = Math.round(bookingData.totalCost * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "bdt",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        bookingId: booking._id.toString(),
        userEmail: session.user.email,
        userName: bookingData.name,
        serviceName: bookingData.serviceName,
      }
    });

    console.log('💳 Payment Intent Created:', paymentIntent.id);

    // ✅ Step 5: Payment record তৈরি করুন
    const payment = await Payment.create({
      user: session.user.id,
      booking: booking._id,
      amount: bookingData.totalCost,
      currency: 'BDT',
      status: 'pending',
      paymentMethod: 'card',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        serviceName: bookingData.serviceName,
        category: bookingData.category,
        duration: `${bookingData.duration} ${bookingData.durationType}`,
        location: `${bookingData.area}, ${bookingData.city}`,
      },
    });

    console.log('💰 Payment Record Created:', payment._id);

    // ✅ Step 6: Booking এ payment reference যোগ করুন
    booking.payment = payment._id;
    await booking.save();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking._id,
      paymentId: payment._id,
    });

  } catch (error) {
    console.error("❌ Payment intent error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}