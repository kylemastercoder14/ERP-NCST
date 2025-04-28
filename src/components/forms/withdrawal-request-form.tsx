"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { WithdrawalValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createWithdrawalRequest, updateWithdrawalRequest } from "@/actions";
import Heading from "@/components/ui/heading";
import { WithdrawalWithProps } from "@/types";
import { Items } from "@prisma/client";

const WithdrawalRequestForm = ({
  initialData,
  items,
  department,
}: {
  initialData: WithdrawalWithProps | null;
  items: Items[];
  department: string | null;
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Withdrawal" : "Create Withdrawal";
  const description = initialData
	? "Please fill all the information to update the withdrawal."
	: "Please fill all the information to create a new withdrawal.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof WithdrawalValidators>>({
	resolver: zodResolver(WithdrawalValidators),
	defaultValues: {
	  department: department || "",
	  items: initialData?.WithdrawalItem.map((item) => ({
		itemId: item.itemId,
		quantity: item.quantity,
	  })) || [{ itemId: "", quantity: 1 }],
	},
  });

  const { fields, append, remove } = useFieldArray({
	control: form.control,
	name: "items",
  });

  const { isSubmitting } = form.formState;


  const onSubmit = async (
	values: z.infer<typeof WithdrawalValidators>
  ) => {
	try {
	  if (initialData) {
		const res = await updateWithdrawalRequest(
		  values,
		  initialData?.id as string
		);
		if (res.success) {
		  toast.success(res.success);
		  router.push("/head/withdrawal-management");
		} else {
		  toast.error(res.error);
		}
	  } else {
		const res = await createWithdrawalRequest(values);
		if (res.success) {
		  toast.success(res.success);
		  router.push("/head/withdrawal-management");
		} else {
		  toast.error(res.error);
		}
	  }
	} catch (error) {
	  toast.error("An error occurred while creating a withdrawal.");
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

export default WithdrawalRequestForm;
