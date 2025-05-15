"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheetIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LedgerColumn } from "./column";

const ExportToExcel = ({ data }: { data: LedgerColumn[] }) => {
  const handleExport = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/T/, "_").replace(/\..+/, "").replace(/:/g, "-");

    const workbook = XLSX.utils.book_new();

    // Group data by month
    const months: { [key: string]: LedgerColumn[] } = {};

    data.forEach((item) => {
      const date = new Date(item.transactionDate);
      const monthName = date.toLocaleString('default', { month: 'long' }); // January, February, etc.
      if (!months[monthName]) {
        months[monthName] = [];
      }
      months[monthName].push(item);
    });

    // Create a sheet for each month
    Object.keys(months).forEach((monthName) => {
      const monthData = months[monthName];

      const headerRows = [
        ["BAT Security Services INC."],
        ["Financial Ledger"],
        [`Period Covered: ${monthName}`],
        [],
        [
          "No",
          "Date",
          "Description",
          "Debit",
          "Credit",
          "Balance",
          "Journal Reference",
          "Account Code",
          "Sub Account Code",
        ],
      ];

      const bodyRows = monthData.map((item, index) => [
        index + 1,
        item.transactionDate,
        item.account,
        item.debit,
        item.credit,
        item.balance,
        item.journalEntry,
        item.accountType,
        item.subAccountType,
      ]);

      const allRows = [...headerRows, ...bodyRows];

      const worksheet = XLSX.utils.aoa_to_sheet(allRows);

      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 12 },
        { wch: 30 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, monthName);
    });

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const fileName = `Financial_Ledger_${formattedDate}.xlsx`;
    saveAs(dataBlob, fileName);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileSpreadsheetIcon className="size-4" />
      Export to Excel
    </Button>
  );
};

export default ExportToExcel;
