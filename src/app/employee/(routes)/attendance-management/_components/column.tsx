"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

export type AttendanceColumn = {
  id: string;
  date: string;
  timeIn: string;
  timeOut: string;
  attendanceStatus: string;
  createdAt: string;
};

export const columns: ColumnDef<AttendanceColumn>[] = [
  {
    accessorKey: "date",
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
    accessorKey: "timeIn",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Clock In
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "timeOut",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Clock Out
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "attendanceStatus",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Status
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div
            className={`w-20 rounded-md px-2 flex items-center justify-center text-[11px] py-0.5 border
      ${
        row.original.attendanceStatus === "Present"
          ? "bg-green-600/20 border-green-600 text-green-800"
          : row.original.attendanceStatus === "Absent"
            ? "bg-red-600/20 border-red-600 text-red-800"
            : "bg-yellow-600/20 border-yellow-600 text-yellow-800"
      }
    `}
          >
            {row.original.attendanceStatus}
          </div>
        </div>
      );
    },
  },
];
