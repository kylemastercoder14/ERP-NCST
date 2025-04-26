import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { PurchaseRequestColumn } from "./_components/column";
import { format } from "date-fns";
import PurchaseRequestClient from "./_components/client";
import { useSupplier } from "@/hooks/use-supplier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userType } = await useSupplier();
  const data = await db.purchaseRequest.findMany({
    where: {
      financeStatus: "Approved",
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

  const department = userType;

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
        licenseNo: request.requestedBy.licenseNo,
        name: `${request.requestedBy.firstName} ${request.requestedBy.middleName || ""} ${request.requestedBy.lastName}`.trim(),
        itemName: itemNames,
        quantity: request.PurchaseRequestItem.reduce(
          (acc, prItem) => acc + prItem.quantity,
          0
        ),
        totalAmount: `₱${totalAmount.toFixed(2).toLocaleString()}`,
        department: request.department,
        financeStatus: request.financeStatus,
        supplierStatus: request.supplierStatus,
        purchaseCode: request.purchaseCode,
        departmentSession: department || "",
        inventoryStatus: request.inventoryStatus,
        createdAt: format(new Date(request.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  const getDataByStatus = (status: string) => {
    return formattedData.filter((item) => item.supplierStatus === status);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="List of Purchase Request"
          description="Manage all the requested purchase here. Wait for the approval of your request."
        />
      </div>
      <Separator className="my-5" />
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="in-transit">In transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <PurchaseRequestClient data={getDataByStatus("Pending")} />
        </TabsContent>
        <TabsContent value="preparing">
          <PurchaseRequestClient data={getDataByStatus("Preparing")} />
        </TabsContent>
        <TabsContent value="in-transit">
          <PurchaseRequestClient data={getDataByStatus("In transit")} />
        </TabsContent>
        <TabsContent value="delivered">
          <PurchaseRequestClient data={getDataByStatus("Delivered")} />
        </TabsContent>
        <TabsContent value="received">
          <PurchaseRequestClient data={getDataByStatus("Received")} />
        </TabsContent>
        <TabsContent value="rejected">
          <PurchaseRequestClient data={getDataByStatus("Rejected")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
