import React from "react";
import { useUser } from "@/hooks/use-user";
import db from "@/lib/db";
import HRDashboard from "./_components/hr-dashboard";
import FinanceDashboard from "./_components/finance-dashboard";
import OperationDashboard from "./_components/operation-dashboard";
import ProcurementDashboard from "./_components/procurement-dashboard";
import InventoryDashboard from "./_components/inventory-dashboard";
import CRMDashboard from "./_components/crm-dashboard";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const department = await db.department.findFirst({
    where: {
      id: user?.Employee.departmentId,
    },
  });

  if (department?.name === "Human Resource") {
    return <HRDashboard />;
  } else if (department?.name === "Finance") {
    return <FinanceDashboard />;
  } else if (department?.name === "Operation") {
    return <OperationDashboard />;
  } else if (department?.name === "Procurement") {
    return <ProcurementDashboard />;
  } else if (department?.name === "Inventory") {
    return <InventoryDashboard />;
  } else if (department?.name === "Customer Relationship") {
    return <CRMDashboard />;
  } else {
    return (
      <div className="flex flex-1 items-center justify-center">
        No Dashboard Available
      </div>
    );
  }
};

export default Page;
