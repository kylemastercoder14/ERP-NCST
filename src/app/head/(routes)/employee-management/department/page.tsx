import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { DepartmentColumn } from "./_components/column";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DepartmentClient from "./_components/client";

const Page = async () => {
  const data = await db.department.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const formattedData: DepartmentColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        employeeCount: item.Employee.length,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Departments"
          description="Manage all the department information here."
        />
        <Button size="sm">
          <Link href="/head/employee-management/department/create">
            + Add Department
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <DepartmentClient data={formattedData} />
    </div>
  );
};

export default Page;
