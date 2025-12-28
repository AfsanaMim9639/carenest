import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';

// Conditionally initialize Stripe
let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.error('Stripe initialization error:', error);
}

export async function POST(req) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { bookingData } = await req.json();
    
    if (!bookingData || !bookingData.totalCost) {
      return NextResponse.json(
        { error: 'Invalid booking data' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      user: session.user.id,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      category: bookingData.category,
      serviceRate: bookingData.totalCost / bookingData.duration,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      durationType: bookingData.durationType,
      duration: bookingData.duration,
      division: bookingData.division,
      district: bookingData.district,
      city: bookingData.city,
      area: bookingData.area,
      address: bookingData.address,
      notes: bookingData.notes,
      totalCost: bookingData.totalCost,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: new Date()
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(bookingData.totalCost * 100),
      currency: 'bdt',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: booking._id.toString(),
        userId: session.user.id,
        serviceId: bookingData.serviceId.toString(),
        serviceName: bookingData.serviceName,
        userName: bookingData.name,
        userPhone: bookingData.phone
      },
      description: `${bookingData.serviceName} - ${bookingData.duration} ${bookingData.durationType}`
    });

    // Create payment record
    const payment = await Payment.create({
      user: session.user.id,
      booking: booking._id,
      amount: bookingData.totalCost,
      currency: 'bdt',
      status: 'pending',
      paymentMethod: 'card',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        bookingId: booking._id.toString(),
        serviceName: bookingData.serviceName
      }
    });

    booking.payment = payment._id;
    await booking.save();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      bookingId: booking._id.toString(),
      paymentId: payment._id.toString()
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    );
  }
}