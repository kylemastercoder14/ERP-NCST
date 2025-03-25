"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AccountValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { generateRandomPassword } from "@/lib/utils";
import { createAccount } from "@/actions";

const CreateAccountForm = ({
  employeeId,
  onClose,
}: {
  employeeId: string;
  onClose: () => void;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof AccountValidators>>({
    resolver: zodResolver(AccountValidators),
    defaultValues: {
      email: "",
      password: generateRandomPassword(12),
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof AccountValidators>) => {
    try {
      const res = await createAccount(values, employeeId as string);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
        onClose();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while creating employee account");
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid mt-5 gap-6">
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
          tooltip
          tooltipContent="Password will be generated automatically. You can change it later."
          placeholder="Enter password"
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

export default CreateAccountForm;
