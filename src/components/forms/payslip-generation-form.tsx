"use client";

import React from "react";
import { PayslipGenerationWithProps } from "@/types";

const PayslipGenerationForm = ({
  initialData,
}: {
  initialData: PayslipGenerationWithProps | null;
}) => {
  return <div>{initialData?.licenseNo}</div>;
};

export default PayslipGenerationForm;
