import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, AccomplishmentReportColumn } from "./column";

const AccomplishmentReportClient = ({ data }: { data: AccomplishmentReportColumn[] }) => {
  return (
    <div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default AccomplishmentReportClient;
