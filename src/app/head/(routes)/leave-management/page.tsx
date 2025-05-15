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
  const { user } = await useUser();
  const departmentSession = user?.Employee.Department.name;

  let data;

  if (departmentSession === "Human Resource") {
    data = await db.leaveManagement.findMany({
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
  } else {
    data = await db.leaveManagement.findMany({
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
  }

  const formattedData: LeaveManagementColumn[] = data.map((item) => {
    let approvedByName = "N/A";

    // Case 1: ApprovedBy relation exists
    if (item.ApprovedBy?.Employee) {
      approvedByName = `${item.ApprovedBy.Employee.firstName} ${item.ApprovedBy.Employee.middleName || ""} ${item.ApprovedBy.Employee.lastName}`.trim();
    }
    // Case 2: Self-approved (approvedById matches employeeId)
    else if (item.approvedById && item.approvedById === item.employeeId) {
      approvedByName = `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim();
    }

    return {
      id: item.id,
      licenseNo: item.Employee.licenseNo || "N/A",
      name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
      leaveType: item.leaveType,
      startDate: format(new Date(item.startDate), "MMMM dd, yyyy"),
      endDate: format(new Date(item.endDate), "MMMM dd, yyyy"),
      status: item.status,
      approvedBy: approvedByName,
      attachment: item.attachment || "",
      reason: item.leaveReason,
      createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
    };
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Leave Management"
          description="Manage all the requested leave here. You can also approve or reject the leave request."
        />
        <Button size="sm">
          <Link href={`/head/leave-management/request`}>+ Request Leave</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <ApplicantClient data={formattedData} />
    </div>
  );
};

export default Page;
