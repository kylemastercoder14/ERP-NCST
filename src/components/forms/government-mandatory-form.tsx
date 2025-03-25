"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { GovernmentMandatoriesValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Employee } from "@prisma/client";
import { createGovernmentMandatories, updateGovernmentMandatories } from "@/actions";
import Heading from "@/components/ui/heading";
import { GovernmentMandatoriesWithProps } from "@/types";

const GovernmentMandatoryForm = ({
  initialData,
  employees,
}: {
  initialData: GovernmentMandatoriesWithProps | null;
  employees: Employee[];
}) => {
  const router = useRouter();
  const title = initialData
    ? "Edit Government Mandatories"
    : "Create Government Mandatories";
  const description = initialData
    ? "Please fill all the information to update the government mandatories."
    : "Please fill all the information to add a new government mandatories.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof GovernmentMandatoriesValidators>>({
    resolver: zodResolver(GovernmentMandatoriesValidators),
    defaultValues: {
      employee: initialData?.employeeId || "",
      sss: initialData?.sss || 0,
      philhealth: initialData?.philhealth || 0,
      pagibig: initialData?.pagibig || 0,
      tin: initialData?.tin || 0,
      others: initialData?.others || 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof GovernmentMandatoriesValidators>
  ) => {
    try {
      if (initialData) {
        const res = await updateGovernmentMandatories(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/payroll-management/government-mandatories");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createGovernmentMandatories(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/payroll-management/government-mandatories");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while creating a base salary.");
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
            fieldType={FormFieldType.COMBOBOX}
            dynamicOptions={employees.map((employee) => ({
              label: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`,
              value: employee.id,
            }))}
            isRequired={true}
            name="employee"
            disabled={isSubmitting}
            label="Employee"
            placeholder="Select employee"
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              type="number"
              isRequired={true}
              name="sss"
              tooltip
              tooltipContent="Enter the sss deduction amount, this will help the system to calculate the sss deduction amount for the employee."
              disabled={isSubmitting}
              label="SSS Deduction"
              placeholder="Enter amount (e.g. 150)"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              type="number"
              isRequired={true}
              name="philhealth"
              tooltip
              tooltipContent="Enter the philhealth deduction amount, this will help the system to calculate the philhealth deduction amount for the employee."
              disabled={isSubmitting}
              label="Philhealth Deduction"
              placeholder="Enter amount (e.g. 150)"
            />
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              type="number"
              isRequired={true}
              name="pagibig"
              tooltip
              tooltipContent="Enter the pagibig deduction amount, this will help the system to calculate the pagibig deduction amount for the employee."
              disabled={isSubmitting}
              label="Pagibig Deduction"
              placeholder="Enter amount (e.g. 150)"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              type="number"
              isRequired={true}
              name="tin"
              tooltip
              tooltipContent="Enter the tin deduction amount, this will help the system to calculate the tin deduction amount for the employee."
              disabled={isSubmitting}
              label="TIN Deduction"
              placeholder="Enter amount (e.g. 150)"
            />
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            type="number"
            isRequired={true}
            name="others"
            tooltip
            tooltipContent="Enter the other deductions such as loan, cooperative, uniform, etc. You can add the total amount of the other deductions."
            disabled={isSubmitting}
            label="Others"
            placeholder="Enter amount (e.g. 200)"
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

export default GovernmentMandatoryForm;
