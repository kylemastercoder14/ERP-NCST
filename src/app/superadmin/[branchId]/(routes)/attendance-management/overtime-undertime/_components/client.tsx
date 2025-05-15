import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, ExtraShiftColumn } from "./column";

const ExtraShiftClient = ({ data }: { data: ExtraShiftColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default ExtraShiftClient;
