"use client";

import React, { Suspense } from "react";
import ApplicantForm from "@/components/forms/applicant-form";
import { Branch, Department, JobTitle } from "@prisma/client";

const Client = ({
  jobTitles,
  departments,
  branches,
}: {
  jobTitles: JobTitle[];
  departments: Department[];
  branches: Branch[];
}) => {
  return (
    <Suspense fallback="">
      <ApplicantForm
        branches={branches}
        jobTitles={jobTitles}
        departments={departments}
        initialData={null}
        isNewApplicant={true}
      />
    </Suspense>
  );
};

export default Client;
