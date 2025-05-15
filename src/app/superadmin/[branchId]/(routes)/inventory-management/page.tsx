import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ItemColumn } from "./_components/column";
import { format } from "date-fns";
import ItemClient from "./_components/client";

const Page = async () => {
  const data = await db.inventory.findMany({
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
      let status = "In stock"; // default

      if (item.Item.isSmallItem) {
        if (item.quantity === 0) {
          status = "Out of Stock";
        } else if (item.quantity < 10) {
          status = "Running Out";
        }
      }else {
        status = "In stock";
      }

      return {
        id: item.id,
        name: item.Item.name,
        description: item.Item.description || "No description provided",
        unitPrice: `₱${item.Item.unitPrice.toFixed(2)}`,
        supplier: item.Item.Supplier.name,
        quantity: item.quantity,
        status,
        treshold: item.treshold || 0,
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
