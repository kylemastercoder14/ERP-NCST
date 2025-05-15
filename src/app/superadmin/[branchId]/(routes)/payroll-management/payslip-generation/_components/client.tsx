import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, PayslipGenerationColumn } from "./column";

const PayslipGenerationClient = ({ data }: { data: PayslipGenerationColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default PayslipGenerationClient;
