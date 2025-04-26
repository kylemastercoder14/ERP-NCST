/* eslint-disable react-hooks/rules-of-hooks */
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import { useSupplier } from "@/hooks/use-supplier";
import SliderInvoices from "./slider-client";

const Page = async (props: {
	params: Promise<{
	  orderId: string;
	}>;
  }) => {
  const { user } = await useUser();
  const { user: supplier } = await useSupplier();
  const params = await props.params;

  const purchaseRequest = await db.purchaseRequest.findUnique({
    where: { id: params.orderId },
    include: {
      receivedEmployee: true,
      requestedBy: true,
      PurchaseRequestItem: {
        include: {
          Item: {
            include: { Supplier: true },
          },
        },
      },
    },
  });

  if (!purchaseRequest) return <div>Not found</div>;

  const grouped = purchaseRequest.PurchaseRequestItem.reduce(
    (acc, item) => {
      const supplierId = item.Item?.supplierId || "unknown";
      if (!acc[supplierId]) acc[supplierId] = [];
      acc[supplierId].push(item);
      return acc;
    },
    {} as Record<string, typeof purchaseRequest.PurchaseRequestItem[0][]>
  );

  const supplierId = supplier?.id;
  const filteredGroups = supplierId
    ? { [supplierId]: grouped[supplierId] }
    : grouped;

  // Fix: Map through entries correctly, taking both key and value
  const data = Object.entries(filteredGroups).map(([supplierId, items]) => ({
    ...purchaseRequest,
    PurchaseRequestItem: items,
  }));

  return <SliderInvoices invoices={data} />;
};

export default Page;
