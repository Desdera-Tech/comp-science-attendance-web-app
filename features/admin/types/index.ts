import { Role } from "@/generated/prisma/enums";

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
  createdAt: Date;
};

export type Analytics = {
  admins: number;
  students: number;
  records: number;
};

export type AdminsPage = {
  admins: Admin[];
  nextCursor: string | null;
};
