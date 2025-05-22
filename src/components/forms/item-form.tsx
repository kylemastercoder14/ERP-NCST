"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { ItemValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Items, Supplier } from "@prisma/client";
import { createItem, updateItem } from "@/actions";
import Heading from "@/components/ui/heading";

const AccountPayableForm = ({
  initialData,
  suppliers,
  session,
}: {
  initialData: Items | null;
  suppliers: Supplier[];
  session: string;
}) => {
  const router = useRouter();
  const params = useParams();
  const title = initialData ? "Edit Item" : "Add Item";
  const description = initialData
    ? "Please fill all the information to update the item."
    : "Please fill all the information to add a new item.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof ItemValidators>>({
    resolver: zodResolver(ItemValidators),
    defaultValues: {
      unitPrice: initialData?.unitPrice || 0,
      name: initialData?.name || "",
      description: initialData?.description || "",
      supplierId: initialData?.supplierId || "",
      isSmallItem: initialData?.isSmallItem,
      specification: initialData?.specification || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ItemValidators>) => {
    try {
      if (initialData) {
        const res = await updateItem(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/items-list`);
          } else {
            router.push(`/head/items-list`);
          }
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createItem(values);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/items-list`);
          } else {
            router.push(`/head/items-list`);
          }
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while adding item.");
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
            label="Name"
            placeholder="Enter item name"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            type="number"
            name="unitPrice"
            disabled={isSubmitting}
            label="Unit Price"
            placeholder="Enter unit price"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={false}
            name="description"
            disabled={isSubmitting}
            label="Description"
            placeholder="Enter description (if any)"
          />
          {!form.watch("isSmallItem") && (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.RICHTEXT}
              isRequired={false}
              name="specification"
              disabled={isSubmitting}
              label="Specification"
              placeholder="Enter detailed specification (if any)"
            />
          )}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.COMBOBOX}
            dynamicOptions={suppliers.map((supplier) => ({
              label: supplier.name,
              value: supplier.id,
            }))}
            isRequired={true}
            name="supplierId"
            disabled={isSubmitting}
            label="Supplier"
            placeholder="Select supplier"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            isRequired={false}
            name="isSmallItem"
            disabled={isSubmitting}
            label="Is this a small item?"
            description="Check this if the item is small and can be request in other departments. (e.g. pen, paper, etc.)"
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

export default AccountPayableForm;
