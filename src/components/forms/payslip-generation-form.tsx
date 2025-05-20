/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { PayslipGenerationWithProps } from "@/types";
import Image from "next/image";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateOvertimeHours, isSameDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { regularHolidays, specialHolidays } from "@/lib/constants";
import { toast } from "sonner";
import { upload } from "@/lib/upload";
import { savePayslipToPdf } from "@/actions";
import { useRouter } from "next/navigation";

const PayslipGenerationForm = ({
  initialData,
}: {
  initialData: PayslipGenerationWithProps | null;
}) => {
  const monthToday = new Date().toLocaleString("default", { month: "long" });
  const yearToday = new Date().getFullYear();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const overtimeHours = initialData?.ExtraShift
    ? Math.floor(calculateOvertimeHours(initialData.ExtraShift))
    : 0;

  const baseSalary = initialData?.BaseSalary[0].amount || 0;
  const dailyRate = baseSalary / 30;
  const overtimePay = overtimeHours * 100;

  const numberOfPaidLeaves =
    initialData?.LeaveManagement.filter(
      (leave) => leave.isPaid
    ).length || 0;

  const leavePay = numberOfPaidLeaves * dailyRate;

  // Holiday pay
  const workedRegularHolidayCount =
    initialData?.Attendance.filter((att) =>
      regularHolidays.some((holiday) => isSameDate(att.date, holiday))
    ).length || 0;

  const workedSpecialHolidayCount =
    initialData?.Attendance.filter((att) =>
      specialHolidays.some((holiday) => isSameDate(att.date, holiday))
    ).length || 0;

  const calculatedRegularHolidayPay = dailyRate * 2 * workedRegularHolidayCount;
  const calculatedSpecialHolidayPay =
    dailyRate * 1.3 * workedSpecialHolidayCount;

  const regularHolidayPay = calculatedRegularHolidayPay;
  const specialWorkingHolidayPay = calculatedSpecialHolidayPay;

  const currentYear = new Date().getFullYear();

  const totalEarnings =
    baseSalary +
    overtimePay +
    regularHolidayPay +
    specialWorkingHolidayPay +
    leavePay;

  const sss = baseSalary * 0.05;
  const philhealth = baseSalary * 0.035;
  const pagibig = baseSalary * 0.03;
  const tin = baseSalary * 0.1;

  // Calculate absent days - NEW IMPLEMENTATION
  const today = new Date();
  const currentMonth = today.getMonth();

  // Get all dates from 1st to today's date in the month
  const datesPassedInMonth = Array.from(
    { length: today.getDate() },
    (_, i) => new Date(currentYear, currentMonth, i + 1)
  );

  // Filter out weekends (optional - adjust based on your work week)
  const workDaysPassed = datesPassedInMonth.filter(
    (date) => date.getDay() !== 0 && date.getDay() !== 6 // 0 = Sunday, 6 = Saturday
  );

  // Get dates employee was present (from attendance records)
  const presentDates =
    initialData?.Attendance.map((att) => new Date(att.date)) || [];

  // Calculate absences by checking which work days passed have no attendance
  let absentDays = 0;
  workDaysPassed.forEach((workDay) => {
    const wasPresent = presentDates.some((presentDate) =>
      isSameDate(presentDate, workDay)
    );

    const isHoliday = [...regularHolidays, ...specialHolidays].some((holiday) =>
      isSameDate(holiday, workDay)
    );

    if (!wasPresent && !isHoliday) {
      absentDays++;
    }
  });

  const absentDeduction = absentDays * dailyRate;

  const nightShift = initialData?.shift === "Night Shift";

  // Calculate night differential - updated implementation
  let nightDiffHours = 0;
  const nightDiffStartHour = 22; // 10:00 PM
  const nightDiffEndHour = 6; // 6:00 AM

  if (nightShift) {
    initialData?.Attendance.forEach((att) => {
      if (att.timeIn && att.timeOut) {
        const timeIn = new Date(att.timeIn);
        const timeOut = new Date(att.timeOut);

        // Adjust for overnight shifts (e.g., 6PM-6AM)
        if (timeOut < timeIn) {
          timeOut.setDate(timeOut.getDate() + 1);
        }

        // Calculate night differential hours between 10PM-6AM
        const startNightDiff = new Date(timeIn);
        startNightDiff.setHours(nightDiffStartHour, 0, 0, 0);

        const endNightDiff = new Date(startNightDiff);
        endNightDiff.setHours(nightDiffEndHour + 24, 0, 0, 0); // Add 24 hours to handle overnight

        // Get the overlapping hours between shift and night differential period
        const overlapStart = new Date(
          Math.max(timeIn.getTime(), startNightDiff.getTime())
        );
        const overlapEnd = new Date(
          Math.min(timeOut.getTime(), endNightDiff.getTime())
        );

        if (overlapStart < overlapEnd) {
          const diffHours =
            (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60);
          nightDiffHours += diffHours;
        }
      }
    });
  }

  // Calculate undertime (same as before)
  let undertimeHours = 0;
  const standardWorkingHours = 12;
  const hourlyRate = dailyRate / standardWorkingHours;

  const nightDifferential = nightShift ? nightDiffHours * hourlyRate * 0.1 : 0;

  initialData?.Attendance.forEach((att) => {
    if (att.timeIn && att.timeOut) {
      const timeIn = new Date(att.timeIn);
      const timeOut = new Date(att.timeOut);
      const hoursWorked =
        (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);

      if (hoursWorked < standardWorkingHours) {
        undertimeHours += standardWorkingHours - hoursWorked;
      }
    }
  });

  const undertimeDeduction = undertimeHours * hourlyRate;
  const batDeduction = baseSalary * 0.2;

  // Update total deductions to include absent and undertime deductions
  const totalDeductions =
    sss +
    philhealth +
    pagibig +
    tin +
    absentDeduction +
    undertimeDeduction +
    batDeduction;

  // Find the leave balance for the current year
  const currentYearLeaveBalance = initialData?.EmployeeLeaveBalance.find(
    (balance) => balance.year === currentYear
  );

  // Check if paidLeaveUsed is 0 for the current year
  const hasBonus = currentYearLeaveBalance?.paidLeaveUsed === 0;
  const bonus = hasBonus ? baseSalary * 0.1 : 0;
  const netPay = totalEarnings + bonus + nightDifferential - totalDeductions;

  const printRef = React.useRef<HTMLDivElement>(null);

  // Updated handleSavePayslip
  const handleSavePayslip = async (pdfBlob: Blob) => {
    setLoading(true);

    try {
      if (!initialData) {
        throw new Error("Employee data not available");
      }

      // Validate required data
      if (!monthToday || !yearToday) {
        throw new Error("Date information missing");
      }

      const fileName = `Payslip_${initialData.lastName}_${monthToday}_${yearToday}.pdf`;
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });

      // Upload to S3 with error handling
      const uploadResult = await upload(file);
      if (!uploadResult?.url) {
        throw new Error("Failed to upload file to storage");
      }
      const { url } = uploadResult;

      const fullName = `${initialData.firstName} ${initialData.lastName}`;

      // Save payslip (with transactions if there's a deduction)
      const transactionRes = await savePayslipToPdf(
        url,
        batDeduction,
        netPay,
        monthToday,
        initialData.id,
        fullName
      );

      if (transactionRes.error) {
        throw new Error(transactionRes.error);
      }

      // Only proceed to print if everything succeeded
      handlePrint();
      toast.success(
        batDeduction > 0
          ? "Payslip and deduction recorded successfully"
          : "Payslip saved successfully"
      );
      router.refresh();
    } catch (error: any) {
      console.error("Payslip processing error:", {
        error: error.message,
        stack: error.stack,
        initialData,
        monthToday,
        yearToday,
        batDeduction,
        netPay,
      });
      toast.error(error.message || "Failed to process payslip");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced printing function with error handling
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Payslip_${initialData?.lastName}_${monthToday}_${yearToday}`,
    onAfterPrint: () => console.log("Payslip printed successfully"),
    onPrintError: (error) => {
      console.error("Printing error:", error);
      toast.error("Failed to print payslip");
    },
  });

  return (
    <div className="max-w-7xl pb-10">
      <div ref={printRef} className="print:p-8">
        {/* Header Section */}
        <div className="flex items-start w-full justify-between">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo.png" alt="Logo" width={60} height={60} />
            <div className="flex flex-col">
              <span className="font-semibold">BAT Security Services INC.</span>
              <span className="text-sm text-muted-foreground">
                Human Resource Management Office
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">
              Roof Deck MBT Bldg. The Prominade Residences
            </span>
            <span className="font-semibold">
              Brgy. Salawag, Dasmarinas City, Cavite
            </span>
            <span className="text-sm text-muted-foreground">
              batsecurityservices@gmail.com
            </span>
          </div>
        </div>

        {/* Pay Period */}
        <div className="flex mt-5 flex-col">
          <p className="font-semibold text-sm">Pay Period: </p>
          <h1 className="text-lg">
            Payslip for the month of {monthToday} {yearToday}
          </h1>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 mt-10 gap-5 mb-10">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-5">
              <p className="font-semibold">License No: </p>
              <p>{initialData?.licenseNo}</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <p className="font-semibold">Department: </p>
              <p>{initialData?.Department.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <p className="font-semibold">Date Joining: </p>
              <p>
                {initialData?.createdAt
                  ? format(new Date(initialData.createdAt), "MMMM dd, yyyy")
                  : "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <p className="font-semibold">Days Worked: </p>
              <p>
                {presentDates.length} of {workDaysPassed.length} days
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-5">
              <p className="font-semibold">Employee Name: </p>
              <p>
                {initialData?.lastName}, {initialData?.firstName}{" "}
                {initialData?.middleName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <p className="font-semibold">Job Title: </p>
              <p>{initialData?.JobTitle.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <p className="font-semibold">Salary Type: </p>
              <p>{initialData?.BaseSalary[0].type}</p>
            </div>
          </div>
        </div>

        {/* Payslip Table */}
        <Table className="border">
          <TableCaption>
            Make sure to double-check the values before printing the payslip.
            This can&apos;t be undone.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead className="text-black font-bold">Earnings</TableHead>
              <TableHead className="text-black font-bold">Deductions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Basic Salary: ₱
                {parseFloat(baseSalary.toFixed(2)).toLocaleString()}
              </TableCell>
              <TableCell>
                SSS: ₱{parseFloat(sss.toFixed(2)).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Overtime ({overtimeHours} hrs): ₱
                {parseFloat(overtimePay.toFixed(2)).toLocaleString()}
              </TableCell>
              <TableCell>
                Philhealth: ₱
                {parseFloat(philhealth.toFixed(2)).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Regular Holiday Pay ({workedRegularHolidayCount} day
                {workedRegularHolidayCount !== 1 && "s"}): ₱
                {parseFloat(regularHolidayPay.toFixed(2)).toLocaleString()}
              </TableCell>
              <TableCell>
                Pagibig: ₱{parseFloat(pagibig.toFixed(2)).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Special Holiday Pay ({workedSpecialHolidayCount} day
                {workedSpecialHolidayCount !== 1 && "s"}): ₱
                {parseFloat(
                  specialWorkingHolidayPay.toFixed(2)
                ).toLocaleString()}
              </TableCell>
              <TableCell>
                TIN: ₱{parseFloat(tin.toFixed(2)).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Leave Pay ({numberOfPaidLeaves} day
                {numberOfPaidLeaves !== 1 && "s"}): ₱
                {parseFloat(leavePay.toFixed(2)).toLocaleString()}
              </TableCell>
              <TableCell>
                Absent Deduction ({absentDays} day
                {absentDays !== 1 && "s"}): ₱
                {parseFloat(absentDeduction.toFixed(2)).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Night Differential Pay ₱
                {parseFloat(nightDifferential.toFixed(2)).toLocaleString()}
              </TableCell>
              <TableCell>
                Undertime Deduction ({undertimeHours.toFixed(1)} hrs): ₱
                {parseFloat(undertimeDeduction.toFixed(2)).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                BAT Deduction (20%): ₱
                {parseFloat(batDeduction.toFixed(2)).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Total Earnings:
                <span>
                  {" "}
                  ₱{parseFloat(totalEarnings.toFixed(2)).toLocaleString()}
                  {bonus && (
                    <span>
                      {" "}
                      + Bonus: ₱{parseFloat(
                        bonus.toFixed(2)
                      ).toLocaleString()}{" "}
                      (Bonus awarded for maintaining paid leave threshold)
                    </span>
                  )}
                </span>
              </TableCell>
              <TableCell>
                Total Deductions:
                <span>
                  {" "}
                  ₱{parseFloat(totalDeductions.toFixed(2)).toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                Net Pay:{" "}
                <span className="text-xl">
                  ₱{parseFloat(netPay.toFixed(2)).toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Print Button */}
        <div className="flex items-center justify-end mt-5">
          <Button
            disabled={loading}
            onClick={async () => {
              const pdfBlob = new Blob();
              await handleSavePayslip(pdfBlob);
            }}
          >
            Print Payslip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerationForm;
