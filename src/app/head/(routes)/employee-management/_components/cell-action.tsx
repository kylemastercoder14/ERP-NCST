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
import { Edit, MoreHorizontal, Send, Trash, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import {
  assignToClient,
  deleteApplicant,
  getAllClients,
  isThereAccount,
} from "@/actions";
import { Modal } from "@/components/ui/modal";
import CreateAccountForm from "@/components/forms/create-account-form";
import { Client } from "@prisma/client";
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
  clientId: string;
  position: string;
  branchId: string;
  email: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  name,
  clientId,
  position,
  branchId,
  email,
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [hasAccount, setHasAccount] = React.useState(false);
  const [accountModal, setAccountModal] = React.useState(false);
  const [clientModal, setClientModal] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [client, setClient] = React.useState("");

  React.useEffect(() => {
    const checkAccount = async () => {
      const res = await isThereAccount(id);
      setHasAccount(!!res?.isThereAccount);
    };
    checkAccount();
  }, [id]);

  React.useEffect(() => {
    const fetchClients = async () => {
      const res = await getAllClients(branchId);
      if (res.success) {
        setClients(res.data ?? []);
      }
    };
    fetchClients();
  }, [branchId]);

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

  const onFinal = async () => {
    setLoading(true);
    try {
      await assignToClient(id, client, email);
      toast.success("Successfully assigned to client.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setClientModal(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={clientModal}
        onClose={() => setClientModal(false)}
        title={`Assign ${name} to Client`}
        description="Do you want to assign this employee to a client?"
      >
        <form onSubmit={onFinal} className="space-y-4">
          <div className="space-y-1">
            <Label>Client</Label>
            <Select defaultValue={client} onValueChange={setClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">Save Changes</Button>
        </form>
      </Modal>
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
          {clientId === "" && position === "Regular Employee" && (
            <DropdownMenuItem onClick={() => setClientModal(true)}>
              <Send className="w-4 h-4 mr-2" />
              Assign to Client
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/head/employee-management/${id}`)}
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
