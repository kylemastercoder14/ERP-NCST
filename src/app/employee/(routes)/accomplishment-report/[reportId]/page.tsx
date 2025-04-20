import React from "react";
import db from "@/lib/db";
import AccomplishmentReportForm from "@/components/forms/accomplishment-report-form";

const Page = async (props: {
  params: Promise<{
	reportId: string;
  }>;
}) => {
  const params = await props.params;
  const accomplishmentReport = await db.accomplishmentReport.findUnique({
	where: {
	  id: params.reportId,
	},
	include: {
	  Employee: true,
	},
  });

  return (
	<div>
	  <AccomplishmentReportForm initialData={accomplishmentReport} />
	</div>
  );
};

export default Page;
