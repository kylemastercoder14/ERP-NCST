"use client";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginValidators } from "@/validators";
import { loginAccount } from "@/actions";

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
        if (res.user?.Employee.JobTitle.name === "EMPLOYEE") {
          setTimeout(() => {
            router.push("/employee/dashboard");
          }, 1000);
        } else if (res.user?.Employee.JobTitle.name === "Head Supervisor") {
          setTimeout(() => {
            router.push("/head/dashboard");
          }, 1000);
        } else if (res.user?.Employee.JobTitle.name === "Assistant Supervisor") {
          setTimeout(() => {
            router.push("/assistant/dashboard");
          }, 1000);
        } else {
          setTimeout(() => {
            router.push("/user/dashboard");
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
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </FormLabel>

                <FormControl>
                  <Input type="password" placeholder="--------" {...field} />
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
