import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { BaseSalaryColumn } from "./_components/column";
import { format } from "date-fns";
import BaseSalaryClient from "./_components/client";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.baseSalary.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: {
        include: {
          Department: true,
          JobTitle: true,
        },
      },
    },
    where: {
      Employee: {
        branchId: params.branchId,
      },
    },
  });

  const formattedData: BaseSalaryColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.Employee.licenseNo || "N/A",
        name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
        type: item.type,
        amount: `₱${parseFloat(item.amount.toFixed(2)).toLocaleString()}`,
        department: item.Employee.Department.name,
        position: item.Employee.JobTitle.name,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Base Salary Management"
          description="Manage all the base salary here. This will help the system in computing the employee's salary."
        />
        <Button size="sm">
          <Link href={`/superadmin/${params.branchId}/payroll-management/base-salary/create`}>
            + Add Base Salary
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <BaseSalaryClient data={formattedData} />
    </div>
  );
};

export default Page;
