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

// Create a timezone helper to handle Asia/Manila timezone
const TIMEZONE = 'Asia/Manila';

// Helper functions for timezone handling
const formatInTimezone = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE
  });
};

const getLocalTimeInManila = (): Date => {
  const now = new Date();
  const manilaOffset = 8 * 60; // Manila is UTC+8 (8 hours * 60 minutes)
  const localOffset = now.getTimezoneOffset();
  const totalOffsetMinutes = manilaOffset + localOffset;

  const manilaTime = new Date(now.getTime() + totalOffsetMinutes * 60000);
  return manilaTime;
};

export type TimePickerProps = {
  value?: Date | string;
  onChangeAction: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  bookedTimes?: { start: Date; end: Date }[];
};

export function TimePicker({
  value,
  onChangeAction,
  placeholder = "Select a time",
  className,
  disabled,
  bookedTimes = []
}: TimePickerProps) {
  // Handle value safely, ensuring it's a Date object in Manila timezone
  const safeValue = React.useMemo(() => {
    if (!value) return null;

    const dateObj = value instanceof Date ? value : new Date(value);
    return dateObj;
  }, [value]);

  function isTimeBooked(hour: number, minute: number, ampm: string): boolean {
    if (!bookedTimes.length) return false;

    const selectedHour = ampm === "PM" && hour !== 12 ? hour + 12 : ampm === "AM" && hour === 12 ? 0 : hour;
    const selectedDate = new Date();
    selectedDate.setHours(selectedHour, minute, 0, 0);

    return bookedTimes.some(booked => {
      const start = new Date(booked.start);
      const end = new Date(booked.end);
      return selectedDate >= start && selectedDate < end;
    });
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", val: string) {
    // Base the new date off of the current value or create a new Manila time
    const newDate = safeValue ? new Date(safeValue) : getLocalTimeInManila();

    if (type === "hour") {
      const hour = parseInt(val, 10);
      const isPM = newDate.getHours() >= 12;
      // Set hour (0-23) based on AM/PM
      newDate.setHours(isPM ? (hour % 12) + 12 : hour % 12);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(val, 10));
    } else if (type === "ampm") {
      const currentHour = newDate.getHours();
      const currentHourIn12 = currentHour % 12;

      if (val === "AM" && currentHour >= 12) {
        newDate.setHours(currentHourIn12);
      } else if (val === "PM" && currentHour < 12) {
        newDate.setHours(currentHourIn12 + 12);
      }
    }

    onChangeAction(newDate);
  }

  function handleQuickSelect(option: "today" | "last30" | "last1hr") {
    const now = getLocalTimeInManila();
    if (option === "last30") now.setMinutes(now.getMinutes() - 30);
    if (option === "last1hr") now.setHours(now.getHours() - 1);
    onChangeAction(now);
  }

  // Get actual hour and period (AM/PM) for the value
  const getHour = (): number => {
    if (!safeValue) return 12;
    const hour = safeValue.getHours() % 12;
    return hour === 0 ? 12 : hour;
  };

  const getMinute = (): number => {
    return safeValue?.getMinutes() || 0;
  };

  const getAMPM = (): 'AM' | 'PM' => {
    if (!safeValue) return 'AM';
    return safeValue.getHours() >= 12 ? 'PM' : 'AM';
  };

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
              ? formatInTimezone(safeValue)
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
                const isBooked = isTimeBooked(hour, getMinute(), getAMPM());

                return (
                  <Button
                    key={hour}
                    size="icon"
                    variant={getHour() === hour ? "default" : "ghost"}
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
                const isBooked = isTimeBooked(getHour(), minute, getAMPM());

                return (
                  <Button
                    key={minute}
                    size="icon"
                    variant={getMinute() === minute ? "default" : "ghost"}
                    className="w-full"
                    onClick={() => handleTimeChange("minute", minute.toString())}
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
                const isBooked = isTimeBooked(getHour(), getMinute(), ampm);

                return (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={getAMPM() === ampm ? "default" : "ghost"}
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
