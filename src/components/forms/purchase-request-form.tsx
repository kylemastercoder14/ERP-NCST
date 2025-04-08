"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { PurchaseRequestValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createPurchaseRequest, updatePurchaseRequest } from "@/actions";
import Heading from "@/components/ui/heading";
import { PurchaseRequestWithProps } from "@/types";

const PurchaseRequestForm = ({
  initialData,
}: {
  initialData: PurchaseRequestWithProps | null;
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Requested Purchase" : "Request Purchase";
  const description = initialData
    ? "Please fill all the information to update the requested purchase."
    : "Please fill all the information to request a new purchase.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof PurchaseRequestValidators>>({
    resolver: zodResolver(PurchaseRequestValidators),
    defaultValues: {
      name: initialData?.item || "",
      quantity: initialData?.quantity || 0,
      unitPrice: initialData?.unitPrice || 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof PurchaseRequestValidators>
  ) => {
    try {
        if (initialData) {
      	const res = await updatePurchaseRequest(values, initialData?.id as string);
      	if (res.success) {
      	  toast.success(res.success);
      	  router.push("/head/purchase-request");
      	} else {
      	  toast.error(res.error);
      	}
        } else {
      	const res = await createPurchaseRequest(values);
      	if (res.success) {
      	  toast.success(res.success);
      	  router.push("/head/purchase-request");
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
            isRequired={true}
            name="name"
            disabled={isSubmitting}
            label="Item name"
            placeholder="Enter input name"
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              isRequired={true}
              type="number"
              name="quantity"
              disabled={isSubmitting}
              label="Quantity"
              placeholder="Enter quantity"
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
