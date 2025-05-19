import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ApplicantColumn } from "./_components/column";
import { format } from "date-fns";
import ApplicantClient from "./_components/client";
import { useClient } from "@/hooks/use-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useClient();

  // Fetch active employees (signed contracts)
  const activeEmployees = await db.employee.findMany({
    where: {
      clientId: user?.id,
      isSignedContract: true,
      signedContract: { not: null },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      JobTitle: true,
      Department: true,
      UserAccount: true,
    },
  });

  // Fetch pending employees (unsigned contracts)
  const pendingEmployees = await db.employee.findMany({
    where: {
      clientId: user?.id,
      OR: [{ isSignedContract: false }, { signedContract: null }],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      JobTitle: true,
      Department: true,
      UserAccount: true,
    },
  });

  // Format data function to avoid duplication
  const formatEmployeeData = (employees: typeof activeEmployees) => {
    return employees.map((item) => ({
      id: item.id,
      licenseNo: item.licenseNo || "N/A",
      name: `${item.firstName} ${item.middleName} ${item.lastName}`,
      phoneNumber: item.celNo,
      address: item.presentAddress,
      positionDesired: item.JobTitle?.name || "N/A",
      department: item.Department?.name || "N/A",
      gender: item.sex,
      civilStatus: item.civilStatus,
      email: item.UserAccount[0]?.email || "N/A",
      createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      status: item.isSignedContract ? "Active" : "Pending",
    }));
  };

  const activeFormattedData: ApplicantColumn[] =
    formatEmployeeData(activeEmployees);
  const pendingFormattedData: ApplicantColumn[] =
    formatEmployeeData(pendingEmployees);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Employee Management"
          description="Manage all the employees information here."
        />
      </div>
      <Separator className="my-5" />
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Employees</TabsTrigger>
          <TabsTrigger value="active">Active Employees</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="bg-yellow-300/20 border border-yellow-400 w-full rounded-md px-2 py-1 text-center mb-3 text-sm text-yellow-800">
            <strong className="">Note:</strong> Pending employees are
            individuals who have not yet signed their contracts. If an employee
            fails to sign the contract, their application will be voided and
            they will be removed from this list.
          </div>
          <ApplicantClient data={pendingFormattedData} />
        </TabsContent>
        <TabsContent value="active">
          <div className="bg-green-300/20 border border-green-400 w-full rounded-md px-2 py-1 text-center mb-3 text-sm text-green-800">
            <strong className="">Note:</strong> Active employees are individuals who have completed and signed their employment contracts.
          </div>
          <ApplicantClient data={activeFormattedData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
