import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, GovernmentMandatoriesColumn } from "./column";

const GovernmentMandatoriesClient = ({ data }: { data: GovernmentMandatoriesColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default GovernmentMandatoriesClient;
