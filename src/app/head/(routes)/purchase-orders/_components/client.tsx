import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, PurchaseRequestColumn } from "./column";

const PurchaseRequestClientClient = ({
  data,
}: {
  data: PurchaseRequestColumn[];
}) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default PurchaseRequestClientClient;
