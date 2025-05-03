import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic"; // Ensure fresh execution

export async function POST(req: Request) {
  // 1. Verify Authorization Header
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    console.error("Missing or malformed Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Extract and Validate Token
  const token = authHeader.split(" ")[1];
  console.log("Expected:", process.env.CRON_SECRET, "Received:", token); // Debug

  if (token !== process.env.CRON_SECRET) {
    console.error("Invalid token");
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // 3. Execute Cron Logic
  const currentYear = new Date().getFullYear();
  try {
    const result = await db.employeeLeaveBalance.updateMany({
      where: { year: currentYear - 1 },
      data: { paidLeaveUsed: 0, lastResetDate: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: `Reset ${result.count} employee leave balances`,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Failed to reset balances" },
      { status: 500 }
    );
  }
}
