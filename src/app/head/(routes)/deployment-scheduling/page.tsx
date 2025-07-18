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
	  UserAccount: true,
	},
  });

  const departmentSession = user?.Employee?.Department.name;

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
		  email: item.UserAccount[0].email,
		  gender: item.sex,
		  civilStatus: item.civilStatus,
		  departmentSession: departmentSession || "",
		  branchId: item.branchId,
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
		  title="Deployment Scheduling"
		  description="Manage your deployment scheduling here."
		/>
	  </div>
	  <Separator className="my-5" />
	  <ApplicantClient data={formatData("Deployment")} />
	</div>
  );
};

export default Page;
