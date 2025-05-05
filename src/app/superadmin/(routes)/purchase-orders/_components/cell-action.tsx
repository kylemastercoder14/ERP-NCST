/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Boxes,
  CheckCircleIcon,
  Clock,
  FolderOpen,
  MoreHorizontal,
  Printer,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { changePurchaseRequestStatusSupplier, deleteLeave } from "@/actions";
import { Modal } from "@/components/ui/modal";
import PurchaseRequestDetails from "./purchase-request-details";

interface CellActionProps {
  id: string;
  financeStatus: string;
  departmentSession: string;
  supplierStatus: string;
  inventoryStatus: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  financeStatus,
  departmentSession,
  supplierStatus,
  inventoryStatus
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [preparingModalOpen, setPreparingModalOpen] = React.useState(false);
  const [inTransitModalOpen, setInTransitModalOpen] = React.useState(false);
  const [deliveredModalOpen, setDeliveredModalOpen] = React.useState(false);
  const [receivedModalOpen, setReceivedModalOpen] = React.useState(false);
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

  const onReceived = async () => {
    try {
      await changePurchaseRequestStatusSupplier(id, "Received");
      toast.success("Successfully changed to Received.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setReceivedModalOpen(false);
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
      <AlertModal
        onConfirm={onReceived}
        title="You are about to change the receive this order."
        description="Please make sure to review the details before proceeding. This action cannot be undone."
        isOpen={receivedModalOpen}
        onClose={() => setReceivedModalOpen(false)}
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

          {supplierStatus === "Delivered" &&
            departmentSession !== "Supplier" && (
              <DropdownMenuItem onClick={() => setReceivedModalOpen(true)}>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Receive Order
              </DropdownMenuItem>
            )}

          {supplierStatus === "Received" && (
            <DropdownMenuItem onClick={() => router.push(`/print-invoice/${id}`)}>
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
