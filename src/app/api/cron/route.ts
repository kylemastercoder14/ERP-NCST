import { NextResponse } from "next/server";
import db from "@/lib/db";

// Force dynamic execution and set max duration
export const dynamic = "force-dynamic";
export const maxDuration = 30; // Seconds

export async function POST(req: Request) {
  // 1. Strict Authorization Header Check
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    console.error("🚨 Missing or malformed Authorization header");
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // 2. Secure Token Validation
  const token = authHeader.split(" ")[1].trim(); // Trim whitespace
  const expectedToken = process.env.CRON_SECRET;

  // Constant-time comparison to prevent timing attacks
  let isValid = true;
  if (token.length !== expectedToken?.length) {
    isValid = false;
  } else {
    for (let i = 0; i < token.length; i++) {
      if (token.charCodeAt(i) !== expectedToken.charCodeAt(i)) {
        isValid = false;
      }
    }
  }

  if (!isValid) {
    console.error("🔒 Invalid token attempt");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Execute Cron Job
  const currentYear = new Date().getFullYear();
  try {
    const result = await db.employeeLeaveBalance.updateMany({
      where: { year: currentYear - 1 },
      data: {
        paidLeaveUsed: 0,
        lastResetDate: new Date(),
      },
    });

    console.log(`✅ Reset ${result.count} employee balances`);
    return NextResponse.json({
      success: true,
      message: `Reset ${result.count} employee leave balances`,
    });
  } catch (error) {
    console.error("❌ Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
