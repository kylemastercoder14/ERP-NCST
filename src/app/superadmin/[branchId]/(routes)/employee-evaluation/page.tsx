import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { Column } from "./_components/column";
import { format } from "date-fns";
import Client from "./_components/client";

const Page = async () => {
  const data = await db.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      ratings: true,
      employee: true,
      client: true,
    },
  });

  const formattedData: Column[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.employee?.licenseNo || "N/A",
        name: `${item.employee?.firstName} ${item.employee?.middleName} ${item.employee?.lastName}`,
        averageRating: parseFloat(item.average.toFixed(1)),
        overallPerformance: item.summary,
        clientName: item.client?.name || "N/A",
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Employee Evaluation"
          description="Manage all the employees evaluation here."
        />
      </div>
      <Separator className="my-5" />
      <Client data={formattedData} />
    </div>
  );
};

export default Page;
