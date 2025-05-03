import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic"; // Ensure this runs dynamically (not cached)

export async function POST(req: Request) {
  // Verify the cron secret
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

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
