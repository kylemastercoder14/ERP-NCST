"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Undo2Icon } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { addTreshold } from "@/actions";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

interface CellActionProps {
  id: string;
  treshold: number;
  stock: number;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  treshold,
  stock,
}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [threshold, setThreshold] = React.useState<number | null>(null);

  const onTreshold = async () => {
    setLoading(true);
    setOpen(false);
    try {
      if (threshold === null) {
        toast.error("Threshold value is required.");
        setLoading(false);
        return;
      }
      const res = await addTreshold(id, threshold);
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
        title="Set Reorder Threshold"
        description="Specify the minimum quantity before an item is considered low in stock. A 'Reorder' button will appear when inventory falls below this threshold."
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter threshold quantity"
            type="number"
            required
            value={threshold ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setThreshold(value ? parseInt(value) : null);
            }}
            disabled={loading}
          />
          <Button onClick={onTreshold} disabled={loading}>
            Save Changes
          </Button>
        </div>
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
          {treshold === 0 && (
            <DropdownMenuItem
              onClick={() => {
                setOpen(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Set Threshold
            </DropdownMenuItem>
          )}

          {treshold > stock && (
            <DropdownMenuItem
            onClick={() => router.push(`/superadmin/${params.branchId}/purchase-request/${id}`)}
            >
              <Undo2Icon className="w-4 h-4 mr-2" />
              Re-order Item
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
