import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ExtraShiftColumn } from "./_components/column";
import { format } from "date-fns";
import ExtraShiftClient from "./_components/client";

const Page = async () => {
  const data = await db.extraShift.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const formattedData: ExtraShiftColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.Employee.licenseNo,
        name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
        type: item.type,
        timeIn: format(new Date(item.timeStart), "hh:mm a"),
        timeOut: format(new Date(item.timeEnd), "hh:mm a"),
        status: item.status,
        date: format(new Date(item.date), "MMMM dd, yyyy"),
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Requested Overtime/Undertime"
          description="Manage the list of requested overtime/undertime. You can approve or reject the request."
        />
        <Button size="sm">
          <Link href={`/head/attendance-management/overtime-undertime/create`}>
            + Request Overtime/Undertime
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <ExtraShiftClient data={formattedData} />
    </div>
  );
};

export default Page;
