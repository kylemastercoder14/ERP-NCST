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
import { Check, Edit, MoreHorizontal, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { approveLeave, deleteLeave } from "@/actions";
import { Modal } from "@/components/ui/modal";
import RejectLeaveForm from "@/components/forms/reject-leave-form";

interface CellActionProps {
  id: string;
  status: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, status }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [approveModal, setApproveModal] = React.useState(false);
  const [rejectModal, setRejectModal] = React.useState(false);

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

  const onApprove = async () => {
    try {
      const res = await approveLeave(id);
      if (res.success) {
        toast.success(res.success);
        setApproveModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 1200)
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
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <AlertModal
        onConfirm={onApprove}
        isOpen={approveModal}
        description="Do you want to approve this leave?"
        onClose={() => setApproveModal(false)}
        loading={loading}
      />
      <Modal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        title="Reject Leave"
        description="Do you want to reject this leave?"
      >
        <RejectLeaveForm leaveId={id} onClose={() => setRejectModal(false)} />
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
          {(status === "Pending" || status === "Rejected") && (
            <DropdownMenuItem onClick={() => setApproveModal(true)}>
              <Check className="w-4 h-4 mr-2" />
              Approve Leave
            </DropdownMenuItem>
          )}
          {status === "Pending" && (
            <DropdownMenuItem onClick={() => setRejectModal(true)}>
              <X className="w-4 h-4 mr-2" />
              Reject Leave
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/reporting-manager/leave-management/${id}`)}
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
