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
import { FileText, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import AlertModal from "@/components/ui/alert-modal";
import { Column } from "./column";
import { deleteTicket } from "@/actions";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { ViewDetails } from './view-details';

interface CellActionProps {
  data: Column;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [viewModal, setViewModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  const onDelete = async () => {
    setDeleteModal(false);
    try {
      const res = await deleteTicket(data.id);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    }
  };
  return (
    <>
      <AlertModal
        onConfirm={onDelete}
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
      />
      <Modal
      className='max-w-2xl'
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        title={`Ticket Details`}
        description="View the details of this ticket"
      >
        <ViewDetails data={data} onClose={() => setViewModal(false)} />
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger className="no-print" asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setViewModal(true)}>
            <FileText className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteModal(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
