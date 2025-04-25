import React from "react";
import db from "@/lib/db";
import AccountReceivableForm from "@/components/forms/account-receivable-form";

const Page = async (props: {
  params: Promise<{
	receivableId: string;
  }>;
}) => {
  const params = await props.params;
  const payable = await db.transaction.findUnique({
	where: {
	  id: params.receivableId,
	},
  });

  const clients = await db.client.findMany({
	orderBy: {
	  name: "asc",
	},
  });

  return (
	<div>
	  <AccountReceivableForm initialData={payable} clients={clients} />
	</div>
  );
};

export default Page;
