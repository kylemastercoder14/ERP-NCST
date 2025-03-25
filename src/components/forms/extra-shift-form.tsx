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
import { Employee } from "@prisma/client";
import { createExtraShift, updateExtraShift } from "@/actions";
import Heading from "@/components/ui/heading";
import { ExtraShiftWithProps } from "@/types";

const ExtraShiftForm = ({
  initialData,
  employees,
}: {
  initialData: ExtraShiftWithProps | null;
  employees: Employee[];
}) => {
  const router = useRouter();
  const title = initialData
    ? "Edit Requested Undertime/Overtime"
    : "Request Undertime/Overtime";
  const description = initialData
    ? "Please fill all the information to update the undertime/overtime."
    : "Please fill all the information to add a new undertime/overtime.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof ExtraShiftValidators>>({
    resolver: zodResolver(ExtraShiftValidators),
    defaultValues: {
      employee: initialData?.employeeId || "",
      timeIn: initialData?.timeStart ? new Date(initialData.timeStart) : undefined,
      timeOut: initialData?.timeEnd ? new Date(initialData.timeEnd) : undefined,
      type: initialData?.type || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ExtraShiftValidators>) => {
    try {
      if (initialData) {
        const res = await updateExtraShift(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/attendance-management/overtime-undertime");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createExtraShift(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/attendance-management/overtime-undertime");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while requesting undertime/overtime.");
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
              fieldType={FormFieldType.TIME_PICKER}
              isRequired={true}
              name="timeIn"
              disabled={isSubmitting}
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
            fieldType={FormFieldType.SELECT}
            isRequired={true}
            name="type"
            disabled={isSubmitting}
            label="Type"
            dynamicOptions={["Overtime", "Undertime"].map((status) => ({
              label: status,
              value: status,
            }))}
            placeholder="Select type"
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
