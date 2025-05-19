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
import { FileText, MoreHorizontal, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Modal } from "@/components/ui/modal";
import FileInput from "@/components/ui/file-input";
import { toast } from 'sonner';
import { sendContractToEmployee } from '@/actions';

interface CellActionProps {
  id: string;
  name: string;
  email: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, name, email }) => {
  const router = useRouter();
  const [sendModalOpen, setsendModalOpen] = React.useState(false);
  const [file, setFile] = React.useState<string | null>(null);
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
      if(response.success) {
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
  }
  return (
    <>
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
          <Button onClick={handleSubmit} type="submit" disabled={isSubmitting} className="w-full">
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
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
