import React from "react";
import db from "@/lib/db";
import ExtraShiftForm from '@/components/forms/extra-shift-form';

const Page = async (props: {
  params: Promise<{
	extraShiftId: string;
  }>;
}) => {
  const params = await props.params;
  const extraShift = await db.extraShift.findUnique({
	where: {
	  id: params.extraShiftId,
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
	  <ExtraShiftForm employees={employees} initialData={extraShift} />
	</div>
  );
};

export default Page;
