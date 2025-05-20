import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { SupplierColumn } from "./_components/column";
import { format } from "date-fns";
import SupplierClient from "./_components/client";
import { useUser } from '@/hooks/use-user';

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.supplier.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      branchId: user?.Employee.branchId,
    },
    include: {
      Items: true,
    },
  });

  const formattedData: SupplierColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        logo: item.logo || "",
        email: item.email,
        itemsCount: item.Items.length,
        address: item.address || "No address provided",
        contactNo: item.contactNo || "No contact number provided",
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Supplier Management"
          description="Manage all the suppliers here."
        />
        <Button size="sm">
          <Link href={`/head/supplier-management/create`}>+ Add Supplier</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <SupplierClient data={formattedData} />
    </div>
  );
};

export default Page;
