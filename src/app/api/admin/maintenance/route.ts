import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const settings = await db.siteSettings.findFirst();
  return NextResponse.json({
    maintenanceMode: settings?.maintenanceMode || false,
    maintenanceMessage: settings?.maintenanceMessage || "",
    maintenanceEndDate: settings?.maintenanceEndDate?.toISOString() || "",
  });
}

export async function POST(req: Request) {
  try {
    const { maintenanceMode, maintenanceMessage, maintenanceEndDate } =
      await req.json();

    await db.siteSettings.upsert({
      where: { id: "1" },
      update: {
        maintenanceMode,
        maintenanceMessage,
        maintenanceEndDate: maintenanceEndDate
          ? new Date(maintenanceEndDate)
          : null,
      },
      create: {
        id: "1",
        maintenanceMode,
        maintenanceMessage,
        maintenanceEndDate: maintenanceEndDate
          ? new Date(maintenanceEndDate)
          : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
