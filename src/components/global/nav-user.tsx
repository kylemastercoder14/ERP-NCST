"use client";

import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import AlertModal from "@/components/ui/alert-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllNotificationsOperations, logoutUser } from "@/actions";
import ModeToggle from "./mode-toggle";
import { Badge } from "../ui/badge";
import { AccomplishmentReportWithProps } from "@/types";

export function NavUser({
  name,
  email,
  visibleNotification,
  branch,
}: {
  name: string;
  email: string;
  visibleNotification?: boolean;
  branch?: string;
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [notifications, setNotifications] = useState<
    AccomplishmentReportWithProps[]
  >([]);
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/supplier/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getAllNotificationsOperations(branch as string);
      if (res.data) {
        setNotifications(res.data);
      } else {
        return null;
      }
    };

    fetchNotifications();
  }, [branch]);
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        description="Are you sure you want to logout?"
      />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg relative">
                  {visibleNotification && notifications.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="rounded-full p-0 size-4 flex items-center justify-center absolute text-[9px] top-0 right-0"
                    >
                      {notifications.length}
                    </Badge>
                  )}
                  <AvatarFallback className="rounded-lg">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{name}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <ModeToggle />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/head/notifications")}
                >
                  <span>Notifications</span>
                  {visibleNotification && notifications.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="rounded-full ml-auto"
                    >
                      {notifications.length}
                    </Badge>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
