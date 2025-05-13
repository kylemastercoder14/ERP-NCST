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
import { Edit, FileText, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import { Column } from "./column";
import { deleteTicket, updateTicketStatus } from "@/actions";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { ViewDetails } from "./view-details";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { TicketStatus } from "@prisma/client";

interface CellActionProps {
  data: Column;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [viewModal, setViewModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      status: data.ticketStatus,
    },
  });

  const currentStatus = watch("status");

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

  const onStatusUpdate = async () => {
    try {
      setLoading(true);
      const res = await updateTicketStatus(data.id, currentStatus);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
        setUpdateModal(false);
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
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
      />
      <Modal
        className="max-w-2xl"
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        title={`Ticket Details`}
        description="View the details of this ticket"
      >
        <ViewDetails data={data} onClose={() => setViewModal(false)} />
      </Modal>
      <Modal
        className="max-w-2xl"
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        title={`Update Ticket Status`}
        description="Update the status of this ticket"
      >
        <form onSubmit={handleSubmit(onStatusUpdate)}>
          <div className="flex flex-col gap-4">
            <Label>Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(value) =>
                setValue("status", value as TicketStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TicketStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
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
          <DropdownMenuItem onClick={() => setUpdateModal(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Update Status
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
