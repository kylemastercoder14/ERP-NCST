import { Loader2 } from "lucide-react";
import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="fixed inset-0 flex z-[999] items-center justify-center bg-gray-100 opacity-80 backdrop-blur-md">
      <Loader2 className="h-10 w-10 animate-spin text-gray-700" />
    </div>
  );
}
