import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { PurchaseRequestColumn } from "./_components/column";
import { format } from "date-fns";
import PurchaseRequestClient from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();

  const employee = await db.employee.findFirst({
    where: {
      id: user?.employeeId,
    },
    include: {
      Department: true,
    },
  });
  const data = await db.purchaseRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
      ReceivedBy: {
        include: {
          Employee: true,
        },
      },
    },
  });

  const formattedData: PurchaseRequestColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.Employee.licenseNo,
        name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
        itemName: item.item,
        quantity: item.quantity,
        unitPrice: `₱${item.unitPrice.toFixed(2).toLocaleString()}`,
        department: item.department,
        procurementStatus: item.procurementStatus,
        financeStatus: item.financeStatus,
        departmentSession: employee?.Department.name || "",
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Purchase Request"
          description="Manage all the requested purchase here. Wait for the approval of your request."
        />
        <Button size="sm">
          <Link href={`/reporting-manager/purchase-requested/create`}>
            + Request Purchase
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <PurchaseRequestClient data={formattedData} />
    </div>
  );
};

export default Page;
