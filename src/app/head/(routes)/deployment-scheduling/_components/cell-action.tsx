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
  BookA,
  BookOpenCheck,
  Megaphone,
  MoreHorizontal,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import { assignToClient, getAllClients } from "@/actions";
import { Modal } from "@/components/ui/modal";
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
  trainingStatus: string;
  email: string;
  branchId: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  trainingStatus,
  email,
  branchId,
}) => {
  const router = useRouter();
  const [finalOpen, setFinalOpen] = React.useState(false);
  const [clientId, setClientId] = React.useState("");
  const [clientsData, setClientsData] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchClients = async () => {
      const res = await getAllClients(branchId);
      if (res.data) {
        setClientsData(res.data);
      } else {
        toast.error(res.error);
      }
    };
    fetchClients();
  }, [branchId]);

  const onFinal = async () => {
    setLoading(true);
    try {
      await assignToClient(id, clientId, email);
      toast.success("Successfully assigned to client.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setFinalOpen(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={finalOpen}
        onClose={() => setFinalOpen(false)}
        title="Assign Employee"
        description="Assign employee to their respective client"
      >
        <form onSubmit={onFinal} className="space-y-4">
          <div className="space-y-1">
            <Label>Client</Label>
            <Select defaultValue={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clientsData.map((client) => (
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
      <DropdownMenu>
        <DropdownMenuTrigger className="no-print" asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {trainingStatus === "Deployment" && (
            <DropdownMenuItem onClick={() => setFinalOpen(true)}>
              <BookOpenCheck className="w-4 h-4 mr-2" />
              Assign to Client
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
