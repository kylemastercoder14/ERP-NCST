import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ItemColumn } from "./_components/column";
import { format } from "date-fns";
import ItemClient from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.inventory.findMany({
    where: {
      Supplier: {
        branchId: user?.Employee.branchId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Item: {
        include: {
          Supplier: true,
        },
      },
    },
  });

  const formattedData: ItemColumn[] =
    data.map((item) => {
      console.log(
        `Item: ${item.Item.name}, Quantity: ${item.quantity}, Threshold: ${item.treshold}`
      );
      console.log(
        `Type of quantity: ${typeof item.quantity}, Type of threshold: ${typeof item.treshold}`
      );

      const quantity = Number(item.quantity);
      const threshold = Number(item.treshold);

      let status = "In stock";

      if (quantity === 0) {
        status = "Out of Stock";
      } else if (!isNaN(threshold) && quantity <= threshold) {
        status = "Low Stock";
      }

      console.log(`Calculated Status: ${status}`);

      return {
        id: item.id,
        name: item.Item.name,
        description: item.Item.description || "No description provided",
        unitPrice: `₱${item.Item.unitPrice.toFixed(2)}`,
        supplier: item.Item.Supplier.name,
        quantity: quantity,
        inventoryStatus: status,
        treshold: isNaN(threshold) ? 0 : threshold,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Inventory Management"
          description="Manage all the items here."
        />
      </div>
      <Separator className="my-5" />
      <ItemClient data={formattedData} />
    </div>
  );
};

export default Page;
