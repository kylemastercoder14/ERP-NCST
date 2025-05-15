"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

export type Column = {
  id: string;
  action: string;
  department: string;
  user: string;
  createdAt: string;
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Date
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "user",
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
  },
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Action
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
];
