"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
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
import Image from "next/image";
import { Branch } from "@prisma/client";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createBranch } from "@/actions";
import { cn } from "@/lib/utils";

export function TeamSwitcher({ branches }: { branches: Branch[] }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Get current branchId from params instead of parsing pathname
  const currentBranchId = params.branchId as string;

  const [open, setOpen] = React.useState(false);
  const [branch, setBranch] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!branch) return;
    try {
      const res = await createBranch(branch);
      if (res.branchData) {
        toast.success("Branch created successfully");
        router.replace(`/superadmin/${res.branchData}/dashboard`);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Error creating branch");
      console.error("Error creating branch:", error);
    } finally {
      setLoading(false);
      setOpen(false);
      setBranch("");
    }
  };

  const activeBranch = branches.find((b) => b.id === currentBranchId);

  return (
    <>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add new branch"
        description="Create a new branch for your organization"
      >
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Branch Name <span className="text-red-600">*</span>
              </Label>
              <Input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                id="name"
                placeholder="Branch Name"
                required
                disabled={loading}
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            type="submit"
            className="w-full"
          >
            Create Branch
          </Button>
        </form>
      </Modal>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src="/assets/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    BAT Security Services
                  </span>
                  <span className="truncate text-xs">
                    {activeBranch ? activeBranch.name : "Select"} Branch
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Branches
              </DropdownMenuLabel>
              {branches.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => {
                    // Construct the new path with the selected branchId
                    const newPath = pathname.replace(
                      /\/superadmin\/[^/]+/,
                      `/superadmin/${team.id}`
                    );
                    // Use replace instead of push
                    router.replace(newPath);
                  }}
                  className={cn(
                    "gap-2 p-2",
                    team.id === currentBranchId && "bg-muted font-semibold"
                  )}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Image
                      src="/assets/logo.png"
                      alt="Logo"
                      className="shrink-0"
                      width={20}
                      height={20}
                    />
                  </div>
                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add new branch
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
