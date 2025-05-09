import React from "react";
import ApplicantForm from "@/components/forms/applicant-form";
import db from "@/lib/db";

const Page = async () => {
  // jobTitle Lists
  const jobTitles = await db.jobTitle.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // department Lists
  const departments = await db.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="px-10 py-5">
      <ApplicantForm
        jobTitles={jobTitles}
        departments={departments}
        initialData={null}
        isNewApplicant={true}
      />
    </div>
  );
};

export default Page;
