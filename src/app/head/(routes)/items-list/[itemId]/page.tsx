import React from "react";
import db from "@/lib/db";
import ItemForm from "@/components/forms/item-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    itemId: string;
  }>;
}) => {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const item = await db.items.findUnique({
    where: {
      id: params.itemId,
    },
  });

  const suppliers = await db.supplier.findMany({
    where: {
      branchId: user?.Employee.branchId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <ItemForm initialData={item} suppliers={suppliers} />
    </div>
  );
};

export default Page;
