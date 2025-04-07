import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, AttendanceColumn } from "./column";

const AttendanceClient = ({ data }: { data: AttendanceColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default AttendanceClient;
