import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ExtraShiftColumn } from "./_components/column";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import ExtraShiftClient from "./_components/client";

// Manila timezone
const TIMEZONE = "Asia/Manila";

/**
 * Helper function to format dates in Manila timezone
 */
const formatInManila = (dateString: string | Date, formatString: string): string => {
  try {
    // Handle both string and Date inputs
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    // Convert to Manila timezone
    const manilaDate = toZonedTime(date, TIMEZONE);
    // Format the date
    return format(manilaDate, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.extraShift.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
    where: {
      Employee: {
        branchId: params.branchId,
      },
    },
  });

  const formattedData: ExtraShiftColumn[] = data.map((item) => {
    return {
      id: item.id,
      licenseNo: item.Employee.licenseNo || "N/A",
      name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
      type: item.type,
      // Format times in Manila timezone
      timeIn: formatInManila(item.timeStart, "hh:mm a"),
      timeOut: formatInManila(item.timeEnd, "hh:mm a"),
      status: item.status,
      // Format dates in Manila timezone
      date: formatInManila(item.date, "MMMM dd, yyyy"),
      createdAt: formatInManila(item.createdAt, "MMMM dd, yyyy"),
    };
  }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Requested Overtime"
          description="Manage the list of requested overtime. You can approve or reject the request."
        />
      </div>
      <Separator className="my-5" />
      <ExtraShiftClient data={formattedData} />
    </div>
  );
};

export default Page;
