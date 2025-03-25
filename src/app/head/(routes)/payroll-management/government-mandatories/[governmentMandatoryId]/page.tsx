import React from "react";
import db from "@/lib/db";
import GovernmentMandatoryForm from "@/components/forms/government-mandatory-form";

const Page = async (props: {
  params: Promise<{
	governmentMandatoryId: string;
  }>;
}) => {
  const params = await props.params;
  const governmentMandatories = await db.governmentMandatories.findUnique({
	where: {
	  id: params.governmentMandatoryId,
	},
	include: {
	  Employee: true,
	},
  });

  // employee Lists
  const employees = await db.employee.findMany({
	orderBy: {
	  lastName: "asc",
	},
  });

  return (
	<div>
	  <GovernmentMandatoryForm employees={employees} initialData={governmentMandatories} />
	</div>
  );
};

export default Page;
