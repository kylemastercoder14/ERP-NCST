import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { PayrollColumn } from "./_components/column";
import { format } from "date-fns";
import PayrollClient from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();

  const user = await db.userAccount.findUnique({
    where: { id: userId },
    select: { employeeId: true },
  });

  const data = await db.paySlip.findMany({
    where: {
      employeeId: user?.employeeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: {
        include: {
          BaseSalary: true,
        },
      },
    },
  });

  const formattedData: PayrollColumn[] =
    data.map((item) => {
      const baseSalary = item.Employee.BaseSalary[0]?.amount || 0;

      const sss = baseSalary * 0.05;
      const philhealth = baseSalary * 0.035;
      const pagibig = baseSalary * 0.03;
      const tin = baseSalary * 0.1;
      const totalDeductions = sss + philhealth + pagibig + tin;
      return {
        id: item.id,
        amount: item.Employee.BaseSalary.find((id) => id.employeeId === user?.employeeId)
          ? `₱${item.Employee.BaseSalary.find(
              (id) => id.employeeId === user?.employeeId
            )!
              .amount.toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` // Add commas after formatting
          : "N/A",
        deductions: `₱${totalDeductions
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, // Add commas after formatting
        payrollDate: item.date ? `${item.date}, 2025` : "N/A",
		fileName: item.file,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Payroll Management"
          description="Manage all of your payroll and you can view your payslips here."
        />
      </div>
      <Separator className="my-5" />
      <PayrollClient data={formattedData} />
    </div>
  );
};

export default Page;
