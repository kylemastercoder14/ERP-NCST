import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./(routes)/_components/app-sidebar";
import { redirect } from "next/navigation";
import Header from "./(routes)/_components/header";
import { ThemeProvider } from "@/components/global/theme-provider";
import { useSuperadmin } from "@/hooks/use-superadmin";

const HeadLayout = async ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useSuperadmin();
  if (!user) {
    return redirect("/sign-in");
  }
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
        <AppSidebar user={user} />
        <SidebarInset>
          <Header />
          <main className="px-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default HeadLayout;
