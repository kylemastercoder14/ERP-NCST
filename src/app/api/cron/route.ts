import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // Verify the cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const currentYear = new Date().getFullYear();

  try {
    const result = await db.employeeLeaveBalance.updateMany({
      where: { year: currentYear - 1 },
      data: { paidLeaveUsed: 0, lastResetDate: new Date() },
    });

    return res.status(200).json({
      message: `Reset ${result.count} employee leave balances`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to reset balances" });
  }
}
