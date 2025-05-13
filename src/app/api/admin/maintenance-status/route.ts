import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const settings = await db.siteSettings.findFirst();
  return NextResponse.json({
    maintenanceMode: settings?.maintenanceMode || false,
  });
}
