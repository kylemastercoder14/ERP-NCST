import { notFound } from "next/navigation";
import db from "@/lib/db";
import { EmployeeProfileView } from "@/components/global/employee-profile";

interface PageProps {
  params: {
    employeeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const applicant = await db.employee.findUnique({
    where: {
      id: params.employeeId,
    },
    include: {
      CharacterReferences: true,
      EducationRecord: true,
      EmploymentRecord: true,
      Children: true,
      JobTitle: true,
      Department: true,
      UserAccount: true,
    },
  });

  if (!applicant) {
    return notFound();
  }

  // Extract children separately to avoid passing as prop
  const childrenData = applicant.Children;
  const educationData = applicant.EducationRecord;
  const employmentData = applicant.EmploymentRecord;
  const referencesData = applicant.CharacterReferences;

  return (
    <div className="py-8">
      <EmployeeProfileView
        childrenData={childrenData}
        education={educationData}
        employment={employmentData}
        references={referencesData}
        employee={applicant}
        department={applicant.Department?.name || "N/A"}
        jobTitle={applicant.JobTitle?.name || "N/A"}
      />
    </div>
  );
};

export default Page;
