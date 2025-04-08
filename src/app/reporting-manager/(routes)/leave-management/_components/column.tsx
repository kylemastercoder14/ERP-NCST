"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, Share } from "lucide-react";
import { CellAction } from "./cell-action";
import Link from "next/link";

export type LeaveManagementColumn = {
  id: string;
  name: string;
  licenseNo: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  approvedBy: string;
  reason: string;
  attachment: string;
  createdAt: string;
};

export const columns: ColumnDef<LeaveManagementColumn>[] = [
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
    accessorKey: "leaveType",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Leave Type
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Leave Date
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
        row.original.status === "Approved"
          ? "bg-green-600/20 border-green-600 text-green-800"
          : row.original.status === "Rejected"
            ? "bg-red-600/20 border-red-600 text-red-800"
            : "bg-yellow-600/20 border-yellow-600 text-yellow-800"
      }
    `}
          >
            {row.original.status}
          </div>
          <span className="text-muted-foreground mt-1 text-[12px]">
            {row.original.startDate} - {row.original.endDate}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Reason
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <span className="text-muted-foreground w-40 truncate">{row.original.reason}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "attachment",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Attachment
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      const attachmentUrl = row.original.attachment;

      // Extract the file name from the URL
      const fileName = attachmentUrl ? attachmentUrl.split("/").pop() : null;
      return (
        <div>
          {attachmentUrl ? (
            <Link
              href={attachmentUrl}
              className="flex items-center hover:underline text-orange-600 gap-2"
            >
              {fileName}
              <Share className="h-4 text-orange-600 w-4" />
            </Link>
          ) : (
            <span className="text-muted-foreground">No attachment</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "approvedBy",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Approved/Rejected By
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <CellAction id={row.original.id} status={row.original.status} />
    ),
  },
];
