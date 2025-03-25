"use client";

import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const ComboBox = ({
  value,
  onChange,
  data,
  placeholder,
  disabled,
  className,
  emptyChildren,
}: {
  value: string;
  onChange: (value: string) => void;
  data: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyChildren?: React.ReactNode;
}) => {
  const selectedItem = data.find((item) => item.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          className={cn(
            "w-full border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between",
            !value && "text-gray-500"
          )}
          variant="ghost"
          role="combobox"
          aria-controls="combobox"
          aria-expanded="false"
        >
          {selectedItem?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={`w-full ${className} p-0`}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center px-10">
                {emptyChildren || (
                  <span className="text-gray-500">No items found</span>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onChange(item.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
