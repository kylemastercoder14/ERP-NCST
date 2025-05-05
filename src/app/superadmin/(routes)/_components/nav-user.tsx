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
import { useState } from "react";
import { toast } from "sonner";
import { logoutUser } from "@/actions";
import ModeToggle from '@/components/global/mode-toggle';

export function NavUser({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
	try {
	  await logoutUser();
	  toast.success("Logged out successfully");
	  router.push("/superadmin/sign-in");
	} catch (error) {
	  console.error(error);
	}
  };
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
