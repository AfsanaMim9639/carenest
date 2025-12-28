import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { sendInvoiceEmail } from '@/lib/email/emailService';

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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    await dbConnect();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
        
      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id
  }).populate('booking user');

  if (!payment) {
    console.error('Payment not found for intent:', paymentIntent.id);
    return;
  }

  // Update payment status
  payment.status = 'succeeded';
  payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
  await payment.save();

  // Update booking status
  const booking = await Booking.findById(payment.booking._id)
    .populate('user');
  
  if (booking) {
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // Send invoice email
    try {
      await sendInvoiceEmail({
        to: booking.user.email || booking.email,
        booking: booking,
        payment: payment
      });
    } catch (emailError) {
      console.error('Failed to send invoice email:', emailError);
    }
  }
}

async function handlePaymentFailure(paymentIntent) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntent.id
  });

  if (!payment) return;

  payment.status = 'failed';
  payment.failureMessage = paymentIntent.last_payment_error?.message;
  await payment.save();

  await Booking.findByIdAndUpdate(payment.booking, {
    paymentStatus: 'failed'
  });
}

async function handleRefund(charge) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: charge.payment_intent
  });

  if (!payment) return;

  payment.status = 'refunded';
  payment.refundId = charge.refunds.data[0]?.id;
  payment.refundedAt = new Date();
  await payment.save();

  await Booking.findByIdAndUpdate(payment.booking, {
    paymentStatus: 'refunded',
    status: 'cancelled'
  });
}