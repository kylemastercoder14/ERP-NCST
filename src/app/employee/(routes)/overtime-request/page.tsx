import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ExtraShiftColumn } from "./_components/column";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import ExtraShiftClient from "./_components/client";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Manila timezone
const TIMEZONE = "Asia/Manila";

/**
 * Helper function to format dates in Manila timezone
 */
const formatInManila = (
  dateString: string | Date,
  formatString: string
): string => {
  try {
    // Handle both string and Date inputs
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
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

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const departmentSession = user?.Employee.Department.name;

  // For employees, only show their own requests
  const data = await db.extraShift.findMany({
    where: {
      employeeId: user?.employeeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
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
      departmentSession: departmentSession || "",
      // Format dates in Manila timezone
      date: formatInManila(item.date, "MMMM dd, yyyy"),
      createdAt: formatInManila(item.createdAt, "MMMM dd, yyyy"),
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Your Overtime Requests"
          description="View and manage all of your submitted overtime requests."
        />
        <Button size="sm">
          <Link href={`/employee/overtime-request/create`}>
            + Request Overtime
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <ExtraShiftClient data={formattedData} />
    </div>
  );
};

export default Page;
