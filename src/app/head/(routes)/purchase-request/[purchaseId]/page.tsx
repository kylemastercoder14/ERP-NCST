import React from "react";
import db from "@/lib/db";
import PurchaseRequestForm from "@/components/forms/purchase-request-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    purchaseId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const department = user?.Employee?.Department.name;
  const params = await props.params;
  const purchaseRequest = await db.purchaseRequest.findUnique({
    where: {
      id: params.purchaseId,
    },
    include: {
      PurchaseRequestItem: {
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
      <PurchaseRequestForm initialData={purchaseRequest} items={items} department={department as string} />
    </div>
  );
};

export default Page;
