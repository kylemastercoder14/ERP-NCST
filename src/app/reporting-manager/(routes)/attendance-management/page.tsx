import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AttendanceColumn } from "./_components/column";
import { format } from "date-fns";
import AttendanceClient from "./_components/client";
import { useUser } from "@/hooks/use-user";
import ClockInOut from './_components/clock-in-out';

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();

  const now = new Date();
  const todayDate = format(now, "MMMM dd, yyyy");

  const employee = await db.employee.findFirst({
    where: {
      id: user?.employeeId,
    },
    include: {
      Department: true,
    },
  });

  const data = await db.attendance.findMany({
    where: {
      Employee: {
        Department: {
          name: employee?.Department.name,
        },
      },
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
        licenseNo: item.Employee.licenseNo || "N/A",
        name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
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
          title="Attendance Monitoring"
          description="Monitor all the attendance of the employees. You can view all the attendance of the employees of your department here. You can also time in and time out here."
        />
        <ClockInOut todayDate={todayDate} employeeId={employee?.id as string} />
      </div>
      <Separator className="my-5" />
      <AttendanceClient data={formattedData} />
    </div>
  );
};

export default Page;
