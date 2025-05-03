import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  // Authorization check (keep your existing security logic)
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    console.error("🚨 Missing or malformed Authorization header");
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1].trim();
  const expectedToken = process.env.CRON_SECRET;

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

  // Cron job logic
  const currentYear = new Date().getFullYear();

  try {
    // 1. Get all active employees
    const employees = await db.employee.findMany({
      where: { isNewEmployee: false },
      select: { id: true },
    });

    let createdCount = 0;
    let updatedCount = 0;

    // 2. Process each employee
    for (const employee of employees) {
      // Check if record exists for current year
      const existingRecord = await db.employeeLeaveBalance.findUnique({
        where: {
          employeeId_year: {
            employeeId: employee.id,
            year: currentYear,
          },
        },
      });

      if (existingRecord) {
        // Update existing record if needed (reset used days)
        await db.employeeLeaveBalance.update({
          where: {
            employeeId_year: {
              employeeId: employee.id,
              year: currentYear,
            },
          },
          data: {
            paidLeaveUsed: 0,
            paidLeaveTotal: 5, // Ensure threshold is set
            lastResetDate: new Date(),
          },
        });
        updatedCount++;
      } else {
        // Create new record for current year
        await db.employeeLeaveBalance.create({
          data: {
            employeeId: employee.id,
            year: currentYear,
            paidLeaveTotal: 5, // Set the threshold
            paidLeaveUsed: 0,
            lastResetDate: new Date(),
          },
        });
        createdCount++;
      }
    }

    console.log(
      `✅ Reset complete. Created: ${createdCount}, Updated: ${updatedCount}`
    );

    return NextResponse.json({
      success: true,
      message: `Leave balances reset for ${employees.length} employees`,
      stats: {
        created: createdCount,
        updated: updatedCount,
      },
    });
  } catch (error) {
    console.error("❌ Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
