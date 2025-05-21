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
      where: {
        Employee: {
          branchId: user?.Employee.branchId,
        },
      },
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
        Employee: {
          branchId: user?.Employee.branchId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Employee: true,
      },
    });
  }

  const overtimeData = await db.extraShift.findMany({
    where: {
      employeeId: user?.employeeId,
      status: "Approved",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedData: AttendanceColumn[] = data.map((item) => {
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

    const formatDateForComparison = (dateString: string) => {
      return format(new Date(dateString), "yyyy-MM-dd");
    };

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

  // Use ISO format for reliable date comparison
  const now = new Date();
  const todayDate = format(now, "yyyy-MM-dd");

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
