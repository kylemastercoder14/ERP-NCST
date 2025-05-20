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
import { Clock, FileText, MoreHorizontal, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Modal } from "@/components/ui/modal";
import FileInput from "@/components/ui/file-input";
import { toast } from "sonner";
import { assignShiftEmployee, sendContractToEmployee } from "@/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CellActionProps {
  id: string;
  name: string;
  email: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, name, email }) => {
  const router = useRouter();
  const [sendModalOpen, setsendModalOpen] = React.useState(false);
  const [shiftModalOpen, setshiftModalOpen] = React.useState(false);
  const [file, setFile] = React.useState<string | null>(null);
  const [shift, setShift] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!file) {
        toast.warning("Please upload a file.");
        return;
      }
      const response = await sendContractToEmployee(file, id, email, name);
      if (response.success) {
        toast.success("Contract sent successfully!");
      } else {
        toast.error("Failed to send contract.");
      }
    } catch (error) {
      console.error("Error sending contract:", error);
    } finally {
      setIsSubmitting(false);
      setsendModalOpen(false);
    }
  };

  const handleShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!shift) {
        toast.warning("Please select a shift.");
        return;
      }
      const res = await assignShiftEmployee(id, shift);
      if (res.success) {
        toast.success("Shift assigned successfully!");
      } else {
        toast.error("Failed to assign shift.");
      }
    } catch (error) {
      console.error("Error assigning shift:", error);
    } finally {
      setIsSubmitting(false);
      setshiftModalOpen(false);
    }
  };
  return (
    <>
      <Modal
        title="Assign Shift"
        description={`Assign shift to ${name}`}
        isOpen={shiftModalOpen}
        onClose={() => setshiftModalOpen(false)}
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <Label>Shift</Label>
            <Select defaultValue={shift} onValueChange={setShift}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Day Shift">Day Shift</SelectItem>
                <SelectItem value="Night Shift">Night Shift</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              Day shift is from 6:00 AM to 6:00 PM and Night shift is from
              6:00 PM to 6:00 AM.
            </span>
          </div>
          <Button
            onClick={handleShiftSubmit}
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            Submit
          </Button>
        </form>
      </Modal>
      <Modal
        title="Send Contract"
        description={`Send contract to ${name}`}
        isOpen={sendModalOpen}
        onClose={() => setsendModalOpen(false)}
      >
        <form className="space-y-4">
          <FileInput
            fileType="contract"
            label="Drop your signed contract here"
            maxSizeMB={5}
            defaultValue={file || ""}
            onFileUpload={(url) => setFile(url)}
          />
          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            Submit
          </Button>
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
          <DropdownMenuItem
            onClick={() => router.push(`/client/employee-management/${id}`)}
          >
            <User className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/client/employee-management/${id}/assessment`)
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Assessment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setsendModalOpen(true)}>
            <Send className="w-4 h-4 mr-2" />
            Send Contract
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setshiftModalOpen(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Shift
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
