import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ApplicantColumn } from "./_components/column";
import { format } from "date-fns";
import ApplicantClient from "./_components/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.employee.findMany({
    where: {
      isNewEmployee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      JobTitle: true,
      Department: true,
    },
  });

  const departmentSession = user?.Employee?.Department.name;
  const assessor = user?.Employee.firstName + " " + user?.Employee.lastName;

  const formatData = (status: string): ApplicantColumn[] => {
    return (
      data
        .filter((item) => item.trainingStatus === status)
        .map((item) => ({
          id: item.id,
          licenseNo: item.licenseNo || "N/A",
          trainingStatus: item.trainingStatus || "",
          name: `${item.firstName} ${item.middleName} ${item.lastName}`,
          phoneNumber: item.celNo,
          address: item.presentAddress,
          positionDesired: item.JobTitle.name,
          gender: item.sex,
          civilStatus: item.civilStatus,
          departmentSession: departmentSession || "",
          branch: item.branch,
          assessor: assessor,
          createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
          updatedAt: format(
            new Date(item.updatedAt),
            "MMMM dd, yyyy 'at' hh:mm:ss a"
          ),
        })) || []
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Onboarding & Training"
          description="Manage your onboarding and training process. You can check the status of your new employees and their training progress."
        />
      </div>
      <Separator className="my-5" />
      <Tabs defaultValue={`${departmentSession === "Human Resource" ? "initial" : "orientation"}`}>
        <TabsList>
          {departmentSession === "Human Resource" ? (
            <>
              <TabsTrigger value="initial">Initial Interview</TabsTrigger>
              <TabsTrigger value="final">Final Interview</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="orientation">Orientation</TabsTrigger>
              <TabsTrigger value="physical-training">
                Physical Training
              </TabsTrigger>
              <TabsTrigger value="customer-service-training">
                Customer Service Training
              </TabsTrigger>
            </>
          )}
        </TabsList>
        {departmentSession === "Human Resource" ? (
          <>
            <TabsContent value="initial">
              <ApplicantClient data={formatData("Initial Interview")} />
            </TabsContent>
            <TabsContent value="final">
              <ApplicantClient data={formatData("Final Interview")} />
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="orientation">
              <ApplicantClient data={formatData("Orientation")} />
            </TabsContent>
            <TabsContent value="physical-training">
              <ApplicantClient data={formatData("Physical Training")} />
            </TabsContent>
            <TabsContent value="mental-training">
              <ApplicantClient data={formatData("Mental Training")} />
            </TabsContent>
            <TabsContent value="customer-service-training">
              <ApplicantClient data={formatData("Customer Service Training")} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Page;
