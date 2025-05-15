"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

interface CellActionProps {
  assessmentId: string;
}

export const CellAction: React.FC<CellActionProps> = ({ assessmentId }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="no-print" asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/superadmin/${params.branchId}/employee-evaluation/${assessmentId}`)
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            View Assessment
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
