import React from "react";
import db from "@/lib/db";
import ItemForm from "@/components/forms/item-form";

const Page = async (props: {
  params: Promise<{
    itemId: string;
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const item = await db.items.findUnique({
    where: {
      id: params.itemId,
    },
  });

  const suppliers = await db.supplier.findMany({
    where: {
      branchId: params.branchId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <ItemForm initialData={item} suppliers={suppliers} session="superadmin" />
    </div>
  );
};

export default Page;
