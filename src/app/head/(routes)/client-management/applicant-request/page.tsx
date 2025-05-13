import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { Column } from "./_components/column";
import { format } from "date-fns";
import Client from "./_components/client";

const Page = async () => {
  const data = await db.applicantRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      genderRequirements: true,
      Client: true
    },
  });

  const formattedData: Column[] =
    data.map((item) => {
      const genderCount = item.genderRequirements
        .map((req) => `${req.count} ${req.gender}`)
        .join(", ");
      return {
        id: item.id,
        client: item.Client.name,
        totalApplicants: item.totalApplicants,
        ageRange: `${item.minAge} - ${item.maxAge} years old`,
        genderCount: genderCount,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Applicant Requests"
          description="Manage all the applicant requests here."
        />
      </div>
      <Separator className="my-5" />
      <Client data={formattedData} />
    </div>
  );
};

export default Page;
