import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./(routes)/_components/app-sidebar";
import { redirect } from "next/navigation";
import Header from "./(routes)/_components/header";
import { ThemeProvider } from "@/components/global/theme-provider";
import { useSuperadmin } from "@/hooks/use-superadmin";
import db from "@/lib/db";

const HeadLayout = async ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useSuperadmin();
  if (!user) {
    return redirect("/sign-in");
  }

  const branches = await db.branch.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar user={user} branches={branches} />
        <SidebarInset>
          <Header />
          <main className="px-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default HeadLayout;
