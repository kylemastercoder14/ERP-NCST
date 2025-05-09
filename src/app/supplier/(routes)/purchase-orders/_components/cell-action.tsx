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
import {
  Boxes,
  Clock,
  Edit,
  FolderOpen,
  MoreHorizontal,
  Printer,
  Trash,
  Truck,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { changePurchaseRequestStatusSupplier, deleteLeave } from "@/actions";
import { Modal } from "@/components/ui/modal";
import PurchaseRequestDetails from "./purchase-request-details";
import { Textarea } from "@/components/ui/textarea";

interface CellActionProps {
  id: string;
  financeStatus: string;
  departmentSession: string;
  supplierStatus: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  financeStatus,
  departmentSession,
  supplierStatus,
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [preparingModalOpen, setPreparingModalOpen] = React.useState(false);
  const [inTransitModalOpen, setInTransitModalOpen] = React.useState(false);
  const [deliveredModalOpen, setDeliveredModalOpen] = React.useState(false);
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

  const onPreparing = async () => {
    try {
      await changePurchaseRequestStatusSupplier(id, "Preparing");
      toast.success("Successfully changed to Preparing.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setPreparingModalOpen(false);
    }
  };

  const onIntransit = async () => {
    try {
      await changePurchaseRequestStatusSupplier(id, "In transit");
      toast.success("Successfully changed to In transit.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setInTransitModalOpen(false);
    }
  };

  const onDelivered = async () => {
    try {
      await changePurchaseRequestStatusSupplier(id, "Delivered");
      toast.success("Successfully changed to Delivered.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setDeliveredModalOpen(false);
    }
  };

  const onReject = async () => {
    try {
      await changePurchaseRequestStatusSupplier(id, "Rejected", reason);
      toast.success("Successfully rejected.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setPreparingModalOpen(false);
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
        isOpen={rejectModalOpen}
        className="max-w-4xl"
        onClose={() => setRejectModalOpen(false)}
        title="You are about to reject this purchase request."
        description="Please make sure to review the details before proceeding. This action cannot be undone."
      >
        <form>
          <div className="flex flex-col gap-3">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for rejection <span className="text-red-600">*</span>
            </label>
            <Textarea
              id="reason"
              required
              placeholder="Please provide a reason for rejection."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="destructive" onClick={onReject} disabled={loading}>
              Reject
            </Button>
          </div>
        </form>
      </Modal>
      <AlertModal
        onConfirm={onPreparing}
        title="You are about to change the status of this purchase request to Preparing."
        description="Please make sure to review the details before proceeding. This action cannot be undone."
        isOpen={preparingModalOpen}
        onClose={() => setPreparingModalOpen(false)}
        loading={loading}
      />
      <AlertModal
        onConfirm={onIntransit}
        title="You are about to change the status of this purchase request to In transit."
        description="Please make sure to review the details before proceeding. This action cannot be undone."
        isOpen={inTransitModalOpen}
        onClose={() => setInTransitModalOpen(false)}
        loading={loading}
      />
      <AlertModal
        onConfirm={onDelivered}
        title="You are about to change the status of this purchase request to Delivered."
        description="Please make sure to review the details before proceeding. This action cannot be undone."
        isOpen={deliveredModalOpen}
        onClose={() => setDeliveredModalOpen(false)}
        loading={loading}
      />
      <Modal
        isOpen={modalOpen}
        className="max-w-4xl"
        onClose={() => setModalOpen(false)}
        title="You are about to change the status of this purchase request."
        description="Please make sure to review the details before proceeding. This action cannot be undone."
      >
        <PurchaseRequestDetails id={id} />
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
          {departmentSession === "Finance" && financeStatus === "Pending" && (
            <DropdownMenuItem onClick={() => setModalOpen(true)}>
              <FolderOpen className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
          )}

          {supplierStatus === "Pending" && departmentSession === "Supplier" && (
            <DropdownMenuItem onClick={() => setRejectModalOpen(true)}>
              <XIcon className="w-4 h-4 mr-2" />
              Reject Order
            </DropdownMenuItem>
          )}

          {supplierStatus === "Pending" && departmentSession === "Supplier" && (
            <DropdownMenuItem onClick={() => setPreparingModalOpen(true)}>
              <Clock className="w-4 h-4 mr-2" />
              Change to Preparing
            </DropdownMenuItem>
          )}

          {supplierStatus === "Preparing" &&
            departmentSession === "Supplier" && (
              <DropdownMenuItem onClick={() => setInTransitModalOpen(true)}>
                <Truck className="w-4 h-4 mr-2" />
                Change to In transit
              </DropdownMenuItem>
            )}

          {supplierStatus === "In transit" &&
            departmentSession === "Supplier" && (
              <DropdownMenuItem onClick={() => setDeliveredModalOpen(true)}>
                <Boxes className="w-4 h-4 mr-2" />
                Change to Delivered
              </DropdownMenuItem>
            )}

          {financeStatus === "Approved" && departmentSession !== "Supplier" && (
            <DropdownMenuItem>
              <Printer className="w-4 h-4 mr-2" />
              Print Order Form
            </DropdownMenuItem>
          )}

          {departmentSession !== "Supplier" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/head/purchase-request/${id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled onClick={() => setOpen(true)}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
