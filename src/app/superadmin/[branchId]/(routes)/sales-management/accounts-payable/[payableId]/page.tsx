import React from "react";
import db from "@/lib/db";
import AccountPayableForm from "@/components/forms/account-payable-form";

const Page = async (props: {
  params: Promise<{
    payableId: string;
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const payable = await db.transaction.findUnique({
    where: {
      id: params.payableId,
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

  return (
    <div>
      <AccountPayableForm initialData={payable} suppliers={suppliers} session="superadmin" />
    </div>
  );
};

export default Page;
