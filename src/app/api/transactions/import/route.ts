/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { TransactionValidators } from "@/validators";

export async function POST(req: Request) {
  try {
    // Verify the request has a body
    if (!req.body) {
      throw new Error("No request body provided");
    }

    // Parse the request body
    let transactions;
    try {
      transactions = await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON payload");
    }

    if (!Array.isArray(transactions)) {
      throw new Error("Payload must be an array of transactions");
    }

    // Process all transactions in a single database transaction
    const result = await db.$transaction(async (tx) => {
      // Get the latest journal entry ID once for the entire batch
      const latestTransaction = await tx.transaction.findFirst({
        orderBy: { createdAt: "desc" },
        select: { journalEntryId: true },
      });

      let journalEntryCounter = latestTransaction?.journalEntryId
        ? parseInt(latestTransaction.journalEntryId.replace("JE", ""))
        : 0;

      const createdTransactions = [];

      for (const txData of transactions) {
        try {
          // Validate required fields
          if (!txData.name || !txData.amount || !txData.type) {
            throw new Error(
              `Missing required fields in transaction: ${JSON.stringify(txData)}`
            );
          }

          // Validate the transaction data
          const validationResult = TransactionValidators.safeParse({
            name: txData.name,
            amount: txData.amount,
            type: txData.type,
            accountType: txData.accountType || "EXPENSE", // Default if not provided
            subAccountType: txData.subAccountType || "GENERAL", // Default if not provided
            description: txData.description || "",
            supplierId: undefined,
            clientId: undefined,
            attachment: undefined,
          });

          if (!validationResult.success) {
            const errors = validationResult.error.errors.map(
              (err) => err.message
            );
            throw new Error(`Validation error: ${errors.join(", ")}`);
          }

          // Find client or supplier by name
          let clientId = null;
          let supplierId = null;

          if (txData.clientName) {
            const client = await tx.client.findFirst({
              where: { name: txData.clientName },
            });

            if (client) {
              clientId = client.id;
            } else {
              const supplier = await tx.supplier.findFirst({
                where: { name: txData.clientName },
              });
              if (supplier) {
                supplierId = supplier.id;
              }
            }
          }

          // Increment journal entry counter
          journalEntryCounter++;
          const newJournalEntryNumber = `JE${journalEntryCounter.toString().padStart(6, "0")}`;

          // Create the transaction
          const newTransaction = await tx.transaction.create({
            data: {
              name: txData.name,
              amount: txData.amount,
              type: txData.type,
              accountType: txData.accountType || "EXPENSE",
              subAccountType: txData.subAccountType || "GENERAL",
              description: txData.description || "",
              status: "Unpaid",
              journalEntryId: newJournalEntryNumber,
              clientId,
              supplierId,
              createdAt: txData.transactionDate
                ? new Date(txData.transactionDate)
                : new Date(),
            },
          });

          createdTransactions.push(newTransaction);
        } catch (error: any) {
          console.error(`Error processing transaction: ${error.message}`);
          // Continue with next transaction even if one fails
          continue;
        }
      }

      return createdTransactions;
    });

    return NextResponse.json({
      success: true,
      count: result.length,
      importedTransactions: result,
    });
  } catch (error: any) {
    console.error("Error in import route:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to import transactions",
        success: false,
      },
      { status: 500 }
    );
  }
}
