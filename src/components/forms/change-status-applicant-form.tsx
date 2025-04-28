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
import { sendInitialInterviewEmployeeStatus } from "@/actions";

const ChangeApplicantStatusForm = ({
  employeeId,
  onClose,
}: {
  employeeId: string;
  onClose: () => void;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SendApplicantStatusValidators>>({
    resolver: zodResolver(SendApplicantStatusValidators),
    defaultValues: {
      status: "",
      remarks: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof SendApplicantStatusValidators>
  ) => {
    try {
      const res = await sendInitialInterviewEmployeeStatus(
        values,
        employeeId as string
      );
      if (res.success) {
        toast.success(res.success);
        router.refresh();
        onClose();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred sending email notification.");
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid mt-5 gap-6">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          isRequired={true}
          dynamicOptions={["Passed", "Failed"].map((status) => ({
            label: status,
            value: status,
          }))}
          name="status"
          disabled={isSubmitting}
          label="Status"
          placeholder="Select a status"
        />
        {form.watch("status") === "Failed" && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={true}
            name="remarks"
            disabled={isSubmitting}
            label="Reason for failure"
            placeholder="Enter the reason for failure"
          />
        )}
        <div className="flex items-center justify-end">
          <Button onClick={() => router.back()} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangeApplicantStatusForm;
