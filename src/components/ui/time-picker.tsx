/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react"; // Clock icon

export type TimePickerProps = {
  value?: Date | string; // Accept Date or string
  onChangeAction: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function TimePicker({
  value,
  onChangeAction,
  placeholder = "Select a time",
  className,
  disabled
}: TimePickerProps) {
  // Ensure `value` is always a Date object
  const safeValue =
    value instanceof Date ? value : value ? new Date(value) : null;

  function handleTimeChange(type: "hour" | "minute" | "ampm", val: string) {
    const newDate = safeValue ? new Date(safeValue) : new Date();

    if (type === "hour") {
      const hour = parseInt(val, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(val, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (val === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (val === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    onChangeAction(newDate);
  }

  function handleQuickSelect(option: "today" | "last30" | "last1hr") {
    const now = new Date();
    if (option === "last30") now.setMinutes(now.getMinutes() - 30);
    if (option === "last1hr") now.setHours(now.getHours() - 1);
    onChangeAction(now);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
        disabled={disabled}
          variant="outline"
          className={cn(
            "w-full pl-3 pr-3 text-left font-normal flex justify-between items-center",
            className
          )}
        >
          <span>
            {safeValue
              ? safeValue.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : placeholder}
          </span>
          <Clock className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex sm:h-[300px] divide-x">
          {/* Quick Select */}
          <ScrollArea className="w-32">
            <div className="flex flex-col p-2">
              {[
                { label: "Now", value: "today" },
                { label: "Last 30 Min", value: "last30" },
                { label: "Last 1 Hour", value: "last1hr" },
              ].map((option) => (
                <Button
                  key={option.value}
                  size="icon"
                  variant="ghost"
                  className="w-full"
                  onClick={() => handleQuickSelect(option.value as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          {/* Hours */}
          <ScrollArea className="w-24">
            <div className="flex flex-col p-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={
                    safeValue && safeValue.getHours() % 12 === hour % 12
                      ? "default"
                      : "ghost"
                  }
                  className="w-full"
                  onClick={() => handleTimeChange("hour", hour.toString())}
                >
                  {hour}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          {/* Minutes */}
          <ScrollArea className="w-24">
            <div className="flex flex-col p-2">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={
                    safeValue?.getMinutes() === minute ? "default" : "ghost"
                  }
                  className="w-full"
                  onClick={() => handleTimeChange("minute", minute.toString())}
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          {/* AM/PM */}
          <ScrollArea className="w-24">
            <div className="flex flex-col p-2">
              {["AM", "PM"].map((ampm) => (
                <Button
                  key={ampm}
                  size="icon"
                  variant={
                    safeValue &&
                    ((ampm === "AM" && safeValue.getHours() < 12) ||
                      (ampm === "PM" && safeValue.getHours() >= 12))
                      ? "default"
                      : "ghost"
                  }
                  className="w-full"
                  onClick={() => handleTimeChange("ampm", ampm)}
                >
                  {ampm}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
