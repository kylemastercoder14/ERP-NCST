"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AccountPayableValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Supplier, Transaction } from "@prisma/client";
import { createAccountPayable, updateAccountPayable } from "@/actions";
import Heading from "@/components/ui/heading";

const AccountPayableForm = ({
  initialData,
  suppliers,
}: {
  initialData: Transaction | null;
  suppliers: Supplier[];
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Account Payable" : "Add Account Payable";
  const description = initialData
    ? "Please fill all the information to update the account payable."
    : "Please fill all the information to add a new account payable.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof AccountPayableValidators>>({
    resolver: zodResolver(AccountPayableValidators),
    defaultValues: {
      amount: initialData?.amount || 0,
      supplierId: initialData?.supplierId || "",
      description: initialData?.description || "",
      accountType: initialData?.accountType || "ASSET",
      name: initialData?.name || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof AccountPayableValidators>) => {
    try {
      if (initialData) {
        const res = await updateAccountPayable(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/sales-management/accounts-payable");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createAccountPayable(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/sales-management/accounts-payable");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while adding account payable.");
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
            placeholder="Enter name"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            dynamicOptions={["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"].map((type) => ({
              label: type,
              value: type,
            }))}
            isRequired={true}
            name="accountType"
            disabled={isSubmitting}
            label="Account Type"
            placeholder="Select account type"
          />
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
            fieldType={FormFieldType.INPUT}
            isRequired={true}
            type="number"
            name="amount"
            disabled={isSubmitting}
            label="Amount"
            placeholder="Enter amount"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            isRequired={true}
            name="description"
            disabled={isSubmitting}
            label="Description"
            placeholder="Enter description"
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
