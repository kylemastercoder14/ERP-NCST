"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { BaseSalaryValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType, SALARYTYPE } from "@/lib/constants";
import { Employee } from "@prisma/client";
import { createBaseSalary, updateBaseSalary } from "@/actions";
import Heading from "@/components/ui/heading";
import { BaseSalaryWithProps } from "@/types";

const BaseSalaryForm = ({
  initialData,
  employees,
}: {
  initialData: BaseSalaryWithProps | null;
  employees: Employee[];
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Base Salary" : "Create Base Salary";
  const description = initialData
    ? "Please fill all the information to update the base salary."
    : "Please fill all the information to add a new base salary.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof BaseSalaryValidators>>({
    resolver: zodResolver(BaseSalaryValidators),
    defaultValues: {
      employee: initialData?.employeeId || "",
      type: initialData?.type || "",
      amount: initialData?.amount || 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof BaseSalaryValidators>) => {
    try {
      if (initialData) {
        const res = await updateBaseSalary(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/payroll-management/base-salary");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createBaseSalary(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/payroll-management/base-salary");
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
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            dynamicOptions={SALARYTYPE.map((type) => ({
              label: type,
              value: type,
            }))}
            isRequired={true}
            name="type"
            disabled={isSubmitting}
            label="Salary Type"
            placeholder="Select salary type"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            type="number"
            isRequired={true}
            name="amount"
            tooltip
            tooltipContent='Enter the base salary amount depends on salary type. For example, if the salary type is "Daily", enter the daily salary amount.'
            disabled={isSubmitting}
            label="Amount"
            placeholder="Enter amount (e.g. 800)"
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

export default BaseSalaryForm;
