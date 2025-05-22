import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { SupplierColumn } from "./_components/column";
import { format } from "date-fns";
import SupplierClient from "./_components/client";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.supplier.findMany({
    where: {
      branchId: params.branchId,
    },
    orderBy: {
      createdAt: "desc",
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
          <Link
            href={`/superadmin/${params.branchId}/supplier-management/create`}
          >
            + Add Supplier
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <SupplierClient data={formattedData} />
    </div>
  );
};

export default Page;
