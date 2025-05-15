"use client";

import { Employee, PurchaseRequest } from "@prisma/client";
import React from "react";
import { PurchaseRequestItemWithProps } from "@/types";
import Image from "next/image";
import { Printer } from "lucide-react";

interface PrintInvoiceClientProps extends PurchaseRequest {
  receivedEmployee: Employee | null;
  requestedBy: Employee | null;
  PurchaseRequestItem: PurchaseRequestItemWithProps[];
}

const PrintInvoiceClient = ({ data }: { data: PrintInvoiceClientProps }) => {
  // Find the first item with valid Item + Supplier data
  const supplierInfo = data.PurchaseRequestItem.find(
    (item) => item.Item && item.Item.Supplier
  );

  // Generate invoice number based on purchase request ID
  // Format: PR-YYYY-XXXXX (where XXXXX is padded with leading zeros)
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const id = data.id;

    // Extract numeric part if ID is a string, otherwise use the ID directly
    const numericId =
      typeof id === "string" ? id.match(/\d+/g)?.join("") || id : id;

    // Pad with zeros to ensure at least 5 digits
    const paddedId = String(numericId).padStart(5, "0");

    return `INV-${year}-${paddedId}`;
  };

  const invoiceNumber = generateInvoiceNumber();

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Get the current invoice content
    const invoiceContent =
      document.getElementById("invoice-content")?.innerHTML;

    // Write to the new window and print
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceNumber} - ${supplierInfo?.Item?.Supplier?.name || "Invoice"}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: black; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .invoice-header { display: flex; justify-content: space-between; }
            .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${invoiceContent || ""}
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="px-4 md:px-10 lg:px-20 py-6 relative">
      <div className="absolute top-4 left-4 bg-red-300 text-black px-4 py-2 rounded-md font-bold shadow-lg print:hidden">
        PREVIEW ONLY
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Printer size={18} />
          Print Invoice
        </button>
      </div>

      <div id="invoice-content" className="mt-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-gray-600">Purchase Order #{data.id}</p>
        </div>

        <div className="grid lg:grid-cols-10 grid-cols-1 gap-10">
          <div className="lg:col-span-4 space-y-5">
            <div className="mb-4">
              <strong className="block text-gray-700 mb-1">BILL TO:</strong>
              <p>{supplierInfo?.Item?.Supplier?.name || "N/A"}</p>
              <p>{supplierInfo?.Item?.Supplier?.address || "N/A"}</p>
              <p>{supplierInfo?.Item?.Supplier?.contactNo || "N/A"}</p>
              <p>{supplierInfo?.Item?.Supplier?.email || "N/A"}</p>
            </div>
            <div>
              <strong className="block text-gray-700 mb-1">SHIPPING TO:</strong>
              <p>BAT Security Services Inc.</p>
              <p>
                Roofdeck MBT Bldg. The Promenade, Salawag , Dasmariñas,
                Philippines
              </p>
              <p>+46 42 442 34</p>
              <p>batsecservicesinc@gmail.com</p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="font-medium p-3 border border-gray-300 bg-gray-50">
                    Invoice #
                  </td>
                  <td className="p-3 border border-gray-300">
                    {invoiceNumber}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 border border-gray-300 bg-gray-50">
                    Invoice Date
                  </td>
                  <td className="p-3 border border-gray-300">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 border border-gray-300 bg-gray-50">
                    Name of Rep.
                  </td>
                  <td className="p-3 border border-gray-300">
                    {supplierInfo?.Item?.Supplier?.name || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 border border-gray-300 bg-gray-50">
                    Contact Phone
                  </td>
                  <td className="p-3 border border-gray-300">
                    {supplierInfo?.Item?.Supplier?.contactNo || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-6 text-xl font-semibold text-right">
              Amount Due: ₱
              {data.PurchaseRequestItem.reduce(
                (sum, item) =>
                  item.Item ? sum + item.quantity * item.Item.unitPrice : sum,
                0
              ).toFixed(2)}
            </p>
          </div>
        </div>

        <table className="mt-8 w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border border-gray-300 text-left">No.</th>
              <th className="p-3 border border-gray-300 text-left">
                Item Name
              </th>
              <th className="p-3 border border-gray-300 text-left">Quantity</th>
              <th className="p-3 border border-gray-300 text-left">
                Unit Price
              </th>
              <th className="p-3 border border-gray-300 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {data.PurchaseRequestItem.map((item, index) => (
              <tr key={item.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="p-3 border border-gray-300">{index + 1}</td>
                <td className="p-3 border border-gray-300">
                  {item.Item?.name || "N/A"}
                </td>
                <td className="p-3 border border-gray-300">{item.quantity}</td>
                <td className="p-3 border border-gray-300">
                  ₱{item.Item ? item.Item.unitPrice.toFixed(2) : "0.00"}
                </td>
                <td className="p-3 border border-gray-300">
                  ₱
                  {item.Item
                    ? (item.Item.unitPrice * item.quantity).toFixed(2)
                    : "0.00"}
                </td>
              </tr>
            ))}
            <tr className="font-semibold bg-gray-100">
              <td colSpan={4} className="p-3 border border-gray-300 text-right">
                Total
              </td>
              <td className="p-3 border border-gray-300">
                ₱
                {data.PurchaseRequestItem.reduce(
                  (sum, item) =>
                    item.Item ? sum + item.quantity * item.Item.unitPrice : sum,
                  0
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-10">
          <div>
            <p className="font-medium">Received By: </p>
            <p className="mt-1">
              {data.receivedEmployee?.firstName}{" "}
              {data.receivedEmployee?.lastName}
            </p>
            {data.receivedEmployee?.signature && (
              <div className="mt-2">
                <Image
                  alt="Signature"
                  src={data.receivedEmployee.signature}
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoiceClient;
