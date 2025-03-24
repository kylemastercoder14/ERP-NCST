import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, DepartmentColumn } from "./column";

const DepartmentClient = ({ data }: { data: DepartmentColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default DepartmentClient;
