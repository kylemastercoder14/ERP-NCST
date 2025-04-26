import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { AccomplishmentReportColumn } from "./_components/column";
import { format } from "date-fns";
import AccomplishmentReportClient from "./_components/client";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();

  const user = await db.userAccount.findUnique({
    where: { id: userId },
    select: { employeeId: true },
  });

  if (!user?.employeeId) {
    console.log("⚠️ No employeeId found for this user");
    return;
  }

  const data = await db.accomplishmentReport.findMany({
    where: {
      employeeId: user.employeeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const formattedData: AccomplishmentReportColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        title: item.report,
        images: item.images,
        remarks: item.remarks || "No remarks",
        date: format(new Date(item.date), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Accomplishment Report"
          description="Monitor all your accomplishment report here."
        />
        <Button size="sm">
          <Link href={`/employee/accomplishment-report/create`}>
            + Add Report
          </Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <AccomplishmentReportClient data={formattedData} />
    </div>
  );
};

export default Page;
