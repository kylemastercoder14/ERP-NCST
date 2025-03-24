import React from "react";
import db from "@/lib/db";
import DepartmentForm from "@/components/forms/department-form";

const Page = async (props: {
  params: Promise<{
	departmentId: string;
  }>;
}) => {
  const params = await props.params;
  const department = await db.department.findUnique({
	where: {
	  id: params.departmentId,
	},
  });
  return (
	<div>
	  <DepartmentForm initialData={department} />
	</div>
  );
};

export default Page;
