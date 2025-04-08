"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type PurchaseRequestColumn = {
  id: string;
  itemName: string;
  name: string;
  licenseNo: string;
  quantity: number;
  unitPrice: string;
  department: string;
  financeStatus: string;
  procurementStatus: string;
  createdAt: string;
};

export const columns: ColumnDef<PurchaseRequestColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Employee
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.name}</span>
          <span className="text-muted-foreground text-[12px]">
            License No.: {row.original.licenseNo}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "itemName",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Item
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.itemName}</span>
          <span className="text-muted-foreground text-[12px]">
            Quantity: {row.original.quantity}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "unitPrice",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Unit Price
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Department
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "procurementStatus",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Procurement Status
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div
            className={`w-14 rounded-md px-2 flex items-center justify-center text-[11px] py-0.5 border
      ${
        row.original.procurementStatus === "Approved"
          ? "bg-green-600/20 border-green-600 text-green-800"
          : row.original.procurementStatus === "Rejected"
            ? "bg-red-600/20 border-red-600 text-red-800"
            : "bg-yellow-600/20 border-yellow-600 text-yellow-800"
      }
    `}
          >
            {row.original.procurementStatus}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "financeStatus",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Finance Status
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div
            className={`w-14 rounded-md px-2 flex items-center justify-center text-[11px] py-0.5 border
      ${
        row.original.financeStatus === "Approved"
          ? "bg-green-600/20 border-green-600 text-green-800"
          : row.original.financeStatus === "Rejected"
            ? "bg-red-600/20 border-red-600 text-red-800"
            : "bg-yellow-600/20 border-yellow-600 text-yellow-800"
      }
    `}
          >
            {row.original.financeStatus}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
];
