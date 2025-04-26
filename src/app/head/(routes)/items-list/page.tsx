import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ItemColumn } from "./_components/column";
import { format } from "date-fns";
import ItemClient from "./_components/client";

const Page = async () => {
  const data = await db.items.findMany({
	orderBy: {
	  createdAt: "desc",
	},
	include: {
		Supplier: true
	}
  });

  const formattedData: ItemColumn[] =
	data.map((item) => {
	  return {
		id: item.id,
		name: item.name,
		description: item.description || "No description provided",
		unitPrice: `₱${item.unitPrice.toFixed(2)}`,
		supplier: item.Supplier.name,
		createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
	  };
	}) || [];

  return (
	<div>
	  <div className="flex items-center justify-between">
		<Heading
		  title="Items List"
		  description="Manage all the items here."
		/>
		<Button size="sm">
		  <Link href={`/head/items-list/create`}>+ Add new item</Link>
		</Button>
	  </div>
	  <Separator className="my-5" />
	  <ItemClient data={formattedData} />
	</div>
  );
};

export default Page;
