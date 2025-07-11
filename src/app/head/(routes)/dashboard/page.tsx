import React from "react";
import { useUser } from "@/hooks/use-user";
import db from "@/lib/db";
import HRDashboard from "./_components/hr-dashboard";
import FinanceDashboard from "./_components/finance-dashboard";
import OperationsDashboard from "./_components/operation-dashboard";
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

  const branchId = user?.Employee.branchId || "";

  if (department?.name === "Human Resource") {
    return <HRDashboard branchId={branchId} />;
  } else if (department?.name === "Finance") {
    return <FinanceDashboard branchId={branchId} />;
  } else if (department?.name === "Operation" || department?.name === "Trainer") {
    return <OperationsDashboard branchId={branchId} />;
  } else if (department?.name === "Procurement") {
    return <ProcurementDashboard branchId={branchId} />;
  } else if (department?.name === "Inventory") {
    return <InventoryDashboard branchId={branchId} />;
  } else if (department?.name === "Customer Relationship") {
    return <CRMDashboard branchId={branchId} />;
  } else {
    return (
      <div className="flex flex-1 items-center justify-center">
        No Dashboard Available
      </div>
    );
  }
};

export default Page;
