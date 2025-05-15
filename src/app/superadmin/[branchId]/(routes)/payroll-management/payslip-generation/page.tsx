import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { PayslipGenerationColumn } from "./_components/column";
import { format } from "date-fns";
import PayslipGenerationClient from "./_components/client";

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.employee.findMany({
    where: {
      isNewEmployee: false,
      branchId: params.branchId,
      BaseSalary: {
        some: {
          amount: { gt: 0 },
        },
      },
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
      return {
        id: item.id,
        licenseNo: item.licenseNo || "N/A",
        name: `${item.firstName} ${item.middleName || ""} ${item.lastName}`.trim(),
        type:
          item.BaseSalary.find((id) => id.employeeId === item.id)?.type ||
          "N/A",
        department: item.Department.name,
        position: item.JobTitle.name,
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
