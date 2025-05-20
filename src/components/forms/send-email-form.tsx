"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SendEmailEmployeeValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import {
  getScheduledInterviews,
  sendInitialInterviewEmployee,
} from "@/actions";

const SendEmailForm = ({
  email,
  onClose,
  departmentId,
  jobTitleId,
  branch,
}: {
  email: string;
  onClose: () => void;
  departmentId?: string;
  jobTitleId?: string;
  branch?: string;
}) => {
  const router = useRouter();
  const [bookedTimes, setBookedTimes] = React.useState<
    { start: Date; end: Date }[]
  >([]);
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  const form = useForm<z.infer<typeof SendEmailEmployeeValidators>>({
    resolver: zodResolver(SendEmailEmployeeValidators),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      time: new Date(new Date().setHours(8, 0, 0, 0)), // Default to 9:00 AM
      location: "",
      interviewStartTime: undefined,
      interviewEndTime: undefined,
    },
  });

  const { isSubmitting } = form.formState;
  const watchDate = form.watch("date");

  React.useEffect(() => {
    if (watchDate) {
      setSelectedDate(watchDate);
      // Fetch booked times for the selected date
      const fetchBookedTimes = async () => {
        try {
          const date = new Date(watchDate);
          const result = await getScheduledInterviews(date);
          setBookedTimes(result);
        } catch (error) {
          console.error("Failed to fetch booked times:", error);
        }
      };
      fetchBookedTimes();
    }
  }, [watchDate]);

  const onSubmit = async (
    values: z.infer<typeof SendEmailEmployeeValidators>
  ) => {
    try {
      // Combine date and time
      const date = new Date(values.date);
      const time = values.time;

      const interviewStartTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );

      // Assuming 1 hour duration for interview
      const interviewEndTime = new Date(interviewStartTime);
      interviewEndTime.setHours(interviewEndTime.getHours() + 1);

      // Update form values with calculated times
      form.setValue("interviewStartTime", interviewStartTime);
      form.setValue("interviewEndTime", interviewEndTime);

      // Check if time is already booked
      const isBooked = bookedTimes.some((booked) => {
        return (
          (interviewStartTime >= booked.start &&
            interviewStartTime < booked.end) ||
          (interviewEndTime > booked.start && interviewEndTime <= booked.end) ||
          (interviewStartTime <= booked.start && interviewEndTime >= booked.end)
        );
      });

      if (isBooked) {
        toast.error(
          "This time slot is already booked. Please choose another time."
        );
        return;
      }

      // Create the payload with all required fields
      const payload = {
        date: values.date,
        time: values.time,
        location: values.location,
        interviewStartTime,
        interviewEndTime,
      };

      const res = await sendInitialInterviewEmployee(
        payload,
        email as string,
        departmentId as string,
        jobTitleId as string,
        branch as string
      );

      if (res.success) {
        toast.success(res.success);
        router.refresh();
        onClose();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred sending email notification.");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid mt-5 gap-6">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.DATE_PICKER}
          isBirthdate={false}
          isRequired={true}
          name="date"
          disabled={isSubmitting}
          label="Date of Initial Interview"
          placeholder="Select a date"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.TIME_PICKER}
          isRequired={true}
          name="time"
          disabled={isSubmitting || !selectedDate}
          label="Time of Initial Interview"
          placeholder="Select a time"
          bookedTimes={bookedTimes}
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          isRequired={true}
          name="location"
          disabled={isSubmitting}
          label="Location of Initial Interview"
          placeholder="Enter the location"
        />
        <div className="flex items-center justify-end">
          <Button onClick={() => router.back()} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SendEmailForm;
