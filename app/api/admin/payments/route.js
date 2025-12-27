// File location: app/api/admin/payments/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import Payment from '@/models/Payment';

export async function GET(req) {
  try {
    const session = await getServerSession();
    
    // Check admin authorization
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch payments with pagination
    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'booking',
        select: 'serviceDetails totalCost status',
        populate: {
          path: 'service',
          select: 'name type'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const totalCount = await Payment.countDocuments(query);

    return NextResponse.json({
      payments,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Admin payments API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// Refund a payment
export async function POST(req) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { paymentId, reason } = await req.json();

    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Can only refund succeeded payments' },
        { status: 400 }
      );
    }

    // Process refund with Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      reason: reason || 'requested_by_customer'
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refundId = refund.id;
    payment.refundedAt = new Date();
    await payment.save();

    // Update booking
    const Booking = require('@/models/Booking').default;
    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: 'refunded',
      status: 'cancelled'
    });

    return NextResponse.json({
      message: 'Payment refunded successfully',
      payment
    });

  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}