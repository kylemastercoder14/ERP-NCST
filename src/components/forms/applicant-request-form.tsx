"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { ApplicantRequest, GenderRequirement } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { createRequestApplicant, updateRequestApplicant } from "@/actions";
import { ApplicantRequestValidators } from "@/validators";

interface ApplicantRequestProps extends ApplicantRequest {
  genderRequirements: GenderRequirement[];
}

const ApplicantRequestForm = ({
  initialData,
  clientId,
}: {
  initialData: ApplicantRequestProps | null;
  clientId: string | null;
}) => {
  const router = useRouter();
  const title = initialData
    ? "Edit Applicant Request"
    : "Create Applicant Request";
  const description = initialData
    ? "Please fill all the information to update the applicant request."
    : "Please fill all the information to add a new applicant request.";
  const action = initialData?.id ? "Save Changes" : "Submit Applicant Request";

  const form = useForm<z.infer<typeof ApplicantRequestValidators>>({
    resolver: zodResolver(ApplicantRequestValidators),
    defaultValues: {
      totalApplicants: initialData?.totalApplicants || 0,
      maxAge: initialData?.maxAge || 0,
      minAge: initialData?.minAge || 0,
      genderRequirements: initialData?.genderRequirements?.map((req) => ({
        gender: req.gender as "MALE" | "FEMALE",
        count: req.count,
      })) || [
        { gender: "MALE", count: 0 },
        { gender: "FEMALE", count: 0 },
      ],
    },
  });

  const { isSubmitting } = form.formState;
  const { control } = form;

  // Watch genderRequirements changes
  const genderRequirements = useWatch({
    control,
    name: "genderRequirements",
  });

  // Calculate and update totalApplicants whenever gender counts change
  useEffect(() => {
    if (genderRequirements) {
      const total = genderRequirements.reduce(
        (sum, req) => sum + (Number(req?.count) || 0),
        0
      );
      form.setValue("totalApplicants", total, { shouldValidate: true });
    }
  }, [genderRequirements, form]);

  const onSubmit = async (
    values: z.infer<typeof ApplicantRequestValidators>
  ) => {
    try {
      // Filter out genders with 0 count
      const filteredGenders = values.genderRequirements.filter(
        (req) => req.count > 0
      );

      if (filteredGenders.length === 0) {
        toast.error(
          "At least one gender requirement must have a count greater than 0"
        );
        return;
      }

      const payload = {
        ...values,
        genderRequirements: filteredGenders,
        totalApplicants: filteredGenders.reduce(
          (sum, req) => sum + req.count,
          0
        ),
      };

      if (initialData) {
        const res = await updateRequestApplicant(payload, initialData.id);
        if (res.success) {
          toast.success(res.success);
          router.push("/client/applicant-request");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createRequestApplicant(payload, clientId as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/client/applicant-request");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while processing your applicant request.");
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
            name="totalApplicants"
            type="number"
            disabled={true}
            label="Total Applicants Needed"
            placeholder="Calculated automatically"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="minAge"
              type="number"
              disabled={isSubmitting}
              label="Minimum Age"
              placeholder="Enter minimum age"
              tooltip
              tooltipContent="The minimum age of the applicants, minimum age should be 18"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="maxAge"
              type="number"
              disabled={isSubmitting}
              label="Maximum Age"
              placeholder="Enter maximum age"
              tooltip
              tooltipContent="The maximum age of the applicants, maximum age should be 60"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={false}
              name="genderRequirements.0.count"
              type="number"
              disabled={isSubmitting}
              label="How many Male Applicants?"
              placeholder="Enter number of male applicants"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={false}
              name="genderRequirements.1.count"
              type="number"
              disabled={isSubmitting}
              label="How many Female Applicants?"
              placeholder="Enter number of female applicants"
            />
          </div>
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              onClick={() => router.back()}
              type="button"
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicantRequestForm;
