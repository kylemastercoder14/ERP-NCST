import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AttendanceColumn } from "./_components/column";
import { format } from "date-fns";
import AttendanceClient from "./_components/client";
import ClockInOut from "./_components/clock-in-out";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const departmentSession = user?.Employee.Department.name;

  let data;

  if (departmentSession === "Human Resource") {
    data = await db.attendance.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Employee: true,
      },
    });
  } else {
    data = await db.attendance.findMany({
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
  }

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

  const now = new Date();
  const todayDate = format(now, "MMMM dd, yyyy");

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Attendance Monitoring"
          description="Monitor all the attendance of the employees."
        />
        <ClockInOut
          todayDate={todayDate}
          employeeId={user?.employeeId as string}
        />
      </div>
      <Separator className="my-5" />
      <AttendanceClient data={formattedData} />
    </div>
  );
};

export default Page;
