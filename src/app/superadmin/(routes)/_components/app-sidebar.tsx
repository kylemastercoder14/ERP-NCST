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
import { usePathname } from "next/navigation";
import { getSidebarItems } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Admin } from "@prisma/client";
import { TeamSwitcher } from "./team-switcher";
import { NavUser } from "./nav-user";

// Helper function to recursively render menu items
const renderMenuItem = (
  item: any,
  pathname: string,
  level = 0,
  isTopLevelCategory = false
) => {
  // If it's a top-level category (General or Others), render title and items without collapsible
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
            renderMenuItem(subItem, pathname, level + 1)
          )}
        </div>
      </React.Fragment>
    );
  }

  // For regular items with subitems, render as collapsible
  if (item.items?.length) {
    return (
      <Collapsible key={item.title} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform  duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
            {item.items.map((subItem: any) => (
              <SidebarMenuSubItem key={subItem.title}>
                {subItem.items?.length ? (
                  renderMenuItem(subItem, pathname, level + 1)
                ) : (
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                  >
                    <a href={subItem.url}>{subItem.title}</a>
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // If no subitems, render as simple menu item
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={pathname === item.url}>
        <a href={item.url}>{item.title}</a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: Admin }) {
  const pathname = usePathname();
  const sidebarItems = getSidebarItems("Superadmin", "Admin");
  const branches = [
    {
      name: "BAT Security Services INC.",
      branch: "Cavite Branch",
    },
    {
      name: "BAT Security Services INC.",
      branch: "Batangas Branch",
    },
  ];
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher branches={branches} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {(sidebarItems ?? []).map((item) =>
              renderMenuItem(item, pathname, 0, true)
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
