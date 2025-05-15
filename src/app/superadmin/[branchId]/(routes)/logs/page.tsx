import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { Column } from "./_components/column";
import { format } from "date-fns";
import Client from "./_components/client";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.logs.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      User: {
        Employee: {
          branchId: params.branchId,
        },
      },
    },
    include: {
      department: true,
      User: { include: { Employee: true } },
    },
  });

  const formattedData: Column[] =
    data.map((item) => {
      return {
        id: item.id,
        action: item.action,
        department: item.department.name,
        user: item.User.Employee.firstName + " " + item.User.Employee.lastName,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Logs" description="Manage all the logs here." />
      </div>
      <Separator className="my-5" />
      <Client data={formattedData} />
    </div>
  );
};

export default Page;
