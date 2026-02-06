import { Role } from "@/generated/prisma/enums";
import { getServerSession } from "next-auth";
import { authOptions } from ".";

export async function requireRole(roles: Array<Role>) {
  const session = await getServerSession(authOptions);

  if (!session || !roles.includes(session.user.role)) {
    return null;
  }

  return session;
}
