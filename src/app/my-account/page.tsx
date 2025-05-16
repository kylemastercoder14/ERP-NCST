import React from "react";
import db from "@/lib/db";
import ChangeAccount from "@/components/forms/change-account-form";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const employee = await db.employee.findUnique({
    where: {
      id: user?.employeeId
    },
    include: {
      UserAccount: true,
      JobTitle: true,
    },
  });

  return (
    <div className='h-screen flex items-center justify-center'>
      <ChangeAccount initialData={employee} jobTitle={employee?.JobTitle.name as string} />
    </div>
  );
};

export default Page;
