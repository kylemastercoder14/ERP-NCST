"use client";

import Image from "next/image";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback="">
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <Image
                src="/assets/logo.png"
                alt="Image"
                width={100}
                height={100}
              />
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xl">
              <ResetPasswordForm />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <Image
            src="/assets/bg.jpg"
            alt="Image"
            fill
            className="absolute inset-0 h-full w-full object-cover brightness-[0.5] dark:grayscale"
          />
        </div>
      </div>
    </Suspense>
  );
}
