"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import { priorityMap, statusMap, ticketTypeMap } from "@/lib/ticket-utils";
import { TicketBadge } from "@/components/global/ticket-badge";

export type Column = {
  id: string;
  title: string;
  type: keyof typeof ticketTypeMap;
  priority: keyof typeof priorityMap;
  ticketStatus: keyof typeof statusMap;
  attachments: string[];
  description: string;
  employee?: {
    name: string;
    position?: string;
    email?: string;
  };
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
          Date Submitted
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Title
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Type
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      const type = row.original.type;
      const { label, icon, variant } = ticketTypeMap[type];

      return (
        <TicketBadge variant={variant} icon={icon}>
          {label}
        </TicketBadge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer flex items-center"
        >
          Priority
          <ChevronsUpDown className="ml-2 h-4 w-4 no-print" />
        </span>
      );
    },
    cell: ({ row }) => {
      const priority = row.original.priority;
      const { label, icon, variant } = priorityMap[priority];

      return (
        <TicketBadge variant={variant} icon={icon}>
          {label}
        </TicketBadge>
      );
    },
  },
  {
    accessorKey: "ticketStatus",
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
      const status = row.original.ticketStatus;
      const { label, icon, variant } = statusMap[status];

      return (
        <TicketBadge variant={variant} icon={icon}>
          {label}
        </TicketBadge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
