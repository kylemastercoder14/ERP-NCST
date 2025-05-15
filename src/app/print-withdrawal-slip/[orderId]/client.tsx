"use client";

import React from "react";
import { Printer } from "lucide-react";
import { WithdrawalWithProps } from "@/types";

const WithdrawalSlipClient = ({ data }: { data: WithdrawalWithProps }) => {
  // Format date in a readable format
  const formattedDate = new Date(data.createdAt).toLocaleDateString();

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Get the current withdrawal slip content
    const slipContent =
      document.getElementById("withdrawal-content")?.innerHTML;

    // Write to the new window and print
    printWindow.document.write(`
      <html>
        <head>
          <title>Withdrawal Slip</title>
          <style>
		  @page {
            size: A5 landscape; /* A5 size, landscape orientation */
            margin: 10mm;
          }
            body { font-family: Arial, sans-serif; padding: 10px; color: black; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .withdrawal-slip-container {
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
            .info-section {
              margin: 20px 0;
            }
            .info-item {
              margin-bottom: 5px;
            }
            .info-item label {
              font-weight: bold;
              margin-right: 10px;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
              padding-top: 20px;
            }
            .signature-box {
              width: 30%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 30px;
              padding-top: 5px;
            }
            @media print {
              button { display: none; }
              .preview-label { display: none; }
            }
          </style>
        </head>
        <body>
          ${slipContent || ""}
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
          Print Withdrawal Slip
        </button>
      </div>

      <div id="withdrawal-content" className="mt-16 bg-white">
        <div className="max-w-4xl mx-auto border border-gray-800 p-6 shadow-lg">
          <div className="relative text-center border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold">
              Withdrawal Slip #{data.withdrawalCode}
            </h2>
          </div>

          <div className="info-section mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="info-item space-x-1">
                <label className="font-bold">Department:</label>
                <span>{data.department}</span>
              </div>
              <div className="info-item space-x-1">
                <label className="font-bold">Requestor:</label>
                <span>
                  {data.Employee
                    ? `${data.Employee.firstName} ${data.Employee.lastName}`
                    : "N/A"}
                </span>
              </div>
              <div className="info-item space-x-1">
                <label className="font-bold">Date:</label>
                <span>{formattedDate}</span>
              </div>
              <div className="info-item space-x-1">
                <label className="font-bold">Status:</label>
                <span>{data.status}</span>
              </div>
            </div>
          </div>

          <table className="w-full border border-gray-800 mt-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-800 p-2">Item #</th>
                <th className="border border-gray-800 p-2">Name</th>
                <th className="border border-gray-800 p-2">Supplier</th>
                <th className="border border-gray-800 p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.WithdrawalItem.map((item) => (
                <tr key={item.id}>
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
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSlipClient;
