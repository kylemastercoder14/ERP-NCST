import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, Column } from "./column";

const Client = ({ data }: { data: Column[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default Client;
