import React from "react";
import db from "@/lib/db";
import AccountTransactionForm from "@/components/forms/account-transaction-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    transactionId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const params = await props.params;
  const transaction = await db.transaction.findUnique({
    where: {
      id: params.transactionId,
    },
  });

  const suppliers = await db.supplier.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      branchId: user?.Employee?.branchId,
    },
  });

  const clients = await db.client.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      branchId: user?.Employee?.branchId,
    },
  });

  return (
    <div>
      <AccountTransactionForm
      session='head'
        initialData={transaction}
        suppliers={suppliers}
        clients={clients}
      />
    </div>
  );
};

export default Page;
