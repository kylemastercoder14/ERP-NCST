/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import db from "@/lib/db";
import LeaveForm from "@/components/forms/leave-form";
import { useUser } from "@/hooks/use-user";

const Page = async (props: {
  params: Promise<{
    leaveId: string;
  }>;
}) => {
  const { user } = await useUser();
  const params = await props.params;
  const leave = await db.leaveManagement.findUnique({
    where: {
      id: params.leaveId,
    },
    include: {
      Employee: {
        include: {
          EmployeeLeaveBalance: true,
        },
      },
      ApprovedBy: true,
    },
  });

  return (
    <div>
      <LeaveForm initialData={leave} employeeId={user?.employeeId as string} session='manager' />
    </div>
  );
};

export default Page;
