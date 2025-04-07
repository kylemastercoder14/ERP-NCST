import React from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import { GovernmentMandatoriesColumn } from "./_components/column";
import { format } from "date-fns";
import GovernmentMandatoriesClient from "./_components/client";

const Page = async () => {
  const data = await db.governmentMandatories.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Employee: {
        include: {
          Department: true,
          JobTitle: true,
        },
      },
    },
  });

  const formattedData: GovernmentMandatoriesColumn[] =
    data.map((item) => {
      return {
        id: item.id,
        licenseNo: item.Employee.licenseNo,
        name: `${item.Employee.firstName} ${item.Employee.middleName || ""} ${item.Employee.lastName}`.trim(),
        sss: `₱${item.sss.toFixed(2)}`,
        philhealth: `₱${item.philhealth.toFixed(2)}`,
        tin: `₱${item.tin.toFixed(2)}`,
        pagibig: `₱${item.pagibig.toFixed(2)}`,
        others: `₱${item.sss.toFixed(2)}` || "N/A",
        department: item.Employee.Department.name,
        position: item.Employee.JobTitle.name,
        createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Government Mandatories Benefits"
          description="Manage all the government mandatories benefits here. This will help the system in deducting the correct amount of government mandatories benefits from the employee's salary."
        />
      </div>
      <Separator className="my-5" />
      <GovernmentMandatoriesClient data={formattedData} />
    </div>
  );
};

export default Page;
