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
import { changeTrainingStatus } from "@/actions";

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
  const [loading, setLoading] = React.useState(false);

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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
