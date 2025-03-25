import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { PayslipGenerationColumn } from "./_components/column";
import { format } from "date-fns";
import PayslipGenerationClient from "./_components/client";

const Page = async () => {
  const data = await db.employee.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      BaseSalary: true,
      Department: true,
      JobTitle: true,
      GovernmentMandatories: true,
    },
  });

  const formattedData: PayslipGenerationColumn[] =
    data.map((item) => {
      const deductions = item.GovernmentMandatories.reduce((acc, curr) => {
        acc +=
          curr.sss +
          curr.philhealth +
          curr.pagibig +
          curr.tin +
          (curr.others ?? 0);
        return acc;
      }, 0);

      return {
        id: item.id,
        licenseNo: item.licenseNo,
        name: `${item.firstName} ${item.middleName || ""} ${item.lastName}`.trim(),
        type:
          item.BaseSalary.find((id) => id.employeeId === item.id)?.type ||
          "N/A",
        amount: item.BaseSalary.find((id) => id.employeeId === item.id)
          ? `₱${item.BaseSalary.find((id) => id.employeeId === item.id)!.amount.toFixed(2).toLocaleString()}`
          : "N/A",
        department: item.Department.name,
        position: item.JobTitle.name,
        deductions: `₱${deductions.toFixed(2).toLocaleString()}`,
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
