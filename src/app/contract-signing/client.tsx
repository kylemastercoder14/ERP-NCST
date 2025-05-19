"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import SignatureInput from "@/components/ui/signature-input";
import { toast } from "sonner";
import { employeeContractSigning } from "@/actions";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  agreed: z.boolean().default(false),
  useExistingSignature: z.boolean().default(true),
  signature: z.string().optional(),
});

const ContractViewer = ({
  fileUrl,
  employeeId,
  initialSignature,
}: {
  fileUrl: string;
  employeeId: string;
  initialSignature: string | null;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agreed: false,
      useExistingSignature: initialSignature ? true : false,
      signature: "",
    },
  });

  const { watch, setValue } = form;
  const { isSubmitting } = form.formState;
  const useExistingSignature = watch("useExistingSignature");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const signatureToSend =
        data.useExistingSignature && initialSignature
          ? initialSignature
          : (data.signature ?? "");

      const res = await employeeContractSigning(
        data.agreed,
        signatureToSend,
        employeeId
      );

      if (res.success) {
        if (signatureToSend && data.agreed === true) {
          toast.success("Contract signed successfully!");
        } else {
          toast.error(
            "You are not signing the contract. Your application will be voided, and the employer will be re-deployed."
          );
        }

		router.push("/sign-in");
      } else {
        toast.error("An error occurred while signing the contract.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <>
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(
          fileUrl
        )}&embedded=true`}
        width="100%"
        height="800px"
        className="border rounded mb-6"
        title="Contract PDF"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="agreed"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(Boolean(val))}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormLabel className="mb-0">
                  I agree to the terms in this contract.
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {initialSignature && (
            <FormField
              control={form.control}
              name="useExistingSignature"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 mb-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(val) => {
                        field.onChange(Boolean(val));
                        if (val) {
                          setValue("signature", "");
                        }
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="mb-0 font-medium cursor-pointer select-none">
                    Use existing signature
                  </FormLabel>
                  {/* Optional: small preview of existing signature */}
                  {field.value && initialSignature && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={initialSignature}
                      alt="Existing signature"
                      className="ml-4 h-12 rounded border border-gray-300"
                    />
                  )}
                </FormItem>
              )}
            />
          )}

          {!useExistingSignature && (
            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium mb-2">Signature</FormLabel>
                  <FormControl>
                    <SignatureInput
                      canvasRef={
                        canvasRef as React.RefObject<HTMLCanvasElement>
                      }
                      onSignatureChange={(val: string | null) => {
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button disabled={isSubmitting} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ContractViewer;
