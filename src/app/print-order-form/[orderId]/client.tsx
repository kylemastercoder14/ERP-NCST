"use client";

import { Employee, PurchaseRequest } from "@prisma/client";
import React from "react";
import { PurchaseRequestItemWithProps } from "@/types";
import { Printer } from "lucide-react";

interface PrintOrderFormClientProps extends PurchaseRequest {
  receivedEmployee: Employee | null;
  requestedBy: Employee | null;
  PurchaseRequestItem: PurchaseRequestItemWithProps[];
}

const PrintOrderFormClient = ({
  data,
}: {
  data: PrintOrderFormClientProps;
}) => {
  // Collect all unique vendor names
  const vendorNames = data.PurchaseRequestItem.filter(
    (item) => item.Item && item.Item.Supplier
  )
    .map((item) => item.Item?.Supplier?.name)
    .filter((name): name is string => !!name) // Filter out undefined/null
    .filter((name, index, self) => self.indexOf(name) === index); // Get unique values

  // Join vendor names with commas
  const vendorString = vendorNames.join(", ");

  const today = new Date().toLocaleDateString();

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Get the current order form content
    const orderContent = document.getElementById("order-content")?.innerHTML;

    // Write to the new window and print
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Form</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; color: black; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .order-form-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #000;
              padding: 20px;
            }
            .form-header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              position: relative;
            }
            .date-field {
              position: absolute;
              right: 0;
              top: 0;
            }
            .vendor-ship-section {
              margin: 20px 0;
            }
			.vendor-header {
				display: flex;
				flex-direction: column;
				gap: 5px;
			}

            .inline-field {
              display: flex;
              align-items: center;
              margin-bottom: 5px;
            }
            .inline-field label {
              font-weight: bold;
              margin-right: 10px;
            }
            .total-amount {
              text-align: right;
              font-weight: bold;
              font-size: 1.25rem;
              margin-top: 1rem;
              margin-left: auto;
              width: 200px;
            }
            .preview-watermark {
              display: none;
            }
            @media print {
              button { display: none; }
              .preview-label { display: none; }
            }
          </style>
        </head>
        <body>
          ${orderContent || ""}
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Calculate total
  const total = data.PurchaseRequestItem.reduce(
    (sum, item) =>
      item.Item ? sum + item.quantity * item.Item.unitPrice : sum,
    0
  );

  return (
    <div className="px-4 md:px-10 lg:px-20 py-6 relative">
      {/* Preview Only Label */}
      <div className="absolute top-4 left-4 bg-red-300 text-black px-4 py-2 rounded-md font-bold shadow-lg print:hidden">
        PREVIEW ONLY
      </div>

      {/* Print Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors print:hidden"
        >
          <Printer size={18} />
          Print Order Form
        </button>
      </div>

      <div id="order-content" className="mt-16 bg-white">
        <div className="max-w-4xl mx-auto border border-gray-800 p-6 shadow-lg">
          <div className="relative text-center border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold">
              Order Form #: {data.purchaseCode}
            </h2>
            <div className="absolute right-0 top-0">
              <p>Date: {today}</p>
            </div>
          </div>

          <div className="flex vendor-header justify-between mt-6 space-x-8">
            <div className="w-1/2">
              <div className="flex items-start">
                <label className="font-bold mr-2">Vendor/s:</label>
                <span>{vendorString || "N/A"}</span>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex items-start">
                <label className="font-bold mr-2">Ship To:</label>
                <span>BAT Security Services Inc.</span>
              </div>
            </div>
          </div>

          <table className="w-full vendor-ship-section mt-6 border border-gray-800">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-800 p-2">Shipping Method</th>
                <th className="border border-gray-800 p-2">Shipping Terms</th>
                <th className="border border-gray-800 p-2">Requestor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2">Standard</td>
                <td className="border border-gray-800 p-2">FOB Destination</td>
                <td className="border border-gray-800 p-2">
                  {data.requestedBy?.firstName} {data.requestedBy?.lastName}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border border-gray-800 mt-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-800 p-2">Qty</th>
                <th className="border border-gray-800 p-2">Item #</th>
                <th className="border border-gray-800 p-2">Name</th>
                <th className="border border-gray-800 p-2">Vendor</th>
                <th className="border border-gray-800 p-2">Unit Price</th>
                <th className="border border-gray-800 p-2">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {data.PurchaseRequestItem.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-800 p-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {item.Item?.id || "N/A"}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {item.Item?.name || "N/A"}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {item.Item?.Supplier?.name || "N/A"}
                  </td>
                  <td className="border border-gray-800 p-2">
                    ₱{item.Item ? item.Item.unitPrice.toFixed(2) : "0.00"}
                  </td>
                  <td className="border border-gray-800 p-2">
                    ₱
                    {item.Item
                      ? (item.Item.unitPrice * item.quantity).toFixed(2)
                      : "0.00"}
                  </td>
                </tr>
              ))}

              {/* Add empty rows to match the template */}
              {[
                ...Array(Math.max(0, 10 - data.PurchaseRequestItem.length)),
              ].map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border border-gray-800 p-2">&nbsp;</td>
                  <td className="border border-gray-800 p-2"></td>
                  <td className="border border-gray-800 p-2"></td>
                  <td className="border border-gray-800 p-2"></td>
                  <td className="border border-gray-800 p-2"></td>
                  <td className="border border-gray-800 p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Only show total amount */}
          <div className="flex total-amount justify-end mt-6">
            <div className="w-48 text-right">
              <div className="flex items-center justify-end space-x-4 text-xl font-bold">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintOrderFormClient;
