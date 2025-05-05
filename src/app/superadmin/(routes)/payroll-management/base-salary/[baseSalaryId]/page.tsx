import React from "react";
import db from "@/lib/db";
import BaseSalaryForm from "@/components/forms/base-salary-form";

const Page = async (props: {
  params: Promise<{
    baseSalaryId: string;
  }>;
}) => {
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
    orderBy: {
      lastName: "asc",
    },
  });

  return (
    <div>
      <BaseSalaryForm employees={employees} initialData={baseSalary} />
    </div>
  );
};

export default Page;
