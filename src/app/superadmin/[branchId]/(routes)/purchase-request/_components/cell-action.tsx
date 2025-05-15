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
import { Edit, FolderOpen, MoreHorizontal, Printer, Trash } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { deleteLeave } from "@/actions";
import { Modal } from "@/components/ui/modal";
import PurchaseRequestDetails from "./purchase-request-details";

interface CellActionProps {
  id: string;
  financeStatus: string;
  departmentSession: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  financeStatus,
  departmentSession,
}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await deleteLeave(id);
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
      <AlertModal
        onConfirm={onDelete}
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <Modal
        isOpen={modalOpen}
        className="max-w-4xl"
        onClose={() => setModalOpen(false)}
        title="You are about to change the status of this purchase request."
        description="Please make sure to review the details before proceeding. This action cannot be undone."
      >
        <PurchaseRequestDetails departmentSession={departmentSession} id={id} />
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

          {financeStatus === "Approved" ? (
            <DropdownMenuItem onClick={() => router.push(`/print-order-form/${id}`)}>
              <Printer className="w-4 h-4 mr-2" />
              Print Order Form
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setModalOpen(true)}>
              <FolderOpen className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => router.push(`/superadmin/${params.branchId}/purchase-request/${id}`)}
            disabled={departmentSession === "Finance"}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
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
