"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { SupplierManagementValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Supplier } from "@prisma/client";
import { createSupplier, updateSupplier } from "@/actions";
import Heading from "@/components/ui/heading";
import { generateRandomPassword } from "@/lib/utils";

const SupplierForm = ({
  initialData,
  session,
}: {
  initialData: Supplier | null;
  session: string;
}) => {
  const router = useRouter();
  const params = useParams();
  const title = initialData ? "Edit Supplier" : "Add Supplier";
  const description = initialData
    ? "Please fill all the information to update the supplier."
    : "Please fill all the information to add a new supplier.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof SupplierManagementValidators>>({
    resolver: zodResolver(SupplierManagementValidators),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: initialData?.password || generateRandomPassword(12),
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof SupplierManagementValidators>
  ) => {
    try {
      if (initialData) {
        const res = await updateSupplier(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/supplier-management`);
          } else {
            router.push("/head/supplier-management");
          }
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createSupplier(values);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/supplier-management`);
          } else {
            router.push("/head/supplier-management");
          }
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while adding supplier.");
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
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            name="name"
            disabled={isSubmitting}
            label="Supplier Name"
            placeholder="Enter supplier name (e.g. Fujidenzo)"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            name="email"
            disabled={isSubmitting}
            label="Email Address"
            placeholder="Enter email address"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            name="password"
            disabled
            label="Password"
            placeholder="Enter password"
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

export default SupplierForm;
