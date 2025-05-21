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

const WORK_START = parse("08:00 AM", "hh:mm a", new Date());
const WORK_END = parse("05:00 PM", "hh:mm a", new Date());

const ClockInOut = ({
  todayDate,
  employeeId,
}: {
  todayDate: string;
  employeeId: string;
}) => {
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get today's attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        console.log("Fetching attendance for:", todayDate, employeeId);
        const res = await getAttendanceDate(todayDate, employeeId);
        console.log("Attendance response:", res);
        if (res.attendance) {
          setAttendance(res.attendance);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance data");
      }
    };

    fetchAttendance();
  }, [todayDate, employeeId]);

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const now = new Date();
      const formattedTime = format(now, "hh:mm a");

      let status = "Present";
      const parsedTimeIn = parse(formattedTime, "hh:mm a", new Date());

      if (isAfter(parsedTimeIn, WORK_START)) {
        status = "Late";
      }

      console.log("Clock in data:", {
        employeeId,
        todayDate,
        formattedTime,
        status
      });

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
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      console.error("Clock in error:", err);
      setError("Failed to clock in");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const now = new Date();
      const formattedTime = format(now, "hh:mm a");

      const parsedTimeOut = parse(formattedTime, "hh:mm a", new Date());

      let status = attendance?.status || "Present";
      if (isBefore(parsedTimeOut, WORK_END)) {
        status = "Undertime";
      } else if (status === "Late" && isAfter(parsedTimeOut, WORK_END)) {
        status = "Late"; // retain late if clocked out on time
      }

      console.log("Clock out data:", {
        attendanceId: attendance?.id,
        formattedTime,
        status
      });

      const res = await clockOutEmployee(
        attendance?.id as string,
        formattedTime,
        status
      );

      if (res.attendance) {
        setAttendance(res.attendance);
        toast.success(`Clocked out at ${formattedTime}`);
        router.refresh();
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      console.error("Clock out error:", err);
      setError("Failed to clock out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
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
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ClockInOut;
