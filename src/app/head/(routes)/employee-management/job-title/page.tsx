import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { JobTitleColumn } from "./_components/column";
import { format } from "date-fns";
import JobTitleClient from "./_components/client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Page = async () => {
  const data = await db.jobTitle.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const formattedData: JobTitleColumn[] =
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
          title="List of Job Titles"
          description="Manage all the job title information here."
        />
        <Button size="sm">
          <Link href="/head/employee-management/job-title/create">+ Add Job Title</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <JobTitleClient data={formattedData} />
    </div>
  );
};

export default Page;
