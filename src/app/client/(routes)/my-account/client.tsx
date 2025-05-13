"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Client } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { upload } from "@/lib/upload";
import { updateClientAccount, updateClientLogo } from "@/actions";

// Form schema
const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().optional(),
    contactNo: z
      .string()
      .optional()
      .refine((val) => {
        if (val) {
          return /^09\d{9}$/.test(val);
        }
        return true;
      }, "Contact number must start with 09 and be 11 digits long"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

const ChangeAccountForm = ({ initialData }: { initialData: Client | null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(
    initialData?.logo || null
  );

  // Track upload progress
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      contactNo: initialData?.contactNo || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const previewUrl = URL.createObjectURL(file);
      setLogoImage(previewUrl);

      const { url: s3Url } = await upload(file, (progress) => {
        setUploadProgress(progress);
      });

      // Save to database using server action
      await updateClientLogo(s3Url, initialData?.id as string);
      setLogoImage(s3Url);
      toast.success("Logo updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to update logo");
      setLogoImage(initialData?.logo || null);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      await updateClientAccount(
        {
          name: values.name,
          email: values.email,
          logo: logoImage,
          address: values.address,
          contactNo: values.contactNo,
          newPassword: values.newPassword,
        },
        initialData?.id as string
      );

      toast.success("Account updated successfully!");
      router.push("/client/dashboard");
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error updating account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="flex flex-col justify-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={logoImage || undefined} />
          <AvatarFallback>{initialData?.name?.charAt(0)}</AvatarFallback>
          {isLoading && uploadProgress > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <span className="text-white text-sm">{uploadProgress}%</span>
            </div>
          )}
        </Avatar>
        <label className="cursor-pointer">
          <span className="text-sm font-medium text-primary">
            {isLoading ? "Uploading..." : "Change Logo"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={isLoading}
          />
        </label>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="contactNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact No.</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      maxLength={11}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangeAccountForm;
