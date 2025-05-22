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
import { Edit, MoreHorizontal, Trash, User } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { deleteApplicant, isThereAccount } from "@/actions";
import { Modal } from "@/components/ui/modal";
import CreateAccountForm from "@/components/forms/create-account-form";

interface CellActionProps {
  id: string;
  name: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id, name }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [hasAccount, setHasAccount] = React.useState(false);
  const [accountModal, setAccountModal] = React.useState(false);

  React.useEffect(() => {
    const checkAccount = async () => {
      const res = await isThereAccount(id);
      setHasAccount(!!res?.isThereAccount);
    };
    checkAccount();
  }, [id]);

  const onDelete = async () => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await deleteApplicant(id);
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
        isOpen={accountModal}
        onClose={() => setAccountModal(false)}
        title={`Create Account for ${name}`}
        description="Do you want to create an account for this employee?"
      >
        <CreateAccountForm
          employeeId={id}
          onClose={() => setAccountModal(false)}
        />
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
            disabled={hasAccount}
            onClick={() => setAccountModal(true)}
          >
            <User className="w-4 h-4 mr-2" />
            Create Account
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/superadmin/${params.branchId}/employee-management/${id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
