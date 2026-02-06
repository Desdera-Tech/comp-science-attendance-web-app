"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavParentType } from "@/features/navigation/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

const isParentPathActive = (pathname: string, targetUrl: string) => {
  const p = normalize(pathname);
  const t = normalize(targetUrl);
  return p === t || p.startsWith(t + "/");
};

const isPathActive = (pathname: string, targetUrl: string) => {
  const p = normalize(pathname);
  const t = normalize(targetUrl);
  return p === t;
};

export function NavGroup({
  label,
  items,
}: {
  label: string;
  items: NavParentType[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="capitalize">{label}</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = !!item.items?.length;

          const parentActive = hasChildren
            ? item.items!.some((sub) => isParentPathActive(pathname, sub.url))
            : item.url
              ? isPathActive(pathname, item.url)
              : false;

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`${parentActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                >
                  <Link href={item.url ?? "#"}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // ✅ 2) HAS CHILDREN: render collapsible + chevron + submenu
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={parentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`${parentActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const active = isPathActive(pathname, subItem.url);

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={
                              active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : ""
                            }
                          >
                            <Link className="py-1.5" href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
