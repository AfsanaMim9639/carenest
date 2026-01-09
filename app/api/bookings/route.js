import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import { sendBookingConfirmationEmail } from "@/lib/email/emailService";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();

    // Validation
    if (!body.serviceId || !body.serviceName || !body.name || !body.phone || 
        !body.division || !body.district || !body.city || !body.area || !body.address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const serviceIcons = {
      "Baby Care": "👶",
      "Elderly Care": "👴",
      "Special Care": "🏥"
    };

    const serviceRates = {
      1: 500, 2: 700, 3: 450, 4: 800, 5: 550,
      6: 600, 7: 750, 8: 700, 9: 650, 10: 12000,
      11: 900, 12: 850, 13: 700, 14: 1000
    };

    // Create booking
    const booking = await Booking.create({
      user: session.user.id,
      serviceId: parseInt(body.serviceId),
      serviceName: body.serviceName,
      category: body.category,
      serviceIcon: serviceIcons[body.category] || "🏥",
      serviceRate: serviceRates[body.serviceId] || 0,
      name: body.name,
      phone: body.phone,
      email: body.email || session.user.email,
      durationType: body.durationType,
      duration: parseInt(body.duration),
      division: body.division,
      district: body.district,
      city: body.city,
      area: body.area,
      address: body.address,
      notes: body.notes || "",
      totalCost: parseFloat(body.totalCost),
      status: "pending",
      bookingDate: body.bookingDate ? new Date(body.bookingDate) : new Date(),
      date: new Date(),
      startTime: "TBD",
      endTime: "TBD"
    });

    console.log('✅ Booking created:', booking._id.toString());

    // ✅ Send email (non-blocking)
    const emailTo = body.email || session.user.email;
    
    if (emailTo) {
      // Don't await - send in background
      sendBookingConfirmationEmail({
        to: emailTo,
        customerName: booking.name,
        bookingId: booking._id.toString(),
        serviceName: booking.serviceName,
        duration: `${booking.duration} ${booking.durationType}`,
        totalCost: booking.totalCost,
        location: `${booking.area}, ${booking.city}`,
        date: new Date(booking.bookingDate).toLocaleDateString(),
        phone: booking.phone
      }).catch(err => {
        console.error('❌ Background email failed:', err.message);
      });
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Booking created successfully",
        booking: {
          id: booking._id.toString(),
          serviceName: booking.serviceName,
          status: booking.status,
          totalCost: booking.totalCost
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}