import React from "react";
import db from "@/lib/db";
import ApplicantForm from "@/components/forms/applicant-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    applicantId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const params = await props.params;
  const applicant = await db.employee.findUnique({
    where: {
      id: params.applicantId,
    },
    include: {
      CharacterReferences: true,
      EducationRecord: true,
      EmploymentRecord: true,
      Children: true,
      JobTitle: true,
      Department: true,
      UserAccount: true,
      Branch: true,
    },
  });

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

  const branches = await db.branch.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const transformedApplicant = applicant
    ? {
        ...applicant,
        UserAccount:
          Array.isArray(applicant.UserAccount) &&
          applicant.UserAccount.length > 0
            ? applicant.UserAccount[0]
            : null,
      }
    : null;

  return (
    <div>
      <ApplicantForm
        jobTitles={jobTitles}
        departments={departments}
        branches={branches}
        initialData={transformedApplicant}
        initialBranch={user?.Employee.branchId}
      />
    </div>
  );
};

export default Page;
