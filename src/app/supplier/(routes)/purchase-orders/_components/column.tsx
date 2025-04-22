"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type PurchaseRequestColumn = {
  id: string;
  itemName: string;
  purchaseCode: string;
  name: string;
  licenseNo: string;
  quantity: number;
  totalAmount: string;
  department: string;
  supplierStatus: string;
  financeStatus: string;
  departmentSession: string;
  createdAt: string;
};

export const columns: ColumnDef<PurchaseRequestColumn>[] = [
  {
    accessorKey: "purchaseCode",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Purchase #
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Requested By
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
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Total Amount
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
    accessorKey: "supplierStatus",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Supplier Status
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      const status = row.original.supplierStatus;

      const statusStyles: { [key: string]: string } = {
        Delivered: "bg-green-600/20 border-green-600 text-green-800",
        Rejected: "bg-red-600/20 border-red-600 text-red-800",
        Pending: "bg-yellow-400/20 border-yellow-400 text-yellow-700",
        Preparing: "bg-blue-400/20 border-blue-400 text-blue-700",
        "In transit": "bg-purple-400/20 border-purple-400 text-purple-700",
        // fallback default style if status is unrecognized
        default: "bg-gray-300/20 border-gray-300 text-gray-600",
      };

      const style = statusStyles[status] || statusStyles.default;

      return (
        <div>
          <div
            className={`w-16 rounded-md px-2 flex items-center justify-center text-[11px] py-0.5 border ${style}`}
          >
            {status}
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
    cell: ({ row }) => (
      <CellAction
        id={row.original.id}
        financeStatus={row.original.financeStatus}
        departmentSession={row.original.departmentSession}
        supplierStatus={row.original.supplierStatus}
      />
    ),
  },
];
