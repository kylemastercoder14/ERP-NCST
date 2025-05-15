/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname, useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Admin, Branch } from "@prisma/client";
import { TeamSwitcher } from "./team-switcher";
import { NavUser } from "./nav-user";

export const SIDEBAR_SUPERADMIN = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/superadmin/[branchId]/dashboard",
      },
      {
        title: "Job Posting Approval",
        url: "/superadmin/[branchId]/job-posting",
      },
      {
        title: "Site Settings",
        url: "/superadmin/[branchId]/settings",
      },
      {
        title: "Onboarding & Training",
        url: "/superadmin/[branchId]/onboarding-training",
      },
      {
        title: "Logs",
        url: "/superadmin/[branchId]/logs",
      },
    ],
  },
  {
    title: "Human Resource Management",
    url: "#",
    items: [
      {
        title: "Applicants List",
        url: "/superadmin/[branchId]/applicants-list",
      },
      {
        title: "Employee Management",
        url: "#",
        items: [
          {
            title: "Employee List",
            url: "/superadmin/[branchId]/employee-management",
          },
          {
            title: "Add Employee",
            url: "/superadmin/[branchId]/employee-management/create",
          },
        ],
      },
      {
        title: "Attendance Management",
        url: "#",
        items: [
          {
            title: "Attendance Monitoring",
            url: "/superadmin/[branchId]/attendance-management",
          },
          {
            title: "Overtime Request",
            url: "/superadmin/[branchId]/attendance-management/overtime-undertime",
          },
        ],
      },
      {
        title: "Payroll Management",
        url: "/superadmin/[branchId]/payroll-management",
        items: [
          {
            title: "Base Salary",
            url: "/superadmin/[branchId]/payroll-management/base-salary",
          },
          {
            title: "Payslip Generation",
            url: "/superadmin/[branchId]/payroll-management/payslip-generation",
          },
        ],
      },
      {
        title: "Leave Management",
        url: "/superadmin/[branchId]/leave-management",
      },
    ],
  },
  {
    title: "CRM",
    url: "#",
    items: [
      {
        title: "Client Management",
        url: "#",
        items: [
          {
            title: "Client List",
            url: "/superadmin/[branchId]/client-management",
          },
          {
            title: "Add Client",
            url: "/superadmin/[branchId]/client-management/create",
          },
        ],
      },
      {
        title: "Ticket Management",
        url: "/superadmin/[branchId]/ticket-management",
      },
    ],
  },
  {
    title: "Finance & Accounting",
    url: "#",
    items: [
      {
        title: "Sales Management",
        url: "#",
        items: [
          {
            title: "Ledger",
            url: "/superadmin/[branchId]/sales-management",
          },
          {
            title: "Accounts Payable",
            url: "/superadmin/[branchId]/sales-management/accounts-payable",
          },
          {
            title: "Accounts Receivable",
            url: "/superadmin/[branchId]/sales-management/accounts-receivable",
          },
        ],
      },
    ],
  },
  {
    title: "Operations Management",
    url: "#",
    items: [
      {
        title: "Deployment Scheduling",
        url: "/superadmin/[branchId]/deployment-scheduling",
      },
      {
        title: "Shift Monitoring",
        url: "/superadmin/[branchId]/shift-monitoring",
      },
      {
        title: "Employee Evaluation",
        url: "/superadmin/[branchId]/employee-evaluation",
      },
    ],
  },
  {
    title: "Procurement Management",
    url: "#",
    items: [
      {
        title: "Items List",
        url: "/superadmin/[branchId]/items-list",
      },
      {
        title: "Supplier Management",
        url: "/superadmin/[branchId]/supplier-management",
      },
      {
        title: "Purchase Request",
        url: "/superadmin/[branchId]/purchase-request",
      },
    ],
  },
  {
    title: "Inventory",
    url: "#",
    items: [
      {
        title: "Inventory Management",
        url: "/superadmin/[branchId]/inventory-management",
      },
      {
        title: "Withdrawal Management",
        url: "/superadmin/[branchId]/withdrawal-management",
      },
      {
        title: "List of Purchase Orders",
        url: "/superadmin/[branchId]/purchase-orders",
      },
    ],
  },
];

const replaceBranchId = (url: string, branchId: string) => {
  return url.replace("[branchId]", branchId);
};

const renderMenuItem = (
  item: any,
  pathname: string,
  branchId: string,
  level = 0,
  isTopLevelCategory = false
) => {
  const itemUrl = item.url ? replaceBranchId(item.url, branchId) : "#";
  const isActive = pathname === itemUrl;

  if (isTopLevelCategory && item.items?.length) {
    return (
      <React.Fragment key={item.title}>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="font-bold text-muted-foreground"
            disabled
          >
            {item.title}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <div className="pl-2 space-y-1">
          {item.items.map((subItem: any) =>
            renderMenuItem(subItem, pathname, branchId, level + 1)
          )}
        </div>
      </React.Fragment>
    );
  }

  if (item.items?.length) {
    return (
      <Collapsible key={item.title} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
            {item.items.map((subItem: any) => (
              <SidebarMenuSubItem key={subItem.title}>
                {subItem.items?.length ? (
                  renderMenuItem(subItem, pathname, branchId, level + 1)
                ) : (
                  <SidebarMenuSubButton
                    asChild
                    isActive={
                      pathname === replaceBranchId(subItem.url, branchId)
                    }
                  >
                    <a href={replaceBranchId(subItem.url, branchId)}>
                      {subItem.title}
                    </a>
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isActive}>
        <a href={itemUrl}>{item.title}</a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar({
  user,
  branches,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: Admin; branches: Branch[] }) {
  const pathname = usePathname();
  const { branchId } = useParams();

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher branches={branches} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {SIDEBAR_SUPERADMIN.map((item) =>
              renderMenuItem(item, pathname, branchId as string, 0, true)
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={`${user.firstName} ${user.lastName}`}
          email={user.email}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
