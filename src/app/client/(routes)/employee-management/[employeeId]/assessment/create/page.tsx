import { notFound } from "next/navigation";
import db from "@/lib/db";
import { EmployeeAssessment } from "@/components/global/employee-assessment";

interface PageProps {
  params: {
    employeeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const employee = await db.employee.findUnique({
    where: {
      id: params.employeeId,
    },
    include: {
      JobTitle: true,
      Client: true,
    },
  });

  if (!employee) {
    return notFound();
  }

  return (
    <div className="pb-8">
      <EmployeeAssessment
        employee={employee}
        jobTitle={employee.JobTitle.name}
        client={employee.Client ? employee.Client.name : ""}
      />
    </div>
  );
};

export default Page;
