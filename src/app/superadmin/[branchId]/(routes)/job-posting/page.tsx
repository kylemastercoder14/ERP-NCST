import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import db from "@/lib/db";
import JobPosting from "./_components/client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.jobPosting.findMany({
	orderBy: {
	  createdAt: "desc",
	},
	include: {
	  applicantList: true
	},
  });

  const department = user?.Employee?.Department.name;

  return (
	<div>
	  <div className="flex items-center justify-between">
		<Heading
		  title="List of Job Posting"
		  description="Manage all the job posting here. This is where you can view all the job posting."
		/>
		<Button size="sm">
		  <Link href={`/head/job-posting/create`}>+ Create new job post</Link>
		</Button>
	  </div>
	  <Separator className="my-5" />
	  <JobPosting data={data} department={department as string} />
	</div>
  );
};

export default Page;
