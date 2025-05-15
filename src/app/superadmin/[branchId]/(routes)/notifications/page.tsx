import React from "react";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import Heading from "@/components/ui/heading";
import Client from "./client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const notifications = await db.accomplishmentReport.findMany({
    where: {
      Employee: {
        branch: user?.Employee.branch,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });
  const unreadNotifications = await db.accomplishmentReport.findMany({
    where: {
      isViewed: false,
      Employee: {
        branch: user?.Employee.branch,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });
  return (
    <div>
      <Heading
        title={`Notifications (${notifications.length})`}
        description="View all the accomplishment reports that you have received."
      />
      <Tabs defaultValue="all" className='mt-4'>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Client data={notifications} />
        </TabsContent>
        <TabsContent value="unread">
          <Client data={unreadNotifications} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
