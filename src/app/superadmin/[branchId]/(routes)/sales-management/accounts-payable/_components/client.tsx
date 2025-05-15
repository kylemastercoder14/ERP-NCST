import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, AccountPayableColumn } from "./column";

const AccountPayableClientClient = ({
  data,
}: {
  data: AccountPayableColumn[];
}) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default AccountPayableClientClient;
