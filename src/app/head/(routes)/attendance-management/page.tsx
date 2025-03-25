import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

  const formattedData: AttendanceColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.Employee.licenseNo,
        name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
        timeIn: format(new Date(item.timeIn), "hh:mm a"),
        timeOut: format(new Date(item.timeOut), "hh:mm a"),
        attendanceStatus: item.status,
        date: format(new Date(item.date), "MMMM dd, yyyy"),
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Attendance Monitoring"
          description="Monitor all the attendance of the employees. You can also time in and time out for a specific employee."
        />
        <Button size="sm">
          <Link href={`/head/attendance-management/create`}>
            + Add Attendance
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <AttendanceClient data={formattedData} />
    </div>
  );
};

export default Page;
