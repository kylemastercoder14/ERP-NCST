import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, ApplicantColumn } from "./column";

const ApplicantClient = ({ data }: { data: ApplicantColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default ApplicantClient;
