"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ClientManagementValidators } from "@/validators";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/global/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { Client } from "@prisma/client";
import { createClient, updateClient } from "@/actions";
import Heading from "@/components/ui/heading";
import { generateRandomPassword } from '@/lib/utils';

const ClientForm = ({
  initialData,
}: {
  initialData: Client | null;
}) => {
  const router = useRouter();
  const title = initialData ? "Edit Client" : "Add Client";
  const description = initialData
	? "Please fill all the information to update the client."
	: "Please fill all the information to add a new client.";
  const action = initialData ? "Save Changes" : "Submit";
  const form = useForm<z.infer<typeof ClientManagementValidators>>({
	resolver: zodResolver(ClientManagementValidators),
	defaultValues: {
	  name: initialData?.name || "",
	  email: initialData?.email || "",
	  password: initialData?.password || generateRandomPassword(12),
	},
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
	values: z.infer<typeof ClientManagementValidators>
  ) => {
	try {
	  if (initialData) {
		const res = await updateClient(
		  values,
		  initialData?.id as string
		);
		if (res.success) {
		  toast.success(res.success);
		  router.push("/head/client-management");
		} else {
		  toast.error(res.error);
		}
	  } else {
		const res = await createClient(values);
		if (res.success) {
		  toast.success(res.success);
		  router.push("/head/client-management");
		} else {
		  toast.error(res.error);
		}
	  }
	} catch (error) {
	  toast.error("An error occurred while adding client.");
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
			  label="Client Name"
			  placeholder="Enter client name (e.g. Walter Mart)"
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

export default ClientForm;
