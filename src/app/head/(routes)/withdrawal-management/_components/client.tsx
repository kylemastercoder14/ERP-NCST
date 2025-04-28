import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, WithdrawalColumn } from "./column";

const WithdrawalClient = ({
  data,
}: {
  data: WithdrawalColumn[];
}) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default WithdrawalClient;
