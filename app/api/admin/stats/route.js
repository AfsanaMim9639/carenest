import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get statistics
    const [totalUsers, totalBookings, pendingBookings, bookings] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.find({}).select('totalCost').lean()
    ]);

    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalCost || 0), 0);

    return NextResponse.json({
      totalUsers,
      totalBookings,
      pendingBookings,
      totalRevenue
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}