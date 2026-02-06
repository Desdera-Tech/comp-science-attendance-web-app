import { NavGroupType } from "@/features/navigation/types";
import {
  LayoutDashboard,
  Logs,
  PlusCircle,
  ShieldUser,
  User2,
  Users2,
} from "lucide-react";

export const SIDEBAR_NAVIGATION_DATA: NavGroupType[] = [
  {
    dashboard: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin",
      },
    ],
  },
  {
    users: [
      {
        title: "Students",
        icon: Users2,
        items: [
          { title: "Students", url: "/admin/students" },
          { title: "Add Student", url: "/admin/students/add" },
        ],
      },
      {
        title: "Admins",
        icon: ShieldUser,
        items: [
          { title: "Admins", url: "/admin/admins" },
          { title: "Add Admin", url: "/admin/admins/add" },
        ],
      },
    ],
  },
  {
    records: [
      {
        title: "Records",
        icon: Logs,
        url: "/admin/records",
      },
      {
        title: "Create Record",
        icon: PlusCircle,
        url: "/admin/records/add",
      },
    ],
  },
  {
    settings: [
      {
        title: "Account",
        icon: User2,
        url: "/admin/account",
      },
    ],
  },
];
