import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import mongoose from "mongoose";

// GET - Get single booking
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // ✅ FIX: Await params
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({
      _id: id,
      user: session.user.id
    }).lean();

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
        id: booking._id.toString(),
        displayId: `#${booking._id.toString().slice(-8).toUpperCase()}`,
        location: booking.location || `${booking.area}, ${booking.city}`,
        time: `${booking.startTime} - ${booking.endTime}`
      }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(req, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // ✅ FIX: Await params
    const { id } = await params;

    console.log('Attempting to cancel booking:', id);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    // Find booking
    const booking = await Booking.findOne({
      _id: id,
      user: session.user.id
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or you do not have permission' },
        { status: 404 }
      );
    }

    // Check if booking can be cancelled
    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot cancel ${booking.status} booking` },
        { status: 400 }
      );
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = 'Cancelled by user';
    await booking.save();

    console.log('Booking cancelled successfully:', id);

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      booking: {
        id: booking._id.toString(),
        status: booking.status
      }
    });

  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { 
        error: "Failed to cancel booking",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PATCH - Update booking
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // ✅ FIX: Await params
    const { id } = await params;
    const updates = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}