import React from "react";
import db from "@/lib/db";
import WithdrawalRequestForm from "@/components/forms/withdrawal-request-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
	withdrawalId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const department = user?.Employee?.Department.name;
  const params = await props.params;
  const withdrawal = await db.withdrawal.findUnique({
	where: {
	  id: params.withdrawalId,
	},
	include: {
	  WithdrawalItem: {
		include: {
		  Item: true,
		},
	  },
	},
  });

  let items;

  if (department === "Procurement" || department === "Inventory") {
	items = await db.items.findMany({
	  orderBy: {
		name: "asc",
	  },
	});
  } else {
	items = await db.items.findMany({
	  where: {
		isSmallItem: true,
	  },
	  orderBy: {
		name: "asc",
	  },
	});
  }

  return (
	<div>
	  <WithdrawalRequestForm initialData={withdrawal} items={items} department={department as string} />
	</div>
  );
};

export default Page;
