"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type ApplicantColumn = {
  id: string;
  licenseNo: string;
  name: string;
  phoneNumber: string;
  address: string;
  trainingStatus: string;
  gender: string;
  civilStatus: string;
  positionDesired: string;
  departmentSession: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<ApplicantColumn>[] = [
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
          <span className="text-sm">{row.original.phoneNumber}</span>
          <span className="text-muted-foreground text-[12px]">
            {row.original.address}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "applicationDate",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Application Date
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="bg-green-600/20 border border-green-600 text-green-800 w-12 rounded-md px-2 flex items-center justify-center text-[11px] py-0.5">
            Active
          </div>
          <span className="text-muted-foreground mt-1 text-[12px]">
            {row.original.createdAt}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Gender
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "civilStatus",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Civil Status
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
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
          Position Desired
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Last Status Update
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <CellAction
        id={row.original.id}
        name={row.original.name}
        trainingStatus={row.original.trainingStatus}
        departmentSession={row.original.departmentSession}
      />
    ),
  },
];
