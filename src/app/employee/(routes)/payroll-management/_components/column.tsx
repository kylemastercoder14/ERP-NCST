"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, Share } from "lucide-react";
import { CellAction } from "./cell-action";
import Link from "next/link";

export type PayrollColumn = {
  id: string;
  fileName: string;
  amount: string;
  deductions: string;
  payrollDate: string;
  createdAt: string;
};

export const columns: ColumnDef<PayrollColumn>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Payslip
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      const attachmentUrl = row.original.fileName;
      const fileName = attachmentUrl ? attachmentUrl.split("/").pop() : null;
      return (
        <Link
          href={attachmentUrl}
          className="flex items-center hover:underline text-orange-600 gap-2"
        >
          {fileName}
          <Share className="h-4 w-4 text-orange-600" />
        </Link>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Amount
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.amount}</span>
          <span className="text-muted-foreground text-[12px]">
            Payroll Date: {row.original.payrollDate}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "deductions",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Total Deductions
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "payrollDate",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Payroll Date
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
];
