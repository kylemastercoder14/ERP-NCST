import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, ItemColumn } from "./column";

const ItemClient = ({ data }: { data: ItemColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default ItemClient;
