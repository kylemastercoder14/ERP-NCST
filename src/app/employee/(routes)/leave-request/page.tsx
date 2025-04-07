import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { LeaveManagementColumn } from "./_components/column";
import { format } from "date-fns";
import ApplicantClient from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();

  const user = await db.userAccount.findUnique({
    where: { id: userId },
    select: { employeeId: true },
  });

  const data = await db.leaveManagement.findMany({
    where: {
      employeeId: user?.employeeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
      ApprovedBy: {
        include: {
          Employee: true,
        },
      },
    },
  });

  const formattedData: LeaveManagementColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        leaveType: item.leaveType,
        startDate: format(new Date(item.startDate), "MMMM dd, yyyy"),
        endDate: format(new Date(item.endDate), "MMMM dd, yyyy"),
        status: item.status,
        approvedBy: item.ApprovedBy
          ? [
              item.ApprovedBy.Employee.firstName,
              item.ApprovedBy.Employee.middleName || "",
              item.ApprovedBy.Employee.lastName,
            ]
              .filter(Boolean)
              .join(" ")
          : "N/A",
        attachment: item.attachment || "",
        reason: item.leaveReason,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Leave Management"
          description="Manage all of your requested leave here. You can also update the leave request."
        />
        <Button size="sm">
          <Link href={`/employee/leave-request/request`}>+ Request Leave</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <ApplicantClient data={formattedData} />
    </div>
  );
};

export default Page;
