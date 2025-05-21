import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { LedgerColumn } from "./_components/column";
import { format } from "date-fns";
import LedgerClient from "./_components/client";
import ExportToExcel from "./_components/export-to-excel";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.transaction.findMany({
    where: {
      branchId: params.branchId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Supplier: true,
      Client: true,
    },
  });

  let runningBalance = 0;

  const formattedData: LedgerColumn[] =
    data.map((request) => {
      const debit = request.type === "DEBIT" ? request.amount : 0;
      const credit = request.type === "CREDIT" ? request.amount : 0;

      runningBalance += debit - credit;
      return {
        id: request.id,
        account: request.Client?.name || request.Supplier?.name || "N/A",
        debit:
          request.type === "DEBIT"
            ? `₱${request.amount.toLocaleString()}`
            : "0",
        credit:
          request.type === "CREDIT"
            ? `₱${request.amount.toLocaleString()}`
            : "0",
        balance: `₱${runningBalance.toLocaleString()}`,
        status: request.status,
        accountType: request.accountType,
        subAccountType: request.subAccountType,
        journalEntry: request.journalEntryId || "",
        transactionDate: format(new Date(request.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Financial Ledger"
          description="View and manage all financial transactions recorded for clients and suppliers."
        />
        <div className="flex items-center gap-2">
          <ExportToExcel data={formattedData} />
          <Button size="sm">
            <Link href={`/head/sales-management/create`}>
              + Record new transaction
            </Link>
          </Button>
        </div>
      </div>
      <Separator className="my-5" />
      <LedgerClient data={formattedData} />
    </div>
  );
};

export default Page;
