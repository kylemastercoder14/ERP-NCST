import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AttendanceColumn } from "./_components/column";
import { format } from "date-fns";
import AttendanceClient from "./_components/client";
import { useUser } from "@/hooks/use-user";
import ClockInOut from "./_components/clock-in-out";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();

  const now = new Date();
  const todayDate = format(now, "MMMM dd, yyyy");
  const currentTime = format(now, "hh:mm:ss a");

  const user = await db.userAccount.findUnique({
    where: { id: userId },
    select: { employeeId: true },
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
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const formattedData: AttendanceColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        timeIn: item.timeIn || "--",
        timeOut: item.timeOut || "--",
        attendanceStatus: item.status,
        date: item.date,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={`Today's Attendance: ${todayDate} at ${currentTime}`}
          description="Monitor all your attendance records here."
        />
        <ClockInOut todayDate={todayDate} employeeId={user.employeeId} />
      </div>
      <Separator className="my-5" />
      <AttendanceClient data={formattedData} />
    </div>
  );
};

export default Page;
