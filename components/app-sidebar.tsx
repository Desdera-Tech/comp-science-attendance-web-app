"use client";

import * as React from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  getAdminNavigationData,
  STUDENT_NAVIGATION_DATA,
} from "@/features/navigation/lib/data";
import { useSession } from "next-auth/react";
import { NavGroup } from "./nav-group";
import { SidebarHeaderContent } from "./sidebar-header-content";

export function AppSidebar({
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isAdmin: boolean }) {
  const { data } = useSession();

  const navigationData = isAdmin
    ? getAdminNavigationData(data?.user.role)
    : STUDENT_NAVIGATION_DATA;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent>
        {navigationData.map((group, index) => {
          const [groupName, items] = Object.entries(group)[0];

          return (
            <NavGroup
              key={index}
              label={groupName.replace(/([A-Z])/g, " $1")}
              items={items}
            />
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
