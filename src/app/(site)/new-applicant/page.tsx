import React from "react";

import db from "@/lib/db";
import Client from "./client";

const Page = async () => {
  // jobTitle Lists
  const jobTitles = await db.jobTitle.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // department Lists
  const departments = await db.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="px-10 py-5">
      <Client jobTitles={jobTitles} departments={departments} />
    </div>
  );
};

export default Page;
