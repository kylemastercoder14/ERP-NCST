"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type PurchaseRequestColumn = {
  id: string;
  itemName: string;
  purchaseCode: string;
  name: string;
  licenseNo: string;
  quantity: number;
  totalAmount: string;
  department: string;
  financeStatus: string;
  departmentSession: string;
  isEdited: boolean;
  remarks: string;
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.itemName} {row.original.isEdited && <Badge variant="secondary">Edited</Badge>}</span>
        </div>
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
                  : row.original.financeStatus === "Returned"
                    ? "bg-blue-600/20 border-blue-600 text-blue-800"
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
    accessorKey: "remarks",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Remarks
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.original.remarks}>{row.original.remarks}</span>
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
      />
    ),
  },
];
