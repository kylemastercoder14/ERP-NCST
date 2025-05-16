"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginValidators } from "@/validators";
import { loginAccount } from "@/actions";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<z.infer<typeof LoginValidators>>({
    resolver: zodResolver(LoginValidators),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof LoginValidators>) => {
    try {
      const res = await loginAccount(values);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Successfully logged in your account");

        // First check if password is still auto-generated
        if (!res.isPasswordHashed) {
          // Redirect to my-account page to change password
          setTimeout(() => {
            router.push("/my-account");
          }, 1000);
          return;
        }

        // If password is already hashed, proceed with normal role-based routing
        if (res.user?.Employee.JobTitle.name === "Regular Employee") {
          setTimeout(() => {
            router.push("/employee/attendance-management");
          }, 1000);
        } else if (res.user?.Employee.JobTitle.name === "Head Department") {
          setTimeout(() => {
            router.push("/head/dashboard");
          }, 1000);
        } else if (
          res.user?.Employee.JobTitle.name === "Assistant Supervisor"
        ) {
          setTimeout(() => {
            router.push("/assistant/dashboard");
          }, 1000);
        } else {
          setTimeout(() => {
            router.push("/reporting-manager/dashboard");
          }, 1000);
        }
      }
    } catch (error) {
      toast.error("An error occurred while logging in your account");
      console.error(error);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="juan.delacruz@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <div>
                    Password <span className="text-red-600">*</span>
                  </div>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="--------"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
