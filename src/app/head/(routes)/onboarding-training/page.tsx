import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ApplicantColumn } from "./_components/column";
import { format } from "date-fns";
import ApplicantClient from "./_components/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
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

  const formatData = (status: string): ApplicantColumn[] => {
    return (
      data
        .filter((item) => item.trainingStatus === status)
        .map((item) => ({
          id: item.id,
          licenseNo: item.licenseNo,
          trainingStatus: item.trainingStatus || "",
          name: `${item.firstName} ${item.middleName} ${item.lastName}`,
          phoneNumber: item.celNo,
          address: item.presentAddress,
          positionDesired: item.JobTitle.name,
          gender: item.sex,
          civilStatus: item.civilStatus,
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
      <Tabs defaultValue="initial">
        <TabsList>
          <TabsTrigger value="initial">Initial Interview</TabsTrigger>
          <TabsTrigger value="orientation">Orientation/Seminar</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>
        <TabsContent value="initial">
          <ApplicantClient data={formatData("Initial Interview")} />
        </TabsContent>
        <TabsContent value="orientation">
          <ApplicantClient data={formatData("Orientation")} />
        </TabsContent>
        <TabsContent value="training">
          <ApplicantClient data={formatData("Training")} />
        </TabsContent>
        <TabsContent value="deployment">
          <ApplicantClient data={formatData("Deployment")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
