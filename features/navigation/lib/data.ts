import { NavGroupType } from "@/features/navigation/types";
import { Role } from "@/generated/prisma/enums";
import {
  LayoutDashboard,
  Logs,
  PlusCircle,
  ShieldUser,
  User2,
  Users2,
} from "lucide-react";

export const getAdminNavigationData = (role: Role) => {
  const NAVIGATION_DATA: NavGroupType[] = [
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
        ...(role === "SUPER_ADMIN"
          ? [
              {
                title: "Admins",
                icon: ShieldUser,
                items: [
                  { title: "Admins", url: "/admin/admins" },
                  { title: "Add Admin", url: "/admin/admins/add" },
                ],
              },
            ]
          : [
              {
                title: "Admins",
                icon: ShieldUser,
                url: "/admin/admins",
              },
            ]),
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

  return NAVIGATION_DATA;
};
