"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type SupplierColumn = {
  id: string;
  name: string;
  email: string;
  logo: string;
  address: string;
  contactNo: string;
  itemsCount: number;
  createdAt: string;
};

export const columns: ColumnDef<SupplierColumn>[] = [
  {
    accessorKey: "supplier",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Supplier
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.logo} />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm">{row.original.name}</span>
            <span className="text-muted-foreground text-[12px]">
              Email Address: {row.original.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Contact Information
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.contactNo}</span>
          <span className="text-muted-foreground text-[12px]">
            Address: {row.original.address}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <CellAction id={row.original.id} />
    ),
  },
];
