import { Role } from "@/generated/prisma/enums";

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: Role;
  createdAt: Date;
};

export type Analytics = {
  admins: number;
  students: number;
  records: number;
};
