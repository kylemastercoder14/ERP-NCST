import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, JobTitleColumn } from "./column";

const JobTitleClient = ({ data }: { data: JobTitleColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default JobTitleClient;
