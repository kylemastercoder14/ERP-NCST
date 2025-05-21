import React from "react";
import db from "@/lib/db";
import AccountTransactionForm from "@/components/forms/account-transaction-form";

const Page = async (props: {
  params: Promise<{
    transactionId: string;
    branchId: string;
  }>;
}) => {
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
      branchId: params.branchId,
    },
  });

  const clients = await db.client.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      branchId: params.branchId,
    },
  });

  return (
    <div>
      <AccountTransactionForm
        initialData={transaction}
        suppliers={suppliers}
        clients={clients}
      />
    </div>
  );
};

export default Page;
