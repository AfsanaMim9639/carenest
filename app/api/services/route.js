// app/api/services/route.js
// Public API to fetch active services (no auth required)
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";

    const query = { isActive: true }; // Only fetch active services
    
    if (category && category !== "All") {
      query.category = category;
    }

    const services = await Service.find(query)
      .sort({ popularity: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      services,
      total: services.length,
    });
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}