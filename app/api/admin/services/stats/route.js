// app/api/admin/services/stats/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [total, active, inactive, byCategory] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: false }),
      Service.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const categoryStats = {
      "Baby Care": 0,
      "Elderly Care": 0,
      "Special Care": 0,
    };

    byCategory.forEach((item) => {
      categoryStats[item._id] = item.count;
    });

    return NextResponse.json({
      total,
      active,
      inactive,
      babyCare: categoryStats["Baby Care"],
      elderlyCare: categoryStats["Elderly Care"],
      specialCare: categoryStats["Special Care"],
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}