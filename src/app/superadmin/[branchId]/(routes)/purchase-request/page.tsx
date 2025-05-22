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

const Page = async (props: {
  params: Promise<{
    branchId: string;
  }>;
}) => {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.purchaseRequest.findMany({
    where: {
      PurchaseRequestItem: {
        every: {
          Item: {
            Supplier: {
              branchId: params.branchId,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      receivedEmployee: true,
      requestedBy: true,
      PurchaseRequestItem: {
        include: {
          Item: true,
        },
      },
    },
  });

  const department = user?.Employee?.Department.name;

  const formattedData: PurchaseRequestColumn[] =
    data.map((request) => {
      const itemNames = request.PurchaseRequestItem.map(
        (prItem) => `${prItem.Item.name} (x${prItem.quantity})`
      ).join(", ");
      const totalAmount = request.PurchaseRequestItem.reduce(
        (acc, prItem) => acc + prItem.totalAmount,
        0
      );

      return {
        id: request.id,
        licenseNo: request.requestedBy.licenseNo || "N/A",
        name: `${request.requestedBy.firstName} ${request.requestedBy.middleName || ""} ${request.requestedBy.lastName}`.trim(),
        itemName: itemNames,
        quantity: request.PurchaseRequestItem.reduce(
          (acc, prItem) => acc + prItem.quantity,
          0
        ),
        totalAmount: `₱${totalAmount.toFixed(2).toLocaleString()}`, // showing the total amount as unit price
        department: request.department,
        financeStatus: request.financeStatus,
        purchaseCode: request.purchaseCode,
        departmentSession: department || "",
        isEdited: request.isEdited,
        remarks: request.financeRemark || "No remarks",
        createdAt: format(new Date(request.createdAt), "MMMM dd, yyyy"),
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
          <Link href={`/superadmin/${params.branchId}/purchase-request/create`}>+ Request Purchase</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <PurchaseRequestClient data={formattedData} />
    </div>
  );
};

export default Page;
