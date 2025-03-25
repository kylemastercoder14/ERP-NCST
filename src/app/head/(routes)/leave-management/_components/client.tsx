import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, LeaveManagementColumn } from "./column";

const LeaveManagementClient = ({ data }: { data: LeaveManagementColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default LeaveManagementClient;
