import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AttendanceColumn } from "./_components/column";
import { format } from "date-fns";
import AttendanceClient from "./_components/client";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.attendance.findMany({
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

  const overtimeData = await db.extraShift.findMany({
    where: {
      employeeId: data[0]?.employeeId,
      status: "Approved",
    },
    orderBy: {
      createdAt: "desc",
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

    // Format both dates to the same format for comparison
    const formatDateForComparison = (dateString: string) => {
      return format(new Date(dateString), "yyyy-MM-dd");
    };

    // Check if there's approved overtime for this attendance date
    const hasOvertime = overtimeData.some(
      (ot) =>
        formatDateForComparison(ot.date) === formatDateForComparison(item.date)
    );

    return {
      id: item.id,
      licenseNo: item.Employee.licenseNo || "N/A",
      name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
      timeIn: item.timeIn || "--",
      timeOut: item.timeOut || "--",
      attendanceStatus: item.status,
      date: item.date,
      createdAt: safeFormat(item.createdAt, "MMMM dd, yyyy"),
      hasOvertime: hasOvertime,
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
