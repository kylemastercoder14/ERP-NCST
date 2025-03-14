import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";

const Logo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <Image src="/assets/logo.png" alt="Logo" width={40} height={40} />
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">BAT Security Services</span>
              <span className="text-sm">Dashboard Panel</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default Logo;
