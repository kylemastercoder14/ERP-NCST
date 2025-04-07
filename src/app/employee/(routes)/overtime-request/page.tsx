import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ExtraShiftColumn } from "./_components/column";
import { format } from "date-fns";
import ExtraShiftClient from "./_components/client";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();

  const user = await db.userAccount.findUnique({
    where: { id: userId },
    select: { employeeId: true },
  });

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

  const formattedData: ExtraShiftColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        type: item.type,
        timeIn: format(new Date(item.timeStart), "hh:mm a"),
        timeOut: format(new Date(item.timeEnd), "hh:mm a"),
        status: item.status,
        date: format(new Date(item.date), "MMMM dd, yyyy"),
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  const now = new Date();
  const currentHour = now.getHours(); // 24-hour format
  const isAfter5PM = currentHour >= 17;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Requested Overtime"
          description="Manage all the list of your requested overtime. You can also update the request."
        />
        <Button
          size="sm"
          disabled={!isAfter5PM}
          className={!isAfter5PM ? "cursor-not-allowed opacity-50" : ""}
        >
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
