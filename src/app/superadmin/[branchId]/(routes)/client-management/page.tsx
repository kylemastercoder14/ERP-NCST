import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ClientColumn } from "./_components/column";
import { format } from "date-fns";
import CompanyClient from "./_components/client";

const Page = async () => {
  const data = await db.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const formattedData: ClientColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        logo: item.logo || "",
        email: item.email,
        contactNo: item.contactNo === "" ? "No contact number provided" : item.contactNo,
        address: item.address === "" ? "No address provided" : item.address,
        employeeCount: item.Employee.length,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Client Management"
          description="Manage all the clients information here."
        />
        <Button size="sm">
          <Link href={`/head/client-management/create`}>+ Add Client</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <CompanyClient data={formattedData} />
    </div>
  );
};

export default Page;
