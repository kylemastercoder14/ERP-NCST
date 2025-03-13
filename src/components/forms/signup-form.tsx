"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegistrationValidators } from "@/validators";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { createAccount, resendOtpCode, verifyAccount } from "@/actions";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCodeTimer, setResendCodeTimer] = useState(0);
  const form = useForm<z.infer<typeof RegistrationValidators>>({
    resolver: zodResolver(RegistrationValidators),
    defaultValues: {
      employeeId: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: undefined,
      position: undefined,
    },
  });

  const startResendTimer = () => {
    let timeLeft = 60;
    setResendCodeTimer(timeLeft);

    const timer = setInterval(() => {
      timeLeft -= 1;
      setResendCodeTimer(timeLeft);
      if (timeLeft <= 0) clearInterval(timer);
    }, 1000);
  };

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof RegistrationValidators>) => {
    try {
      const res = await createAccount(values);
      if (res.success) {
        toast.success(
          "Account created successfully. Please check your email for verification"
        );
        setIsVerifying(true);
        startResendTimer();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while creating your account");
      console.error(error);
    }
  };

  const onVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (otpCode.length < 6) {
      toast.error("Please enter a valid OTP code");
      setIsLoading(false);
      return;
    }

    try {
      const res = await verifyAccount(otpCode, form.watch("email"));
      if (res.success) {
        toast.success("Account verified successfully. You can now login");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while verifying your account");
      console.error(error);
    }
  };

  const resendCode = async () => {
    try {
      const res = await resendOtpCode(form.watch("email"));
      if (res.success) {
		toast.success("OTP code resent successfully");
        startResendTimer();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while resending the code");
      console.error(error);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Verify your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter the OTP code sent to your email to verify your account
          </p>
        </div>
        <form onSubmit={onVerify}>
          <div className="flex flex-col items-center gap-3 justify-center text-center">
            <InputOTP
              disabled={isLoading}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otpCode}
              onChange={(value) => setOtpCode(value)}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot className="size-14" index={0} />
                <InputOTPSlot className="size-14" index={1} />
                <InputOTPSlot className="size-14" index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot className="size-14" index={3} />
                <InputOTPSlot className="size-14" index={4} />
                <InputOTPSlot className="size-14" index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="text-sm mt-3 text-center mb-4 text-muted-foreground">
            Please enter the one-time password sent to your email.
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            Verify Email
          </Button>
          <div className="flex items-center gap-2 mt-3 justify-center">
            <Button
              onClick={resendCode}
              disabled={resendCodeTimer > 0}
              variant="ghost"
              type="button"
            >
              Resend Code {resendCodeTimer > 0 && `(${resendCodeTimer}s)`}
            </Button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your credentials below to create your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="employeeId"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Employee ID <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="123-456" {...field} />
                </FormControl>
                <FormDescription>
                  Make sure your employee ID is matched with your company ID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2 lg:grid-cols-2 grid-cols-1">
            <FormField
              control={form.control}
              name="firstName"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Dela Cruz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                <FormDescription>
                  Password must be at least 8 characters long
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 gap-2 grid-cols-1">
            <FormField
              control={form.control}
              name="role"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Role <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HEAD">Head</SelectItem>
                      <SelectItem value="ASSISTANT">Assistant</SelectItem>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Department <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACCOUNTING">
                        Accounting/Finance
                      </SelectItem>
                      <SelectItem value="OPERATION">Operation</SelectItem>
                      <SelectItem value="HR">
                        Human Resource Management
                      </SelectItem>
                      <SelectItem value="CRM">
                        Customer Relationship Management
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Continue
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/sign-in" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </div>
  );
}
