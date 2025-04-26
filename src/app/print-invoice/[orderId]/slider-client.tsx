"use client";

import React, { useState } from "react";
import PrintInvoiceClient from "./client";
import { PurchaseRequestItemWithProps } from "@/types";
import { Employee, PurchaseRequest } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PrintInvoiceClientProps extends PurchaseRequest {
  receivedEmployee: Employee | null;
  requestedBy: Employee | null;
  PurchaseRequestItem: PurchaseRequestItemWithProps[];
}

const SliderInvoices = ({ invoices }: { invoices: PrintInvoiceClientProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % invoices.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + invoices.length) % invoices.length);
  };

  return (
    <div className="relative py-5 px-10 w-full overflow-hidden">
      <div className="flex items-center justify-center gap-4">
        <button onClick={prev} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeft />
        </button>
        <div className="w-full">
          <PrintInvoiceClient data={invoices[currentIndex]} />
        </div>
        <button onClick={next} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SliderInvoices;
