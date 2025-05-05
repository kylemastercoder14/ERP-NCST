import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, SupplierColumn } from "./column";

const SupplierClient = ({ data }: { data: SupplierColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default SupplierClient;
