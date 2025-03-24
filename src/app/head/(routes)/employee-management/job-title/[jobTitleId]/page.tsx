import React from "react";
import db from "@/lib/db";
import JobTitleForm from "@/components/forms/job-title-form";

const Page = async (props: {
  params: Promise<{
    jobTitleId: string;
  }>;
}) => {
  const params = await props.params;
  const jobTitle = await db.jobTitle.findUnique({
    where: {
      id: params.jobTitleId,
    },
  });
  return (
    <div>
      <JobTitleForm initialData={jobTitle} />
    </div>
  );
};

export default Page;
