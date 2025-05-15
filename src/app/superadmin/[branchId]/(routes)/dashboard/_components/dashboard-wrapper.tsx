"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import DashboardSkeleton from "@/components/global/dashboard-skeleton";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track URL changes to show loading state
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Subscribe to router events to detect navigation
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  return (
    <div className="flex flex-col relative">
      {isLoading ? <DashboardSkeleton /> : children}
    </div>
  );
}
