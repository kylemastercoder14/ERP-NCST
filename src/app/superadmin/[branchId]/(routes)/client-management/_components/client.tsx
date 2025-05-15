import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, ClientColumn } from "./column";

const CompanyClient = ({ data }: { data: ClientColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default CompanyClient;
