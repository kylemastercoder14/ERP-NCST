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
  FileText,
  Megaphone,
  MoreHorizontal,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import { getAllClients, sendEmployeeStatus } from "@/actions";
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
import ChangeApplicantStatusForm from "@/components/forms/change-status-applicant-form";
import { TrainingStatus } from "@/types";
import { PhysicalTrainingForm } from "@/components/forms/physical-training-form";
import { CustomerServiceTrainingForm } from "@/components/forms/customer-service-training-form";

interface CellActionProps {
  id: string;
  name: string;
  trainingStatus: TrainingStatus;
  departmentSession: string;
  branch: string;
  jobTitle: string;
  assessor: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  name,
  trainingStatus,
  departmentSession,
  branch,
  jobTitle,
  assessor,
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [physicalTrainingModalOpen, setPhysicalTrainingModalOpen] =
    React.useState(false);
  const [
    customerServiceTrainingModalOpen,
    setCustomerServiceTrainingModalOpen,
  ] = React.useState(false);
  const [deploymentModalOpen, setDeploymentModalOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = React.useState("");

  React.useEffect(() => {
    const loadClients = async () => {
      const res = await getAllClients();
      if (res.data) setClients(res.data);
    };
    loadClients();
  }, []);

  const handleDeploy = async () => {
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    setLoading(true);
    try {
      const res = await sendEmployeeStatus(
        { status: "Passed", remarks: "" },
        "Deployment",
        id,
        selectedClient,
        branch
      );

      if (res.success) {
        toast.success(res.success);
        router.refresh();
        setDeploymentModalOpen(false);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Failed to deploy employee");
    } finally {
      setLoading(false);
    }
  };

  // Status flow in correct order
  const statusFlow: TrainingStatus[] = [
    "Initial Interview",
    "Final Interview",
    "Orientation",
    "Physical Training",
    "Customer Service Training",
    "Deployment",
  ];

  const getNextStatus = (currentStatus: TrainingStatus): TrainingStatus => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1
      ? statusFlow[currentIndex + 1]
      : currentStatus;
  };

  const handleStatusAction = () => {
    switch (trainingStatus) {
      case "Physical Training":
        setPhysicalTrainingModalOpen(true);
        break;
      case "Customer Service Training":
        setCustomerServiceTrainingModalOpen(true);
        break;
      case "Deployment":
        setDeploymentModalOpen(true);
        break;
      default:
        setStatusModalOpen(true);
    }
  };

  const getActionLabel = () => {
    const nextStatus = getNextStatus(trainingStatus);

    if (trainingStatus === "Deployment") {
      return "Assign to Client";
    }
    return `Progress to ${nextStatus}`;
  };

  return (
    <>
      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update ${name}'s Status`}
        description={`Change status from ${trainingStatus} to ${getNextStatus(trainingStatus)}`}
      >
        <ChangeApplicantStatusForm
          jobTitle={jobTitle}
          employeeId={id}
          trainingStatus={trainingStatus}
          onClose={() => setStatusModalOpen(false)}
        />
      </Modal>

      {/* Physical Training Modal */}
      <Modal
        isOpen={physicalTrainingModalOpen}
        onClose={() => setPhysicalTrainingModalOpen(false)}
        title={`Physical Training Assessment - ${name}`}
        description="Record the physical training results"
        className="max-w-7xl"
      >
        <PhysicalTrainingForm
          employeeId={id}
          employeeName={name}
          jobTitle={jobTitle}
          assessor={assessor}
          onClose={() => setPhysicalTrainingModalOpen(false)}
          currentStatus={trainingStatus}
        />
      </Modal>

      {/* Customer Service Training Modal */}
      <Modal
        isOpen={customerServiceTrainingModalOpen}
        onClose={() => setCustomerServiceTrainingModalOpen(false)}
        title={`Customer Service Training Assessment - ${name}`}
        description="Record the customer service training results"
        className="max-w-7xl"
      >
        <CustomerServiceTrainingForm
          employeeId={id}
          employeeName={name}
          jobTitle={jobTitle}
          assessor={assessor}
          onClose={() => setCustomerServiceTrainingModalOpen(false)}
          currentStatus={trainingStatus}
        />
      </Modal>

      {/* Deployment Modal */}
      <Modal
        isOpen={deploymentModalOpen}
        onClose={() => setDeploymentModalOpen(false)}
        title={`Deploy ${name}`}
        description="Assign employee to a client"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Client</Label>
            <Select onValueChange={setSelectedClient}>
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
          <Button onClick={handleDeploy} disabled={loading} className="w-full">
            {loading ? "Deploying..." : "Confirm Deployment"}
          </Button>
        </div>
      </Modal>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleStatusAction}>
            <FileText className="w-4 h-4 mr-2" />
            {getActionLabel()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
