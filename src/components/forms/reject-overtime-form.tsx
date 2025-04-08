"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { RejectLeaveValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { rejectOvertime } from "@/actions";

const RejectOvertimeForm = ({
  overtimeId,
  onClose,
}: {
  overtimeId: string;
  onClose: () => void;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof RejectLeaveValidators>>({
    resolver: zodResolver(RejectLeaveValidators),
    defaultValues: {
      reasonForRejection: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof RejectLeaveValidators>) => {
    try {
      const res = await rejectOvertime(values, overtimeId as string);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
        onClose();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while rejecting a requested leave");
      console.error(error);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid mt-5 gap-6"
        >
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={true}
            name="reasonForRejection"
            disabled={isSubmitting}
            label="Reason for Rejection"
            placeholder="Enter reason for rejection"
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
    </div>
  );
};

export default RejectOvertimeForm;
