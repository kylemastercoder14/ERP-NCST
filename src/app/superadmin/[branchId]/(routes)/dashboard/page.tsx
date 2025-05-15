import { redirect } from "next/navigation";
import Heading from "@/components/ui/heading";
import HRDashboard from "./_components/hr-dashboard";
import FinanceDashboard from "./_components/finance-dashboard";
import OperationDashboard from "./_components/operation-dashboard";
import ProcurementDashboard from "./_components/procurement-dashboard";
import InventoryDashboard from "./_components/inventory-dashboard";
import CRMDashboard from "./_components/crm-dashboard";
import { DepartmentSelector } from "./_components/department-selector";
import { DashboardWrapper } from "./_components/dashboard-wrapper";

export default async function DashboardPage({
  searchParams,
  params
}: {
  searchParams: { department?: string };
  params: { branchId: string };
}) {
  const validDepartments = [
    "Human Resource",
    "Finance",
    "Operation",
    "Procurement",
    "Inventory",
    "Customer Relationship",
  ];

  // Get and validate department
  let department = searchParams.department || "Human Resource";

  if (!validDepartments.includes(department)) {
    department = "Human Resource";
    redirect(`/superadmin/${params.branchId}/dashboard?department=Human+Resource`);
  }

  const renderDashboard = () => {
    switch (department) {
      case "Human Resource":
        return <HRDashboard />;
      case "Finance":
        return <FinanceDashboard />;
      case "Operation":
        return <OperationDashboard />;
      case "Procurement":
        return <ProcurementDashboard />;
      case "Inventory":
        return <InventoryDashboard />;
      case "Customer Relationship":
        return <CRMDashboard />;
      default:
        return null;
    }
  };

  return (
    <DashboardWrapper>
      <div className="flex items-center justify-between mb-3">
        <Heading title="Dashboard Overview" description="" />
        <DepartmentSelector
          defaultValue={department}
        />
      </div>
      {renderDashboard()}
    </DashboardWrapper>
  );
}
