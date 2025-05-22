/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TransactionType, AccountType } from "@prisma/client";

const ImportFromExcel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];

    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      // Process each worksheet
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "", // Ensure empty cells are returned as empty strings
        }) as any[][];

        // Find the header row (assuming it's row 4, based on your export format)
        const headerRow = jsonData.find(
          (row) =>
            row[0] === "No" && row[1] === "Date" && row[2] === "Description"
        );

        if (!headerRow) {
          console.warn(`No header row found in sheet ${sheetName}`);
          continue;
        }

        const headerIndex = jsonData.indexOf(headerRow);
        const transactions = [];

        // Process data rows (skip header and any metadata rows)
        for (let i = headerIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          try {
            // Parse amount (remove currency symbol and commas)
            const debitAmount = String(row[3] || "0").replace(/[^\d.-]/g, "");
            const creditAmount = String(row[4] || "0").replace(/[^\d.-]/g, "");
            const amount = parseFloat(debitAmount || creditAmount);

            // Determine transaction type
            const type =
              parseFloat(debitAmount) > 0
                ? TransactionType.DEBIT
                : TransactionType.CREDIT;

            // Extract client/supplier name - assuming Description contains it
            const description = String(row[2] || "");
            const clientName = description
              .split(" - ")[0]
              .split(" for ")[0]
              .trim();

            transactions.push({
              name: description,
              amount,
              type,
              accountType: String(row[7] || "EXPENSE") as AccountType,
              subAccountType: String(row[8] || "GENERAL"),
              description: description,
              transactionDate: row[1]
                ? new Date(String(row[1])).toISOString()
                : new Date().toISOString(),
              clientName: clientName,
            });
          } catch (error) {
            console.error(`Error processing row ${i}:`, error);
            continue;
          }
        }

        // Send data to API endpoint
        if (transactions.length > 0) {
          try {
            const response = await fetch("/api/transactions/import", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(transactions),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "Failed to import transactions");
            }

            toast.success(
              `Successfully imported ${result.count} transactions from ${sheetName}`
            );
          } catch (error: any) {
            toast.error(`Failed to import from ${sheetName}: ${error.message}`);
            continue;
          }
        }
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error importing Excel file:", error);
      toast.error(
        error.message ||
          "Failed to import transactions. Please check the file format."
      );
    } finally {
      setIsLoading(false);
      // Reset file input
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        id="excel-upload"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isLoading}
      />
      <Button variant="secondary" size="sm" asChild disabled={isLoading}>
        <label htmlFor="excel-upload" className="cursor-pointer">
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <FileDown className="size-4 mr-2" />
              Import from Excel
            </>
          )}
        </label>
      </Button>
    </div>
  );
};

export default ImportFromExcel;
