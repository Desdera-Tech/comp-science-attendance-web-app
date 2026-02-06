import { Role } from "@/generated/prisma/enums";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
      firstName: string;
      middleName?: string;
      lastName: string;
    };
  }
}
