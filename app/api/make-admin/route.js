import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();
    
    // Find the user
    const user = await User.findOne({ email: "admin@carenest.com" });
    
    if (!user) {
      return NextResponse.json({ 
        error: "User not found with email: admin@carenest.com",
        message: "Please register this account first"
      }, { status: 404 });
    }

    // Update to admin
    user.role = "admin";
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "User is now admin!",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        _id: user._id
      }
    });

  } catch (error) {
    console.error("Make admin error:", error);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}