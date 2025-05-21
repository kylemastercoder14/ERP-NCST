"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { LeaveManagementValidators } from "@/validators";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  session,
}: {
  initialData: LeaveManagementWithProps | null;
  employeeId: string;
  session: string;
}) => {
  const router = useRouter();
  const params = useParams();
  const [leaveBalance, setLeaveBalance] = React.useState<{
    total: number;
    used: number;
    available: number;
  }>({ total: 5, used: 0, available: 5 });

  const [isCalculating, setIsCalculating] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);

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
  const isPaidLeave = form.watch("isPaid");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Initialize leave balance
  React.useEffect(() => {
    const initializeBalance = async () => {
      try {
        const year = new Date().getFullYear();
        const balance = await getEmployeeLeaveBalance(employeeId, year);

        setLeaveBalance({
          total: balance.paidLeaveTotal,
          used: balance.paidLeaveUsed,
          available: balance.paidLeaveTotal - balance.paidLeaveUsed,
        });
      } catch (error) {
        console.error("Failed to initialize leave balance:", error);
        setLeaveBalance({
          total: 5,
          used: 0,
          available: 5,
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeBalance();
  }, [employeeId]);

  // Calculate leave days when dates change
  React.useEffect(() => {
    const calculateLeaveDays = () => {
      if (!startDate || !endDate) return;

      try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
          form.setError("endDate", {
            type: "manual",
            message: "End date must be after start date",
          });
          return;
        }

        // Calculate difference in days (inclusive of both start and end dates)
        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

        form.setValue("daysUsed", daysDiff);
      } catch (error) {
        console.error("Error calculating leave days:", error);
      }
    };

    calculateLeaveDays();
  }, [startDate, endDate, form]);

  const calculateLeaveBalance = async () => {
    if (!employeeId || !startDate || !endDate) return;

    setIsCalculating(true);

    try {
      const start = new Date(startDate);
      const year = start.getFullYear();
      const balance = await getEmployeeLeaveBalance(employeeId, year);
      const remainingPaidLeave = balance.paidLeaveTotal - balance.paidLeaveUsed;

      setLeaveBalance({
        total: balance.paidLeaveTotal,
        used: balance.paidLeaveUsed,
        available: remainingPaidLeave,
      });

      if (!form.formState.touchedFields.isPaid) {
        const daysRequested = form.getValues("daysUsed");
        const canBePaid = daysRequested <= remainingPaidLeave;
        form.setValue("isPaid", canBePaid);

        if (!canBePaid) {
          toast.warning(
            `Only ${remainingPaidLeave} paid leave days left. This leave will be unpaid.`
          );
        }
      }
    } catch (error) {
      console.error("Error calculating leave balance:", error);
      toast.error("Failed to calculate leave balance.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate leave balance when relevant values change
  React.useEffect(() => {
    calculateLeaveBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, startDate, form.watch("daysUsed")]);

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
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/leave-management`);
          } else if (session === "head") {
            router.push(`/head/leave-management`);
          } else if (session === "employee") {
            router.push(`/employee/leave-request`);
          } else {
            router.push(`/reporting-manager/leave-management`);
          }
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createLeave(leaveData);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/leave-management`);
          } else if (session === "head") {
            router.push(`/head/leave-management`);
          } else if (session === "employee") {
            router.push(`/employee/leave-request`);
          } else {
            router.push(`/reporting-manager/leave-management`);
          }
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
          {isInitializing ? (
            <div className="text-sm text-muted-foreground">
              Loading leave balance...
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Available paid leave: {leaveBalance.available} days (out of{" "}
              {leaveBalance.total})
            </div>
          )}

          {/* Paid/Unpaid Radio Group */}
          <div className="space-y-2">
            <Label>Leave Payment Type</Label>
            <RadioGroup
              defaultValue={form.getValues("isPaid") ? "paid" : "unpaid"}
              onValueChange={(value) => {
                form.setValue("isPaid", value === "paid");
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Paid Leave</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unpaid" id="unpaid" />
                <Label htmlFor="unpaid">Unpaid Leave</Label>
              </div>
            </RadioGroup>
            {!isPaidLeave && (
              <p className="text-sm text-orange-500">
                This leave will not deduct from your paid leave balance.
              </p>
            )}
          </div>

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
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="daysUsed"
              disabled={true}
              label="Days used"
              placeholder="Enter days used"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="year"
              disabled={true}
              label="Year"
              placeholder="Enter year"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              isRequired={true}
              name="startDate"
              disabled={isSubmitting}
              label="Start Date"
              placeholder="Select start date"
              isBirthdate={false}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              isRequired={true}
              name="endDate"
              disabled={isSubmitting}
              label="End Date"
              placeholder="Select end date"
              isBirthdate={false}
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

          <div className="flex items-center justify-end gap-4">
            <Button onClick={() => router.back()} type="button" variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || isCalculating || isInitializing}
              type="submit"
            >
              {isCalculating ? "Calculating..." : action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LeaveForm;
