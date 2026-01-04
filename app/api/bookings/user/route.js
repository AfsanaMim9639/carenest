import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/mongodb";
import Booking from "@/models/Booking";

export async function GET(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    console.log('Fetching bookings for user:', session.user.id);

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // Build query
    const query = { user: session.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    console.log('Query:', query);

    // Fetch bookings - REMOVED .populate() to fix the error
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found bookings:', bookings.length);

    // Format bookings for frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      serviceName: booking.serviceName,
      serviceIcon: booking.serviceIcon || '🏥',
      duration: `${booking.duration} ${booking.durationType}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      time: `${booking.startTime} - ${booking.endTime}`,
      location: booking.location || `${booking.area}, ${booking.city}`,
      totalCost: booking.totalCost,
      status: booking.status,
      caregiverName: booking.caregiverName || 'Pending Assignment',
      bookedOn: booking.createdAt,
      specialRequirements: booking.specialRequirements || booking.notes || '',
      paymentStatus: booking.paymentStatus,
      // Additional fields for details modal
      phone: booking.phone,
      email: booking.email,
      address: booking.address,
      division: booking.division,
      district: booking.district,
      city: booking.city,
      area: booking.area
    }));

    return NextResponse.json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings
    });

  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch bookings",
        details: error.message 
      },
      { status: 500 }
    );
  }
}