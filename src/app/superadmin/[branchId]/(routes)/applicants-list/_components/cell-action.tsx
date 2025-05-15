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
import { MoreHorizontal, SendIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { deleteItem } from "@/actions";
import { Modal } from "@/components/ui/modal";
import ViewItemDetails from "./view-details";
import SendEmailForm from "@/components/forms/send-email-form";

interface CellActionProps {
  id: string;
  email: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, email }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [emailModalOpen, setEmailModalOpen] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await deleteItem(id);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Send Email"
        description="Send additional information to the employee."
      >
        <SendEmailForm email={email} onClose={() => setEmailModalOpen(false)} />
      </Modal>
      <AlertModal
        onConfirm={onDelete}
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <Modal
        className="max-w-4xl h-[70vh] overflow-y-auto"
        title="View Item Details"
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
      >
        <ViewItemDetails id={id} />
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
          <DropdownMenuItem onClick={() => setEmailModalOpen(true)}>
            <SendIcon className="w-4 h-4 mr-2" />
            Send Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
