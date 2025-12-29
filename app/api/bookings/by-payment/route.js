import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Booking from '@/models/Booking';
import Payment from '@/models/Payment';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const paymentIntent = searchParams.get('paymentIntent');

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent ID required' },
        { status: 400 }
      );
    }

    console.log('Looking for booking with payment intent:', paymentIntent);

    // Find payment record
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent
    }).populate('booking');

    if (!payment || !payment.booking) {
      return NextResponse.json(
        { error: 'Booking not found for this payment' },
        { status: 404 }
      );
    }

    // Get full booking details
    const booking = await Booking.findById(payment.booking).lean();

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        _id: booking._id.toString(),
        displayId: `#${booking._id.toString().slice(-8).toUpperCase()}`,
        location: booking.location || `${booking.area}, ${booking.city}`,
        paymentIntentId: paymentIntent
      }
    });

  } catch (error) {
    console.error('Get booking by payment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking', details: error.message },
      { status: 500 }
    );
  }
}