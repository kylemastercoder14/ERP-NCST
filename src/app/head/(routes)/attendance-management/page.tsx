import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AttendanceColumn } from "./_components/column";
import { format } from "date-fns";
import AttendanceClient from "./_components/client";

const Page = async () => {
  const data = await db.attendance.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const formattedData: AttendanceColumn[] = data.map((item) => {
    // Helper function to safely format dates
    const safeFormat = (
      dateString: string | Date | null | undefined,
      formatStr: string
    ) => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : format(date, formatStr);
      } catch {
        return "N/A";
      }
    };

    return {
      id: item.id,
      licenseNo: item.Employee.licenseNo || "N/A",
      name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
      timeIn: item.timeIn || "--",
      timeOut: item.timeOut || "--",
      attendanceStatus: item.status,
      date: item.date,
      createdAt: safeFormat(item.createdAt, "MMMM dd, yyyy"),
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Attendance Monitoring"
          description="Monitor all the attendance of the employees."
        />
      </div>
      <Separator className="my-5" />
      <AttendanceClient data={formattedData} />
    </div>
  );
};

export default Page;
