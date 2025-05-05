"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type PayslipGenerationColumn = {
  id: string;
  name: string;
  licenseNo: string;
  type: string;
  position: string;
  department: string;
  payrollDate: string;
  createdAt: string;
};

export const columns: ColumnDef<PayslipGenerationColumn>[] = [
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
    accessorKey: "positionDesired",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Position
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.position}</span>
          <span className="text-muted-foreground text-[12px]">
            Department: {row.original.department}
          </span>
        </div>
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
