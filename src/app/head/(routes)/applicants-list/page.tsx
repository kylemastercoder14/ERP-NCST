import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { Column } from "./_components/column";
import { format } from "date-fns";
import Client from "./_components/client";

const Page = async () => {
  const data = await db.applicantList.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Department: true,
      JobTitle: true,
      Branch: true,
    },
  });

  const formattedData: Column[] =
    data.map((item) => {
      return {
        id: item.id,
        name: item.firstName + " " + item.lastName,
        email: item.email,
        resume: item.resume,
        branch: item.Branch?.name || "N/A",
        department: item.Department?.name || "N/A",
        jobTitle: item.JobTitle?.name || "N/A",
        departmentId: item.departmentId || "",
        jobTitleId: item.jobTitleId || "",
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Applicants"
          description="Manage all the applicants here."
        />
      </div>
      <Separator className="my-5" />
      <Client data={formattedData} />
    </div>
  );
};

export default Page;
