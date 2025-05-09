import React from "react";
import db from "@/lib/db";
import JobPostingForm from "@/components/forms/job-posting-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    jobPostId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const params = await props.params;
  const jobPosting = await db.jobPosting.findUnique({
    where: {
      id: params.jobPostId,
    },
  });

  const department = user?.Employee?.Department.name;

  const departments = await db.department.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const jobPositions = await db.jobTitle.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <JobPostingForm
        initialData={jobPosting}
        department={department as string}
        departments={departments}
        jobPositions={jobPositions}
      />
    </div>
  );
};

export default Page;
