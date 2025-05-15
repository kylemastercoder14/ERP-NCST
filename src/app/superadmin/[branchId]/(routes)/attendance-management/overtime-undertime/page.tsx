import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ExtraShiftColumn } from "./_components/column";
import { format } from "date-fns";
import ExtraShiftClient from "./_components/client";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.extraShift.findMany({
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

  const formattedData: ExtraShiftColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.Employee.licenseNo || "N/A",
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
          title="List of Requested Overtime"
          description="Manage the list of requested overtime. You can approve or reject the request."
        />
      </div>
      <Separator className="my-5" />
      <ExtraShiftClient data={formattedData} />
    </div>
  );
};

export default Page;
