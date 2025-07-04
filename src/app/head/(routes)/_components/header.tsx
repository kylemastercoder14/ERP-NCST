"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { UserWithProps } from '@/types';

const Header = ({user}: {user: UserWithProps}) => {
  const pathname = usePathname();

  // Split the path into segments and remove the first one ('head')
  const segments = pathname.split("/").filter(Boolean).slice(1);

  const department = `${user?.Employee.Branch?.name ?? ""} | ${user?.Employee.Department?.name ?? ""} Department (${user?.Employee.JobTitle?.name ?? ""})`;

  // If the path is just "/head/dashboard", show simplified header with department
  if (segments.length === 1 && segments[0] === "dashboard") {
    return (
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <p className='ml-auto text-sm'>{department}</p>
      </header>
    );
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/head/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const url = `/head/${segments.slice(0, index + 1).join("/")}`;
            const formattedSegment =
              segment
                .replace(/-/g, " ") // Replace hyphens with spaces
                .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

            return (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={url}>{formattedSegment}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <p className='ml-auto text-sm'>{department}</p>
    </header>
  );
};

export default Header;
