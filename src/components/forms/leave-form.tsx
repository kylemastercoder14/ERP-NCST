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
import { createLeave, updateLeave, getEmployeeLeaveBalance } from "@/actions";
import Heading from "@/components/ui/heading";
import { LeaveManagementWithProps } from "@/types";

const LeaveForm = ({
  initialData,
  employeeId,
}: {
  initialData: LeaveManagementWithProps | null;
  employeeId: string;
}) => {
  const router = useRouter();
  const [availablePaidLeave, setAvailablePaidLeave] = React.useState<number>(5);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const title = initialData ? "Edit Requested Leave" : "Request Leave";
  const description = initialData
    ? "Please fill all the information to update the requested leave."
    : "Please fill all the information to request a new leave.";
  const action = initialData ? "Save Changes" : "Submit";

  const form = useForm<z.infer<typeof LeaveManagementValidators>>({
    resolver: zodResolver(LeaveManagementValidators),
    defaultValues: {
      leaveType: initialData?.leaveType || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      leaveReason: initialData?.leaveReason || "",
      attachment: initialData?.attachment || "",
      isPaid: initialData?.isPaid ?? true,
      daysUsed: initialData?.daysUsed || 0,
      year: initialData?.year || new Date().getFullYear(),
    },
  });

  const { isSubmitting } = form.formState;

  React.useEffect(() => {
    const calculateLeave = async () => {
      const startDate = form.watch("startDate");
      const endDate = form.watch("endDate");

      if (startDate && endDate) {
        setIsCalculating(true);
        try {
          const start = new Date(startDate);
          const end = new Date(endDate);

          // Validate dates
          if (end < start) {
            form.setError("endDate", {
              type: "manual",
              message: "End date must be after start date",
            });
            return;
          }

          const year = start.getFullYear();
          const timeDiff = end.getTime() - start.getTime();
          const daysRequested = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

          const balance = await getEmployeeLeaveBalance(employeeId, year);
          const remainingPaidLeave =
            balance.paidLeaveTotal - balance.paidLeaveUsed;

          setAvailablePaidLeave(remainingPaidLeave);

          const isPaid = daysRequested <= remainingPaidLeave;
          form.setValue("isPaid", isPaid);
          form.setValue("daysUsed", daysRequested);
          form.setValue("year", year);

          if (!isPaid) {
            toast.warning(
              `You only have ${remainingPaidLeave} paid leave days remaining.
              This leave will be marked as unpaid.`
            );
          }
        } catch (error) {
          console.error("Error calculating leave:", error);
        } finally {
          setIsCalculating(false);
        }
      }
    };

    const subscription = form.watch((value, { name }) => {
      if (name === "startDate" || name === "endDate") {
        calculateLeave();
      }
    });

    return () => subscription.unsubscribe();
  }, [form, employeeId]);

  const onSubmit = async (
    values: z.infer<typeof LeaveManagementValidators>
  ) => {
    try {
      const leaveData = {
        ...values,
        employeeId,
        status: "Pending",
      };

      if (initialData) {
        const res = await updateLeave(leaveData, initialData.id);
        if (res.success) {
          toast.success(res.success);
          router.back();
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createLeave(leaveData);
        if (res.success) {
          toast.success(res.success);
          router.back();
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
          {!isCalculating && (
            <div className="text-sm text-muted-foreground">
              Available paid leave: {availablePaidLeave} days (out of 5)
              {form.watch("isPaid") === false && (
                <span className="text-orange-500 ml-2">
                  (This leave will be unpaid)
                </span>
              )}
            </div>
          )}

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
            isRequired={form.watch("leaveType") === "Sick Leave"}
            name="attachment"
            disabled={isSubmitting}
            label="Attachment"
          />

          <div className="flex items-center justify-end">
            <Button onClick={() => router.back()} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isSubmitting || isCalculating} type="submit">
              {isCalculating ? "Calculating..." : action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LeaveForm;
