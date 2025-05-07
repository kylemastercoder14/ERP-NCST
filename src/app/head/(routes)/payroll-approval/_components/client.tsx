import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, BaseSalaryColumn } from "./column";

const BaseSalaryClient = ({ data }: { data: BaseSalaryColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default BaseSalaryClient;
