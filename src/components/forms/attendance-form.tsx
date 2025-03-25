"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AttendanceManagementValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Employee } from "@prisma/client";
import { createAttendance, updateAttendance } from "@/actions";
import Heading from "@/components/ui/heading";
import { AttendanceManagementWithProps } from "@/types";

const AttendanceForm = ({
  initialData,
  employees,
}: {
  initialData: AttendanceManagementWithProps | null;
  employees: Employee[];
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Attendance" : "Add Attendance";
  const description = initialData
    ? "Please fill all the information to update the attendance."
    : "Please fill all the information to add a new attendance.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof AttendanceManagementValidators>>({
    resolver: zodResolver(AttendanceManagementValidators),
    defaultValues: {
      employee: initialData?.employeeId || "",
      timeIn: initialData?.timeIn ? new Date(initialData.timeIn) : undefined,
	  timeOut: initialData?.timeOut ? new Date(initialData.timeOut) : undefined,
      status: initialData?.status || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof AttendanceManagementValidators>
  ) => {
    try {
      if (initialData) {
        const res = await updateAttendance(
          values,
          initialData?.id as string
        );
        if (res.success) {
          toast.success(res.success);
          router.push("/head/attendance-management");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createAttendance(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/attendance-management");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while adding attendance.");
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
            name="status"
            disabled={isSubmitting}
            label="Status"
            dynamicOptions={["Present", "Absent", "Late"].map((status) => ({
              label: status,
              value: status,
            }))}
            placeholder="Select status"
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

export default AttendanceForm;
