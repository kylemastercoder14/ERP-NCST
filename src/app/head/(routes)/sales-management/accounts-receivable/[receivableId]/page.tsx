import React from "react";
import db from "@/lib/db";
import AccountReceivableForm from "@/components/forms/account-receivable-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    receivableId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const params = await props.params;
  const payable = await db.transaction.findUnique({
    where: {
      id: params.receivableId,
    },
  });

  const clients = await db.client.findMany({
    where: {
      branchId: user?.Employee?.branchId,
    },
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
