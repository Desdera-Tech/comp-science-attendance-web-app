"use client";

import {
  ChevronsUpDown,
  Laptop,
  LogOut,
  LucideCheck,
  LucideProps,
  Moon,
  Sun,
} from "lucide-react";

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
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data } = useSession();

  if (!data) return;

  const { firstName, lastName, username } = data.user;
  const name = firstName + " " + lastName;

  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{firstName}</span>
                <span className="truncate text-xs">{username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">{username}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ThemeSwitcher />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: "/",
                })
              }
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Theme
      </DropdownMenuLabel>
      <ThemeItem
        ThemeIcon={Sun}
        label="Light"
        theme="light"
        setTheme={setTheme}
      />
      <ThemeItem
        ThemeIcon={Moon}
        label="Dark"
        theme="dark"
        setTheme={setTheme}
      />
      <ThemeItem
        ThemeIcon={Laptop}
        label="System"
        theme="system"
        setTheme={setTheme}
      />
    </DropdownMenuGroup>
  );
};

const ThemeItem = ({
  ThemeIcon,
  label,
  theme,
  setTheme,
}: {
  ThemeIcon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  theme: string;
  setTheme: (value: string) => void;
}) => {
  const { theme: currentTheme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() => setTheme(theme)}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <ThemeIcon className="size-4" />
        {label}
      </div>
      {currentTheme === theme ? (
        <LucideCheck className="size-4 opacity-70" />
      ) : null}
    </DropdownMenuItem>
  );
};
