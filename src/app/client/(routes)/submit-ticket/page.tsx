import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { Column } from "./_components/column";
import { format } from "date-fns";
import Client from "./_components/client";
import { useClient } from "@/hooks/use-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useClient();
  const data = await db.ticket.findMany({
    where: {
      clientId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      employee: {
        include: {
          JobTitle: true,
          UserAccount: true,
        },
      },
      client: true,
    },
  });

  const formattedData: Column[] =
    data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        priority: item.priority,
        ticketStatus: item.status,
        type: item.type,
        attachments: item.attachments,
        description: item.description,
        ...(item.employee && {
          employee: {
            name: `${item.employee.firstName} ${item.employee.lastName}`,
            position: item.employee?.JobTitle?.name,
            email: item.employee?.UserAccount[0]?.email,
          },
        }),
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Tickets"
          description="Manage all the submitted tickets here."
        />
        <Button size="sm">
          <Link href={`/client/submit-ticket/create`}>+ Submit a ticket</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <Client data={formattedData} />
    </div>
  );
};

export default Page;
