import React from "react";
import db from "@/lib/db";
import AccountPayableForm from "@/components/forms/account-payable-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    payableId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const params = await props.params;
  const payable = await db.transaction.findUnique({
    where: {
      id: params.payableId,
    },
  });

  const suppliers = await db.supplier.findMany({
    where: {
      branchId: user?.Employee?.branchId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <AccountPayableForm initialData={payable} suppliers={suppliers} session="head" />
    </div>
  );
};

export default Page;
