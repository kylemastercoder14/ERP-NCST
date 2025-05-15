"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SiteSettingsValidators } from "@/validators";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import Heading from "@/components/ui/heading";

const MaintenanceToggle = () => {
  const router = useRouter();
  const title = "Toggle Maintenance Mode";
  const description =
    "Configure your site's maintenance mode settings. When enabled, visitors will see a maintenance page with your custom message.";
  const action = "Save Changes";

  const form = useForm<z.infer<typeof SiteSettingsValidators>>({
    resolver: zodResolver(SiteSettingsValidators),
    defaultValues: {
      maintenanceMode: false,
      maintenanceMessage: "",
      maintenanceEndDate: "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/maintenance");
        const data = await response.json();

        form.reset({
          maintenanceMode: data.maintenanceMode,
          maintenanceMessage: data.maintenanceMessage || "",
          maintenanceEndDate: data.maintenanceEndDate || "",
        });
      } catch (error) {
        toast.error("Failed to load settings");
        console.error(error);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof SiteSettingsValidators>) => {
    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      toast.success("Maintenance settings updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
            fieldType={FormFieldType.SWITCH}
            isRequired={true}
            name="maintenanceMode"
            disabled={isSubmitting}
            label="Enable Maintenance Mode"
            description="When enabled, all visitors will be redirected to a maintenance page"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={false}
            name="maintenanceMessage"
            disabled={isSubmitting}
            label="Maintenance Message"
            placeholder="We're performing scheduled maintenance. Please check back later."
            description="This message will be displayed to visitors during maintenance"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            isRequired={false}
            name="maintenanceEndDate"
            disabled={isSubmitting}
            label="Maintenance End Date"
            placeholder="Select a date when maintenance will end"
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

export default MaintenanceToggle;
