"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TransactionValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType, subAccountOptions } from "@/lib/constants";
import { Client, Supplier, Transaction } from "@prisma/client";
import { createTransaction, updateTransaction } from "@/actions";
import Heading from "@/components/ui/heading";

const AccountTransactionForm = ({
  initialData,
  suppliers,
  clients,
}: {
  initialData: Transaction | null;
  suppliers: Supplier[];
  clients: Client[];
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Transaction" : "Add Transaction";
  const description = initialData
    ? "Please fill all the information to update the transaction."
    : "Please fill all the information to add a new transaction.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof TransactionValidators>>({
    resolver: zodResolver(TransactionValidators),
    defaultValues: {
      amount: initialData?.amount || 0,
      supplierId: initialData?.supplierId || "",
      description: initialData?.description || "",
      accountType: initialData?.accountType || "ASSET",
      name: initialData?.name || "",
      type: initialData?.type || "CREDIT",
      clientId: initialData?.clientId || "",
      attachment: initialData?.attachment || "",
      subAccountType: initialData?.subAccountType || "CASH",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof TransactionValidators>) => {
    try {
      if (initialData) {
        const res = await updateTransaction(values, initialData?.id as string);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/sales-management");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createTransaction(values);
        if (res.success) {
          toast.success(res.success);
          router.push("/head/sales-management");
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred while adding transaction.");
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
            dynamicOptions={["CREDIT", "DEBIT"].map((type) => ({
              label: type,
              value: type,
            }))}
            isRequired={true}
            name="type"
            disabled={isSubmitting}
            label="Transaction Type"
            placeholder="Select transaction type"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            dynamicOptions={[
              "ASSET",
              "LIABILITY",
              "EQUITY",
              "INCOME",
              "EXPENSE",
            ].map((type) => ({
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
            dynamicOptions={subAccountOptions[form.watch("accountType")] || []}
            isRequired={true}
            name="subAccountType"
            disabled={isSubmitting}
            label="Sub Account Type"
            placeholder="Select sub account type"
          />

          {form.watch("type") === "CREDIT" ? (
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
          ) : (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.COMBOBOX}
              dynamicOptions={clients.map((client) => ({
                label: client.name,
                value: client.id,
              }))}
              isRequired={true}
              name="clientId"
              disabled={isSubmitting}
              label="Client"
              placeholder="Select client"
            />
          )}
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
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DROP_ZONE}
            isRequired={false}
            name="attachment"
            disabled={isSubmitting}
            label="Attachment"
            description="Upload any relevant files or documents related to this transaction such as invoice, receipt, or contract. You can upload single files only."
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

export default AccountTransactionForm;
