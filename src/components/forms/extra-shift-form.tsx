"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ExtraShiftValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createExtraShift, updateExtraShift } from "@/actions";
import Heading from "@/components/ui/heading";
import { ExtraShiftWithProps } from "@/types";

const ExtraShiftForm = ({
  initialData,
}: {
  initialData: ExtraShiftWithProps | null;
}) => {
  const now = new Date();
  const router = useRouter();
  const title = initialData ? "Edit Requested Overtime" : "Request Overtime";
  const description = initialData
    ? "Please fill all the information to update the overtime."
    : "Please fill all the information to add a new overtime.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof ExtraShiftValidators>>({
    resolver: zodResolver(ExtraShiftValidators),
    defaultValues: {
      timeIn: now,
      timeOut: initialData?.timeEnd ? new Date(initialData.timeEnd) : undefined,
      type: "Overtime",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ExtraShiftValidators>) => {
    try {
      if (initialData) {
        const res = await updateExtraShift(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.back();
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createExtraShift(values);
        if (res.success) {
          toast.success(res.success);
          router.back();
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while requesting overtime.");
      console.error(error);
    }
  };
  return (
    <div className="pb-10">
      <Heading title={title} description={description} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid mt-5 gap-6"
        >
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TIME_PICKER}
              isRequired={true}
              name="timeIn"
              disabled
              label="Clock In"
              placeholder="Select clock in"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TIME_PICKER}
              isRequired={true}
              name="timeOut"
              disabled={isSubmitting}
              label="Clock Out"
              placeholder="Select clock out"
            />
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            name="type"
            disabled
            label="Type"
          />
          <div className="flex items-center justify-end">
            <Button onClick={() => router.back()} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ExtraShiftForm;
