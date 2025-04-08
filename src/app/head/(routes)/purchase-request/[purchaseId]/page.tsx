import React from "react";
import db from "@/lib/db";
import PurchaseRequestForm from "@/components/forms/purchase-request-form";

const Page = async (props: {
  params: Promise<{
    purchaseId: string;
  }>;
}) => {
  const params = await props.params;
  const purchase = await db.purchaseRequest.findUnique({
    where: {
      id: params.purchaseId,
    },
    include: {
      Employee: true,
      ReceivedBy: true,
    },
  });

  return (
    <div>
      <PurchaseRequestForm
        initialData={purchase}
      />
    </div>
  );
};

export default Page;
