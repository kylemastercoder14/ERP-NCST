"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SendApplicantStatusValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { sendEmployeeStatus } from "@/actions";
import { TrainingStatus } from "@/types";

const ChangeApplicantStatusForm = ({
  employeeId,
  onClose,
  trainingStatus,
  jobTitle,
}: {
  employeeId: string;
  onClose: () => void;
  trainingStatus: TrainingStatus;
  jobTitle: string;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SendApplicantStatusValidators>>({
    resolver: zodResolver(SendApplicantStatusValidators),
    defaultValues: {
      status: "",
      remarks: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof SendApplicantStatusValidators>
  ) => {
    try {
      const res = await sendEmployeeStatus(
        values,
        trainingStatus,
        employeeId,
        undefined, // clientId (not needed for status changes)
        undefined, // branch (not needed for status changes)
        jobTitle // pass jobTitle here
      );

      if (res.success) {
        toast.success(res.success);
        router.refresh();
        onClose();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="status"
          label="Status"
          placeholder="Select status"
          dynamicOptions={[
            { label: "Passed", value: "Passed" },
            { label: "Failed", value: "Failed" },
          ]}
        />

        {form.watch("status") === "Failed" && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="remarks"
            label="Remarks"
            placeholder="Enter remarks for failure"
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangeApplicantStatusForm;
