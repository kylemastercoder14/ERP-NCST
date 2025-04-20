import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ApplicantColumn } from "./_components/column";
import { format } from "date-fns";
import ApplicantClient from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.employee.findMany({
    where: {
      isNewEmployee: false,
      branch: user?.Employee?.branch,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      JobTitle: true,
      Department: true,
    },
  });

  const formattedData: ApplicantColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.licenseNo,
        name: `${item.firstName} ${item.middleName} ${item.lastName}`,
        phoneNumber: item.celNo,
        address: item.presentAddress,
        positionDesired: item.JobTitle.name,
        department: item.Department.name,
        gender: item.sex,
        civilStatus: item.civilStatus,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Employee Management"
          description="Manage all the employees information here."
        />
        <Button size="sm">
          <Link href={`/head/employee-management/create`}>+ Add Employee</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <ApplicantClient data={formattedData} />
    </div>
  );
};

export default Page;
