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
import { SIDEBAR_NAVIGATION_DATA } from "@/features/navigation/lib/data";
import { NavGroup } from "./nav-group";
import { SidebarHeaderContent } from "./sidebar-header-content";

export function AppSidebar({
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isAdmin: boolean }) {
  const navigationData = isAdmin
    ? SIDEBAR_NAVIGATION_DATA
    : SIDEBAR_NAVIGATION_DATA;

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
