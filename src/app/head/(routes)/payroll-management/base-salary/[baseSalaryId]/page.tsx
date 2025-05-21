import React from "react";
import db from "@/lib/db";
import BaseSalaryForm from "@/components/forms/base-salary-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    baseSalaryId: string;
  }>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const params = await props.params;
  const baseSalary = await db.baseSalary.findUnique({
    where: {
      id: params.baseSalaryId,
    },
    include: {
      Employee: true,
    },
  });

  // employee Lists
  const employees = await db.employee.findMany({
    where: {
      branchId: user?.Employee.branchId,
      BaseSalary: {
        none: {},
      },
    },
    orderBy: {
      lastName: "asc",
    },
  });

  return (
    <div>
      <BaseSalaryForm employees={employees} initialData={baseSalary} session='head' />
    </div>
  );
};

export default Page;
