import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, PayrollColumn } from "./column";

const PayrollClient = ({ data }: { data: PayrollColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default PayrollClient;
