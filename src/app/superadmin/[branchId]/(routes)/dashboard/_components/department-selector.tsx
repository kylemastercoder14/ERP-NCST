"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentSelectorProps {
  defaultValue: string;
  branchId: string;
}

export function DepartmentSelector({
  defaultValue,
  branchId,
}: DepartmentSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChanging, setIsChanging] = useState(false);

  const handleChange = (value: string) => {
    setIsChanging(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("department", value);

    router.push(`/superadmin/${branchId}/dashboard?${params.toString()}`, {
      scroll: false,
    });

    setTimeout(() => {
      setIsChanging(false);
    }, 5000);
  };

  return (
    <div className="relative w-[200px]">
      <Select
        value={defaultValue}
        onValueChange={handleChange}
        disabled={isChanging}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Human Resource">Human Resource</SelectItem>
          <SelectItem value="Finance">Finance</SelectItem>
          <SelectItem value="Customer Relationship">
            Customer Relationship
          </SelectItem>
          <SelectItem value="Operation">Operation</SelectItem>
          <SelectItem value="Procurement">Procurement</SelectItem>
          <SelectItem value="Inventory">Inventory</SelectItem>
        </SelectContent>
      </Select>
      {isChanging && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
