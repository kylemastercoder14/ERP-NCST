"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { JobPostValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Department, JobPosting, JobTitle } from "@prisma/client";
import { createJobPost, updateJobPost } from "@/actions";
import Heading from "@/components/ui/heading";

const JobPostingForm = ({
  initialData,
  department,
  departments,
  jobPositions,
  session,
}: {
  initialData: JobPosting | null;
  department: string | null;
  departments: Department[];
  jobPositions: JobTitle[];
  session?: string;
}) => {
  const router = useRouter();
  const params = useParams();
  const title = initialData ? "Edit Job Post" : "Create Job Post";
  const description = initialData
    ? "Please fill all the information to update the job post."
    : "Please fill all the information to add a new job post.";
  const action = initialData ? "Save Changes" : "Submit";

  const form = useForm<z.infer<typeof JobPostValidators>>({
    resolver: zodResolver(JobPostValidators),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      attachment: initialData?.attachment || "",
      financialStatus: initialData?.finacialStatus || "Pending",
      adminApproval: initialData?.adminApproval || "Pending",
      department: initialData?.departmentId || "",
      jobPosition: initialData?.jobTitleId || "",
    },
  });

  // Watch the department field value
  const selectedDepartmentId = form.watch("department");

  // Filter job positions based on selected department
  const filteredJobPositions = selectedDepartmentId
    ? departments.find((d) => d.id === selectedDepartmentId)?.name ===
      "Operation"
      ? jobPositions.filter((job) => job.name === "Regular Employee")
      : jobPositions
    : jobPositions;

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof JobPostValidators>) => {
    try {
      if (initialData) {
        const res = await updateJobPost(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/job-posting`);
          } else {
            router.push("/head/job-posting");
          }
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createJobPost(values);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/job-posting`);
          } else {
            router.push("/head/job-posting");
          }
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while creating a job post.");
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
            name="title"
            disabled={isSubmitting}
            label="Title"
            placeholder="Enter the title of the job post"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={true}
            name="description"
            disabled={isSubmitting}
            label="Description"
            placeholder="Enter the description of the job post"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DROP_ZONE}
            isRequired={true}
            name="attachment"
            disabled={isSubmitting}
            label="Attachment"
            description="Only png, jpg, jpeg and webp files are accepted. Max size is 2MB."
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              isRequired={true}
              name="department"
              disabled={isSubmitting}
              label="Department"
              placeholder="Select the department of the job post"
              dynamicOptions={departments.map((department) => ({
                value: department.id,
                label: department.name,
              }))}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              isRequired={true}
              name="jobPosition"
              disabled={isSubmitting}
              label="Job Position"
              placeholder="Select the job position of the job post"
              dynamicOptions={filteredJobPositions.map((jobPosition) => ({
                value: jobPosition.id,
                label: jobPosition.name,
              }))}
            />
          </div>
          {department === "Finance" && session !== "superadmin" && (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              isRequired={true}
              name="financialStatus"
              disabled={isSubmitting}
              label="Finacial Status"
              placeholder="Select the finacial status of the job post"
              dynamicOptions={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
            />
          )}
          {session === "superadmin" && (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              isRequired={true}
              name="adminApproval"
              disabled={isSubmitting}
              label="Admin Approval"
              placeholder="Select the admin approval of the job post"
              dynamicOptions={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
            />
          )}
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

export default JobPostingForm;
