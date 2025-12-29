import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await req.json();
    const { nid, name, email, contact, password } = body;

    console.log("Registration attempt for:", email);

    // Validation
    if (!name || !email || !contact || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() }, 
        { phone: contact }
      ] 
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          error: existingUser.email === email.toLowerCase() 
            ? "Email already registered" 
            : "Phone number already registered" 
        },
        { status: 400 }
      );
    }

    // Create user (password will be hashed by pre-save hook)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: contact.trim(),
      password,
      provider: 'credentials',
      emailVerified: false,
      isActive: true,
      role: 'user'
    });

    await user.save();

    console.log("User created successfully:", user._id);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: messages[0] || "Validation failed" },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}