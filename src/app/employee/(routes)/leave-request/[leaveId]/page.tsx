import React from "react";
import db from "@/lib/db";
import LeaveForm from "@/components/forms/leave-form";

const Page = async (props: {
  params: Promise<{
    leaveId: string;
  }>;
}) => {
  const params = await props.params;
  const leave = await db.leaveManagement.findUnique({
    where: {
      id: params.leaveId,
    },
    include: {
      Employee: true,
      ApprovedBy: true,
    },
  });

  return (
    <div>
      <LeaveForm initialData={leave} />
    </div>
  );
};

export default Page;
