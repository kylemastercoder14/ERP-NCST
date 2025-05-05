import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { WithdrawalColumn } from "./_components/column";
import { format } from "date-fns";
import WithdrawalClient from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.withdrawal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
      WithdrawalItem: {
        include: {
          Item: true,
        },
      },
    },
  });

  const department = user?.Employee?.Department.name;

  const formattedData: WithdrawalColumn[] =
    data.map((request) => {
      const itemNames = request.WithdrawalItem.map(
        (prItem) => `${prItem.Item.name} (x${prItem.quantity})`
      ).join(", ");

      return {
        id: request.id,
        licenseNo: request.Employee.licenseNo || "N/A",
        name: `${request.Employee.firstName} ${request.Employee.middleName || ""} ${request.Employee.lastName}`.trim(),
        itemName: itemNames,
        quantity: request.WithdrawalItem.reduce(
          (acc, prItem) => acc + prItem.quantity,
          0
        ),
        department: request.department,
        inventoryStatus: request.status,
        withdrawalCode: request.withdrawalCode,
        departmentSession: department || "",
        remarks: request.remarks || "No remarks added",
        createdAt: format(new Date(request.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Withdrawal Requests"
          description="Manage all the requested withdrawal here. Wait for the approval of your request."
        />
        <Button size="sm">
          <Link href={`/head/withdrawal-management/create`}>+ Create Withdrawal</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <WithdrawalClient data={formattedData} />
    </div>
  );
};

export default Page;
