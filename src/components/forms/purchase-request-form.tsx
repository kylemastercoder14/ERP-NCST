"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { PurchaseRequestValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createPurchaseRequest, updatePurchaseRequest } from "@/actions";
import Heading from "@/components/ui/heading";
import { PurchaseRequestWithProps } from "@/types";
import { Items } from "@prisma/client";

const PurchaseRequestForm = ({
  initialData,
  items,
  department,
  session,
}: {
  initialData: PurchaseRequestWithProps | null;
  items: Items[];
  department: string | null;
  session: string;
}) => {
  const router = useRouter();
  const params = useParams();
  const title = initialData ? "Edit Requested Purchase" : "Request Purchase";
  const description = initialData
    ? "Please fill all the information to update the requested purchase."
    : "Please fill all the information to request a new purchase.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof PurchaseRequestValidators>>({
    resolver: zodResolver(PurchaseRequestValidators),
    defaultValues: {
      department: department || "",
      items: initialData?.PurchaseRequestItem.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        totalAmount: item.totalAmount,
      })) || [{ itemId: "", quantity: 1, totalAmount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof PurchaseRequestValidators>
  ) => {
    try {
      const itemsWithPrice = values.items.map((item) => {
        const selectedItem = items.find((i) => i.id === item.itemId);
        if (!selectedItem) throw new Error("Invalid item selected.");

        const unitPrice = selectedItem.unitPrice;
        const totalAmount = item.quantity * unitPrice; // Calculate totalAmount here

        return {
          ...item,
          unitPrice, // Make sure unitPrice is sent
          totalAmount, // Add totalAmount to each item
        };
      });

      const payload = {
        ...values,
        items: itemsWithPrice, // Send the computed items with totalAmount per item
      };

      console.log("Payload:", payload); // Debugging line

      if (initialData) {
        const res = await updatePurchaseRequest(
          payload,
          initialData?.id as string
        );
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/purchase-request`);
          } else {
            router.push("/head/purchase-request");
          }
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createPurchaseRequest(payload);
        if (res.success) {
          toast.success(res.success);
          if (session === "superadmin") {
            router.push(`/superadmin/${params.branchId}/purchase-request`);
          } else {
            router.push("/head/purchase-request");
          }
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while requesting a purchase.");
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
            name="department"
            label="Department"
            isRequired={true}
            disabled
          />
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-4 rounded relative space-y-4"
              >
                <div className="grid lg:grid-cols-2 gap-4 items-end">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.COMBOBOX}
                    name={`items.${index}.itemId`}
                    dynamicOptions={items.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    label="Item"
                    placeholder="Select item"
                    isRequired={true}
                  />
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name={`items.${index}.quantity`}
                    type="number"
                    label="Quantity"
                    placeholder="Enter quantity"
                    isRequired={true}
                  />
                </div>
                {fields.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Delete Column
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ itemId: "", quantity: 1 })}
            >
              + Add Item
            </Button>
          </div>
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

export default PurchaseRequestForm;
