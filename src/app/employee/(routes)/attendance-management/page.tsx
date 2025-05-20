import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AttendanceColumn } from "./_components/column";
import { format } from "date-fns";
import AttendanceClient from "./_components/client";
import { useUser } from "@/hooks/use-user";
import ClockInOut from "./_components/clock-in-out";

const getLocalTime = (timezone: string = "Asia/Manila") => {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone })
  );
};

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();

  const userTimezone = "Asia/Manila";
  const now = getLocalTime(userTimezone); // 👈 Use the corrected local time
  const todayDate = format(now, "MMMM dd, yyyy");
  const currentTime = format(now, "hh:mm:ss a");

  const user = await db.userAccount.findUnique({
    where: { id: userId },
    select: {
      employeeId: true,
      Employee: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          licenseNo: true,
          shift: true,
          Department: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user?.employeeId) {
    console.log("⚠️ No employeeId found for this user");
    return;
  }

  const data = await db.attendance.findMany({
    where: {
      employeeId: user.employeeId,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const overtimeData = await db.extraShift.findMany({
    where: {
      employeeId: user.employeeId,
      status: "Approved",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatDateForComparison = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const formattedData: AttendanceColumn[] = data.map((item) => {
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
      shift: item.Employee.shift || "N/A",
      createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      hasOvertime: hasOvertime,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={`Today's Attendance: ${todayDate} at ${currentTime}`}
          description="Monitor all your attendance records here."
        />
        <ClockInOut todayDate={todayDate} shift={user.Employee.shift as string} employeeId={user.employeeId} />
      </div>
      <Separator className="my-5" />
      <AttendanceClient data={formattedData} />
    </div>
  );
};

export default Page;
