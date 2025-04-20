"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookA, BookOpenCheck, Megaphone, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { changeTrainingStatus, getAllClients } from "@/actions";
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
  name: string;
  trainingStatus: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  name,
  trainingStatus,
}) => {
  const router = useRouter();
  const [orientationOpen, setOrientationOpen] = React.useState(false);
  const [trainingOpen, setTrainingOpen] = React.useState(false);
  const [deploymentOpen, setDeploymentOpen] = React.useState(false);
  const [finalOpen, setFinalOpen] = React.useState(false);
  const [clientId, setClientId] = React.useState("");
  const [clientsData, setClientsData] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchClients = async () => {
      const res = await getAllClients();
      if (res.data) {
        setClientsData(res.data);
      } else {
        toast.error(res.error);
      }
    };
    fetchClients();
  }, []);

  const onOrientation = async () => {
    setLoading(true);
    try {
      await changeTrainingStatus(id, "Orientation");
      toast.success("Successfully changed to Orientation/Seminar.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOrientationOpen(false);
    }
  };

  const onTraining = async () => {
    setLoading(true);
    try {
      await changeTrainingStatus(id, "Training");
      toast.success("Successfully changed to Training.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setTrainingOpen(false);
    }
  };

  const onDeployment = async () => {
    setLoading(true);
    try {
      await changeTrainingStatus(id, "Deployment");
      toast.success("Successfully changed to Deployment.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setTrainingOpen(false);
    }
  };

  const onFinal = async () => {
    setLoading(true);
    try {
      await changeTrainingStatus(id, "Assigned", clientId);
      toast.success("Successfully assigned to client.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setFinalOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        onConfirm={onOrientation}
        title={`Change ${name} to Orientation/Seminar?`}
        description="Are you sure you want to change this employee to Orientation/Seminar? This action cannot be undone."
        isOpen={orientationOpen}
        onClose={() => setOrientationOpen(false)}
        loading={loading}
      />
      <AlertModal
        onConfirm={onTraining}
        isOpen={trainingOpen}
        onClose={() => setTrainingOpen(false)}
        loading={loading}
      />
      <AlertModal
        onConfirm={onDeployment}
        isOpen={deploymentOpen}
        onClose={() => setDeploymentOpen(false)}
        loading={loading}
      />
      <Modal
        isOpen={finalOpen}
        onClose={() => setFinalOpen(false)}
        title="Assign Employee"
        description="Assign employee to their respective client"
      >
        <form onSubmit={onFinal} className='space-y-4'>
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
          <Button className='w-full'>Save Changes</Button>
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
          {trainingStatus === "Initial Interview" && (
            <DropdownMenuItem onClick={() => setOrientationOpen(true)}>
              <BookA className="w-4 h-4 mr-2" />
              Change To Orientation/Seminar
            </DropdownMenuItem>
          )}
          {trainingStatus === "Orientation" && (
            <DropdownMenuItem onClick={() => setTrainingOpen(true)}>
              <Megaphone className="w-4 h-4 mr-2" />
              Change To Training
            </DropdownMenuItem>
          )}
          {trainingStatus === "Training" && (
            <DropdownMenuItem onClick={() => setDeploymentOpen(true)}>
              <BookOpenCheck className="w-4 h-4 mr-2" />
              For Deployment
            </DropdownMenuItem>
          )}
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
