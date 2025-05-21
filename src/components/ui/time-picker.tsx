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
import { Clock } from "lucide-react";
import { toZonedTime } from "date-fns-tz";

export type TimePickerProps = {
  value?: Date | string;
  onChangeAction: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  bookedTimes?: { start: Date; end: Date }[];
};

const MANILA_TIMEZONE = "Asia/Manila";

export function TimePicker({
  value,
  onChangeAction,
  placeholder = "Select a time",
  className,
  disabled,
  bookedTimes = [],
}: TimePickerProps) {
  // Convert UTC to Manila time for display
  const safeValue =
    value instanceof Date
      ? toZonedTime(value, MANILA_TIMEZONE)
      : value
        ? toZonedTime(new Date(value), MANILA_TIMEZONE)
        : null;

  function isTimeBooked(hour: number, minute: number, ampm: string): boolean {
    if (!bookedTimes.length) return false;

    const selectedHour =
      ampm === "PM" && hour !== 12
        ? hour + 12
        : ampm === "AM" && hour === 12
          ? 0
          : hour;
    const selectedDate = new Date();
    selectedDate.setHours(selectedHour, minute, 0, 0);

    // Convert from Manila time to UTC for comparison
    const selectedTimeInManila = toZonedTime(selectedDate, MANILA_TIMEZONE);
    const selectedTimeUTC = new Date(selectedTimeInManila);
    selectedTimeUTC.setMinutes(
      selectedTimeUTC.getMinutes() - selectedTimeUTC.getTimezoneOffset()
    );

    return bookedTimes.some((booked) => {
      const start = new Date(booked.start);
      const end = new Date(booked.end);
      return selectedTimeUTC >= start && selectedTimeUTC < end;
    });
  }

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

    // Convert Manila time back to UTC before saving
    const utcDate = new Date(newDate);
    utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
    onChangeAction(utcDate);
  }

  function handleQuickSelect(option: "today" | "last30" | "last1hr") {
    const now = new Date();
    if (option === "last30") now.setMinutes(now.getMinutes() - 30);
    if (option === "last1hr") now.setHours(now.getHours() - 1);

    // Convert to UTC
    const utcDate = new Date(now);
    utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
    onChangeAction(utcDate);
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
              {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => {
                const isBooked = isTimeBooked(
                  hour,
                  safeValue?.getMinutes() || 0,
                  (safeValue ? safeValue.getHours() : 0) >= 12 ? "PM" : "AM"
                );

                return (
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
                    disabled={isBooked}
                  >
                    {hour}
                  </Button>
                );
              })}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          {/* Minutes */}
          <ScrollArea className="w-24">
            <div className="flex flex-col p-2">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => {
                const isBooked = isTimeBooked(
                  (safeValue ? safeValue.getHours() : 0) % 12 || 12,
                  minute,
                  (safeValue ? safeValue.getHours() : 0) >= 12 ? "PM" : "AM"
                );

                return (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      safeValue?.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="w-full"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                    disabled={isBooked}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          {/* AM/PM */}
          <ScrollArea className="w-24">
            <div className="flex flex-col p-2">
              {["AM", "PM"].map((ampm) => {
                const isBooked = isTimeBooked(
                  (safeValue ? safeValue.getHours() : 0) % 12 || 12,
                  safeValue?.getMinutes() || 0,
                  ampm
                );

                return (
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
                    disabled={isBooked}
                  >
                    {ampm}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
