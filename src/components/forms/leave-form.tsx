"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { LeaveManagementValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType, LEAVETYPE } from "@/lib/constants";
import { Employee } from "@prisma/client";
import { createLeave, updateLeave } from "@/actions";
import Heading from "@/components/ui/heading";
import { LeaveManagementWithProps } from "@/types";

const LeaveForm = ({
  initialData,
  employees,
}: {
  initialData: LeaveManagementWithProps | null;
  employees: Employee[];
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Requested Leave" : "Request Leave";
  const description = initialData
    ? "Please fill all the information to update the requested leave."
    : "Please fill all the information to request a new department.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof LeaveManagementValidators>>({
    resolver: zodResolver(LeaveManagementValidators),
    defaultValues: {
      employee: initialData?.employeeId || "",
      leaveType: initialData?.leaveType || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      leaveReason: initialData?.leaveReason || "",
      attachment: initialData?.attachment || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof LeaveManagementValidators>
  ) => {
    try {
        if (initialData) {
      	const res = await updateLeave(values, initialData?.id as string);
      	if (res.success) {
      	  toast.success(res.success);
      	  router.push("/head/leave-management");
      	} else {
      	  toast.error(res.error);
      	}
        } else {
      	const res = await createLeave(values);
      	if (res.success) {
      	  toast.success(res.success);
      	  router.push("/head/leave-management");
      	} else {
      	  toast.error(res.error);
      	}
        }
    } catch (error) {
      toast.error("An error occurred while requesting a leave.");
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
            fieldType={FormFieldType.COMBOBOX}
            dynamicOptions={LEAVETYPE.map((leave) => ({
              label: leave,
              value: leave,
            }))}
            isRequired={true}
            name="leaveType"
            disabled={isSubmitting}
            label="Leave Type"
            placeholder="Select leave type"
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              isRequired={true}
              name="startDate"
              disabled={isSubmitting}
              label="Start Date"
              placeholder="Select start date"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              isRequired={true}
              name="endDate"
              disabled={isSubmitting}
              label="End Date"
              placeholder="Select end date"
            />
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={true}
            name="leaveReason"
            disabled={isSubmitting}
            label="Reason for Leave"
            placeholder="Enter reason for leave"
          />
		  <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DROP_ZONE}
            isRequired={form.watch("leaveType") === "Sick Leave" ? true : false}
            name="attachment"
            disabled={isSubmitting}
            label="Attachment"
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
