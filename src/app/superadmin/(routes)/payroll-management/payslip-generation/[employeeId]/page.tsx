import React from "react";
import db from "@/lib/db";
import PayslipGenerationForm from "@/components/forms/payslip-generation-form";

const Page = async (props: {
  params: Promise<{
	employeeId: string;
  }>;
}) => {
  const params = await props.params;
  const employee = await db.employee.findUnique({
	where: {
	  id: params.employeeId,
	},
	include: {
	  BaseSalary: true,
	  Department: true,
	  JobTitle: true,
	  GovernmentMandatories: true,
	  LeaveManagement: true,
	  Attendance: true,
	  ExtraShift: true,
	  EmployeeLeaveBalance: true
	},
  });

  return (
	<div>
	  <PayslipGenerationForm initialData={employee} />
	</div>
  );
};

export default Page;
