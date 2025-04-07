import React from "react";
import db from "@/lib/db";
import ExtraShiftForm from "@/components/forms/extra-shift-form";

const Page = async (props: {
  params: Promise<{
	overtimeId: string;
  }>;
}) => {
  const params = await props.params;
  const leave = await db.extraShift.findUnique({
	where: {
	  id: params.overtimeId,
	},
	include: {
	  Employee: true,
	},
  });

  return (
	<div>
	  <ExtraShiftForm initialData={leave} />
	</div>
  );
};

export default Page;
