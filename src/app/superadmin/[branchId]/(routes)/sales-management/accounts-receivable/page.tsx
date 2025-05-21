import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AccountPayableColumn } from "./_components/column";
import { format } from "date-fns";
import PurchaseRequestClient from "./_components/client";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.transaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      type: "DEBIT",
      branchId: params.branchId,
    },
    include: {
      Client: true,
    },
  });

  const formattedData: AccountPayableColumn[] =
    data.map((request) => {
      return {
        id: request.id,
        name: request.name,
        supplier: request?.Client?.name || "N/A",
        amount: `₱${request.amount.toLocaleString()}`,
        accountType: request.accountType,
        status: request.status,
        createdAt: format(new Date(request.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Account Receivable"
          description="Manage all the account receivable here."
        />
        <Button size="sm">
          <Link href={`/head/sales-management/accounts-receivable/create`}>
            + Add new receivable
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <PurchaseRequestClient data={formattedData} />
    </div>
  );
};

export default Page;
