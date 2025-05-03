"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ticketPriorities, ticketTypes, TicketValidators } from "@/validators";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Employee, Ticket } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { createTicket, updateTicket } from "@/actions";

const TicketForm = ({
  initialData,
  employees,
}: {
  initialData: Ticket | null;
  employees: Employee[];
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Ticket" : "Create Ticket";
  const description = initialData
    ? "Please fill all the information to update the ticket."
    : "Please fill all the information to add a new ticket.";
  const action = initialData?.id ? "Save Changes" : "Submit Ticket";

  const form = useForm<z.infer<typeof TicketValidators>>({
    resolver: zodResolver(TicketValidators),
    defaultValues: {
      type: initialData?.type || "general",
      priority: initialData?.priority || "medium",
      title: initialData?.title || "",
      description: initialData?.description || "",
      attachments: initialData?.attachments || [],
      employeeId: initialData?.employeeId || undefined,
    },
  });

  const { isSubmitting } = form.formState;
  const ticketType = form.watch("type");

  const onSubmit = async (values: z.infer<typeof TicketValidators>) => {
    try {
      if (initialData) {
        const res = await updateTicket(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/client/submit-ticket");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createTicket(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/client/submit-ticket");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while processing your ticket");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              name="title"
              disabled={isSubmitting}
              label="Title"
              placeholder="Enter title"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              dynamicOptions={ticketTypes.map((type) => ({
                label: type.charAt(0).toUpperCase() + type.slice(1),
                value: type,
              }))}
              isRequired={true}
              name="type"
              disabled={isSubmitting}
              label="Type"
              placeholder="Select type"
            />
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={true}
            name="description"
            disabled={isSubmitting}
            label="Description"
            placeholder="Describe your issue in detail"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            dynamicOptions={ticketPriorities.map((priority) => ({
              label: priority.charAt(0).toUpperCase() + priority.slice(1),
              value: priority,
            }))}
            isRequired={true}
            name="priority"
            disabled={isSubmitting}
            label="Priority"
            placeholder="Select priority"
          />

          {employees.length > 0 && ticketType === "employee" && (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.COMBOBOX}
              dynamicOptions={[
                { label: "Select an employee", value: "" },
                ...employees.map((employee) => ({
                  label: `${employee.firstName} ${employee.lastName}`,
                  value: employee.id,
                })),
              ]}
              name="employeeId"
              disabled={isSubmitting}
              label="Assign to Employee"
              placeholder="Select an employee (optional)"
              tooltip
              tooltipContent="Leave unassigned if this ticket isn't for a specific employee"
            />
          )}

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.MULTIPLE_IMAGES}
            isRequired={false}
            name="attachments"
            disabled={isSubmitting}
            label="Attachments"
            description="Upload 1 to 3 images in .png, .jpg, .jpeg, .webp format
                      with a resolution of at least 100*100 px and the file must
                      not be bigger than 5 MB."
          />

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

export default TicketForm;
