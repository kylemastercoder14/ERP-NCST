import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, LedgerColumn } from "./column";

const LedgerClient = ({
  data,
}: {
  data: LedgerColumn[];
}) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default LedgerClient;
