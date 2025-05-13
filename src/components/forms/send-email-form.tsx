"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SendEmailEmployeeValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { sendInitialInterviewEmployee } from "@/actions";

const SendEmailForm = ({
  email,
  onClose,
  departmentId,
  jobTitleId,
  branch,
}: {
  email: string;
  onClose: () => void;
  departmentId?: string;
  jobTitleId?: string;
  branch?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SendEmailEmployeeValidators>>({
    resolver: zodResolver(SendEmailEmployeeValidators),
    defaultValues: {
      date: "",
      time: undefined,
      location: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof SendEmailEmployeeValidators>
  ) => {
    try {
      const res = await sendInitialInterviewEmployee(
        values,
        email as string,
        departmentId as string,
        jobTitleId as string,
        branch as string
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
          fieldType={FormFieldType.DATE_PICKER}
          isBirthdate={false}
          isRequired={true}
          name="date"
          disabled={isSubmitting}
          label="Date of Initial Interview"
          placeholder="Select a date"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.TIME_PICKER}
          isRequired={true}
          name="time"
          disabled={isSubmitting}
          label="Time of Initial Interview"
          placeholder="Select a time"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          isRequired={true}
          name="location"
          disabled={isSubmitting}
          label="Location of Initial Interview"
          placeholder="Enter the location"
        />
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

export default SendEmailForm;
