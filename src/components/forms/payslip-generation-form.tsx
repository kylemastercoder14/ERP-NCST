"use client";

import React, { useState, useEffect } from "react";
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
import { calculateOvertimeHours } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

const PayslipGenerationForm = ({
  initialData,
}: {
  initialData: PayslipGenerationWithProps | null;
}) => {
  const monthToday = new Date().toLocaleString("default", { month: "long" });
  const yearToday = new Date().getFullYear();
  const overtimeHours = initialData?.ExtraShift
    ? Math.floor(calculateOvertimeHours(initialData.ExtraShift))
    : 0;

  // State for additional earnings inputs
  const [overtimePay, setOvertimePay] = useState<number>(0);
  const [regularHolidayPay, setRegularHolidayPay] = useState<number>(0);
  const [specialWorkingHolidayPay, setSpecialWorkingHolidayPay] =
    useState<number>(0);
  const [leavePay, setLeavePay] = useState<number>(0);
  const [incentives, setIncentives] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);

  // State for additional deductions inputs
  const [loans, setLoans] = useState<number>(0);

  // Calculated totals
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalDeductions, setTotalDeductions] = useState<number>(0);
  const [netPay, setNetPay] = useState<number>(0);

  // Calculate base salary and mandatory deductions
  const baseSalary = initialData?.BaseSalary[0].amount || 0;
  const sss = initialData?.GovernmentMandatories[0].sss || 0;
  const philhealth = initialData?.GovernmentMandatories[0].philhealth || 0;
  const pagibig = initialData?.GovernmentMandatories[0].pagibig || 0;
  const tin = initialData?.GovernmentMandatories[0].tin || 0;
  const otherDeductions = initialData?.GovernmentMandatories[0].others || 0;

  // Recalculate totals whenever inputs change
  useEffect(() => {
    const earnings =
      baseSalary +
      overtimePay +
      regularHolidayPay +
      specialWorkingHolidayPay +
      leavePay +
      incentives +
      allowance;

    const deductions =
      sss + philhealth + pagibig + tin + otherDeductions + loans;

    setTotalEarnings(earnings);
    setTotalDeductions(deductions);
    setNetPay(earnings - deductions);
  }, [
    baseSalary,
    overtimePay,
    regularHolidayPay,
    specialWorkingHolidayPay,
    leavePay,
    incentives,
    allowance,
    sss,
    philhealth,
    pagibig,
    tin,
    otherDeductions,
    loans,
  ]);

  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Payslip_${initialData?.lastName}_${monthToday}_${yearToday}`,
  });

  return (
    <div className="max-w-7xl pb-10">
      <div ref={printRef} className="print:p-8">
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
        <div className="flex mt-5 flex-col">
          <p className="font-semibold text-sm">Pay Period: </p>
          <h1 className="text-lg">
            Payslip for the month of {monthToday} {yearToday}
          </h1>
        </div>

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
              <p>{initialData?.Attendance.length}</p>
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

        <Table className="border">
          <TableCaption>
            Make sure to double-check the values before printing the payslip. This can&apos;t be undone.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead className="text-black font-bold">Earnings</TableHead>
              <TableHead className="text-black font-bold">Deductions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="!border-none">
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Basic Salary: </p>
                  <p>₱{initialData?.BaseSalary[0].amount.toFixed(2)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">SSS: </p>
                  <p>₱{initialData?.GovernmentMandatories[0].sss.toFixed(2)}</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Overtime Hours: </p>
                  <p>{overtimeHours}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Philhealth: </p>
                  <p>
                    ₱
                    {initialData?.GovernmentMandatories[0].philhealth.toFixed(
                      2
                    )}
                  </p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Overtime Pay: </p>
                  <Input
                    type="number"
                    placeholder="Enter overtime pay (if any)"
                    className="print-hidden"
                    value={overtimePay || ""}
                    onChange={(e) => setOvertimePay(Number(e.target.value))}
                  />
                  <p className="hidden print-block">
                    ₱{overtimePay.toFixed(2)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Pagibig: </p>
                  <p>
                    ₱{initialData?.GovernmentMandatories[0].pagibig.toFixed(2)}
                  </p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Regular Holiday Pay: </p>
                  <Input
                    type="number"
                    className='print-hidden'
                    placeholder="Enter regular holiday pay (if any)"
                    value={regularHolidayPay || ""}
                    onChange={(e) =>
                      setRegularHolidayPay(Number(e.target.value))
                    }
                  />
                  <p className="hidden print-block">
                    ₱{regularHolidayPay.toFixed(2)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Tin: </p>
                  <p>₱{initialData?.GovernmentMandatories[0].tin.toFixed(2)}</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Special Working Holiday Pay: </p>
                  <Input
                    type="number"
                    placeholder="Enter special working holiday pay (if any)"
                    value={specialWorkingHolidayPay || ""}
                    className='print-hidden'
                    onChange={(e) =>
                      setSpecialWorkingHolidayPay(Number(e.target.value))
                    }
                  />
                  <p className="hidden print-block">
                    ₱{specialWorkingHolidayPay.toFixed(2)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Others: </p>
                  <p>
                    ₱
                    {initialData?.GovernmentMandatories[0].others != null
                      ? initialData.GovernmentMandatories[0].others.toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Leave: </p>
                  <Input
                    type="number"
                    placeholder="Enter leave pay (if any)"
                    value={leavePay || ""}
                    className='print-hidden'
                    onChange={(e) => setLeavePay(Number(e.target.value))}
                  />
                  <p className="hidden print-block">
                    ₱{leavePay.toFixed(2)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Loans: </p>
                  <Input
                    type="number"
                    placeholder="Enter loans (if any)"
                    className='print-hidden'
                    value={loans || ""}
                    onChange={(e) => setLoans(Number(e.target.value))}
                  />
                  <p className="hidden print-block">
                    ₱{loans.toFixed(2)}
                  </p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Incentives: </p>
                  <Input
                    type="number"
                    placeholder="Enter incentives (if any)"
                    value={incentives || ""}
                    className='print-hidden'
                    onChange={(e) => setIncentives(Number(e.target.value))}
                  />
                  <p className="hidden print-block">
                    ₱{incentives.toFixed(2)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Total Deductions: </p>
                  <p>₱{totalDeductions.toFixed(2)}</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="!border-none">
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Allowance: </p>
                  <Input
                    type="number"
                    placeholder="Enter allowance (if any)"
                    value={allowance || ""}
                    className='print-hidden'
                    onChange={(e) => setAllowance(Number(e.target.value))}
                  />
                  <p className="hidden print-block">
                    ₱{allowance.toFixed(2)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-5">
                  <p className="font-semibold">Total Earnings: </p>
                  <p>₱{totalEarnings.toFixed(2)}</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                Net Pay: <span className="text-lg">₱{netPay.toFixed(2)}</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex items-center gap-3 mt-5 justify-end">
        <Button variant="ghost">Cancel</Button>
        <Button onClick={() => handlePrint()}>Print</Button>
      </div>
    </div>
  );
};

export default PayslipGenerationForm;
