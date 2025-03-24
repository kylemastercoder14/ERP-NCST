"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { JobTitleValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { JobTitle } from "@prisma/client";
import { createJobTitle, updateJobTitle } from "@/actions";
import Heading from "@/components/ui/heading";

const JobTitleForm = ({ initialData }: { initialData: JobTitle | null }) => {
  const router = useRouter();
  const title = initialData ? "Edit Job Title" : "Create Job Title";
  const description = initialData
    ? "Please fill all the information to update the job title."
    : "Please fill all the information to create a new job title.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof JobTitleValidators>>({
    resolver: zodResolver(JobTitleValidators),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof JobTitleValidators>) => {
    try {
      if (initialData) {
        const res = await updateJobTitle(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/employee-management/job-title");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createJobTitle(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/employee-management/job-title");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while creating job title");
      console.error(error);
    }
  };
  return (
    <div className="pb-10">
      <Heading title={title} description={description} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gird-cols-2 mt-5 gap-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            name="name"
            disabled={isSubmitting}
            label="Name"
            placeholder="Enter name (e.g. Manager)"
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

export default JobTitleForm;
