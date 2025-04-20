"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AccomplishmentReportValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createAccomplishmentReport, updateAccomplishmentReport } from "@/actions";
import Heading from "@/components/ui/heading";
import { AccomplishmentReport } from "@prisma/client";

const LeaveForm = ({
  initialData,
}: {
  initialData: AccomplishmentReport | null;
}) => {
  const router = useRouter();
  const title = initialData
    ? "Edit Accomplishment Report"
    : "Add Accomplishment Report";
  const description = initialData
    ? "Please fill all the information to update the accomplishment report."
    : "Please fill all the information to request a new accomplishment report.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof AccomplishmentReportValidators>>({
    resolver: zodResolver(AccomplishmentReportValidators),
    defaultValues: {
      report: initialData?.report || "",
      date: initialData?.date || new Date().toISOString(),
      images: initialData?.images || [],
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof AccomplishmentReportValidators>
  ) => {
    try {
      if (initialData) {
        const res = await updateAccomplishmentReport(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.back();
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createAccomplishmentReport(values);
        if (res.success) {
          toast.success(res.success);
          router.back();
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while submitting accomplishment report.");
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
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            name="report"
            disabled={isSubmitting}
            label="Title"
            placeholder="Enter title of the report"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            name="date"
            disabled
            label="Date"
            placeholder="Select date"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.MULTIPLE_IMAGES}
            isRequired={true}
            name="images"
            disabled={isSubmitting}
            label="Images"
            description="Upload 1 to 3 images in .png, .jpg, .jpeg, .webp format
                                        with a resolution of at least 100*100 px and the file must
                                        not be bigger than 5 MB."
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

export default LeaveForm;
