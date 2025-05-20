"use client";

import { Attendance } from "@prisma/client";
import { format, isAfter, isBefore, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  clockInEmployee,
  clockOutEmployee,
  getAttendanceDate,
} from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ClockInOut = ({
  todayDate,
  employeeId,
  shift,
}: {
  todayDate: string;
  employeeId: string;
  shift: string;
}) => {
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);

  let WORK_START;
  let WORK_END;
  if (shift === "Day Shift") {
    WORK_START = parse("06:00 AM", "hh:mm a", new Date());
    WORK_END = parse("06:00 PM", "hh:mm a", new Date());
  } else if (shift === "Night Shift") {
    WORK_START = parse("06:00 PM", "hh:mm a", new Date());
    WORK_END = parse("06:00 AM", "hh:mm a", new Date());
  } else {
    WORK_START = parse("08:00 AM", "hh:mm a", new Date());
    WORK_END = parse("05:00 PM", "hh:mm a", new Date());
  }

  // Get today's attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await getAttendanceDate(todayDate, employeeId);
      if (res.attendance) setAttendance(res.attendance);
    };

    fetchAttendance();
  }, [todayDate, employeeId]);

  const handleClockIn = async () => {
    setLoading(true);
    const now = new Date();
    const formattedTime = format(now, "hh:mm a");

    let status = "Present";
    const parsedTimeIn = parse(formattedTime, "hh:mm a", new Date());

    if (isAfter(parsedTimeIn, WORK_START)) {
      status = "Late";
    }

    const res = await clockInEmployee(
      employeeId,
      todayDate,
      formattedTime,
      status
    );

    if (res.attendance) {
      setAttendance(res.attendance);
      toast.success(`Clocked in at ${formattedTime}`);
      router.refresh();
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    const now = new Date();
    const formattedTime = format(now, "hh:mm a");

    const parsedTimeOut = parse(formattedTime, "hh:mm a", new Date());

    let status = attendance?.status || "Present";
    if (isBefore(parsedTimeOut, WORK_END)) {
      status = "Undertime";
    } else if (status === "Late" && isAfter(parsedTimeOut, WORK_END)) {
      status = "Late"; // retain late if clocked out on time
    }

    const res = await clockOutEmployee(
      attendance?.id as string,
      formattedTime,
      status
    );

    if (res.attendance) {
      setAttendance(res.attendance);
      toast.success(`Clocked out at ${formattedTime}`);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      {!attendance?.timeIn && (
        <Button disabled={loading} onClick={handleClockIn}>
          Clock In
        </Button>
      )}
      {attendance?.timeIn && !attendance?.timeOut && (
        <Button disabled={loading} onClick={handleClockOut}>
          Clock Out
        </Button>
      )}
      {attendance?.timeIn && attendance?.timeOut && (
        <p className="text-sm text-muted-foreground">
          ✅ You have completed your attendance today.
        </p>
      )}
    </div>
  );
};

export default ClockInOut;
