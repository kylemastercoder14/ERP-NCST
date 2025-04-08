import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { PayslipGenerationColumn } from "./_components/column";
import { format } from "date-fns";
import PayslipGenerationClient from "./_components/client";

const Page = async () => {
  const data = await db.employee.findMany({
    where: {
      isNewEmployee: false,
      BaseSalary: {
        some: {
          amount: { gt: 0 },
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      BaseSalary: true,
      Department: true,
      JobTitle: true,
      GovernmentMandatories: true,
      PaySlip: true,
    },
  });

  const formattedData: PayslipGenerationColumn[] =
    data.map((item) => {
      const baseSalary = item.BaseSalary[0]?.amount || 0;

      const sss = baseSalary * 0.05;
      const philhealth = baseSalary * 0.035;
      const pagibig = baseSalary * 0.03;
      const tin = baseSalary * 0.1;
      const totalDeductions = sss + philhealth + pagibig + tin;

      return {
        id: item.id,
        licenseNo: item.licenseNo,
        name: `${item.firstName} ${item.middleName || ""} ${item.lastName}`.trim(),
        type:
          item.BaseSalary.find((id) => id.employeeId === item.id)?.type ||
          "N/A",
        amount: item.BaseSalary.find((id) => id.employeeId === item.id)
          ? `₱${item.BaseSalary.find((id) => id.employeeId === item.id)!
              .amount.toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` // Add commas after formatting
          : "N/A",
        department: item.Department.name,
        position: item.JobTitle.name,
        deductions: `₱${totalDeductions
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, // Add commas after formatting
        payrollDate: item.PaySlip[0]?.date
          ? `${item.PaySlip[0]?.date}, 2025`
          : "N/A",
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Payslip Generation"
          description="You can generate payslip for each employee."
        />
      </div>
      <Separator className="my-5" />
      <PayslipGenerationClient data={formattedData} />
    </div>
  );
};

export default Page;
