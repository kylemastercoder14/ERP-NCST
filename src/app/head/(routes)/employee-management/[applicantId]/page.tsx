import React from "react";
import db from "@/lib/db";
import ApplicantForm from '@/components/forms/applicant-form';

const Page = async (props: {
  params: Promise<{
    applicantId: string;
  }>;
}) => {
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
    },
  });
  return (
    <div>
      <ApplicantForm initialData={applicant} />
    </div>
  );
};

export default Page;
