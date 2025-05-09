"use client";

import React, { Suspense } from "react";
import ApplicantForm from "@/components/forms/applicant-form";
import { Department, JobTitle } from "@prisma/client";

const Client = ({
  jobTitles,
  departments,
}: {
  jobTitles: JobTitle[];
  departments: Department[];
}) => {
  return (
    <Suspense fallback="">
      <ApplicantForm
        jobTitles={jobTitles}
        departments={departments}
        initialData={null}
        isNewApplicant={true}
      />
    </Suspense>
  );
};

export default Client;
