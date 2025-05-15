import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { ApplicantColumn } from "./_components/column";
import { format } from "date-fns";
import ApplicantClient from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.accomplishmentReport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  const departmentSession = user?.Employee?.Department.name;

  const formatData: ApplicantColumn[] =
    data.map((item) => ({
      id: item.id,
      licenseNo: item.Employee.licenseNo || "N/A",
      name: `${item.Employee.firstName} ${item.Employee.middleName} ${item.Employee.lastName}`,
      report: item.report,
      images: item.images,
      remarks: item.remarks || "No remarks added",
      departmentSession: departmentSession || "",
      createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      updatedAt: format(
        new Date(item.updatedAt),
        "MMMM dd, yyyy 'at' hh:mm:ss a"
      ),
    })) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Shift Monitoring"
          description="Manage your shift monitoring reports here."
        />
      </div>
      <Separator className="my-5" />
      <ApplicantClient data={formatData} />
    </div>
  );
};

export default Page;
