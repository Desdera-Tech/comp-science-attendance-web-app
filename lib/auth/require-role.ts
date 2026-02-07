import { Role } from "@/generated/prisma/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from ".";

export async function requireRole(roles: Array<Role>) {
  const session = await getServerSession(authOptions);

  if (!session || !roles.includes(session.user.role)) {
    return null;
  }

  return session;
}

export async function requireRoleWithRedirect(roles: Array<Role>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  if (!roles.includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return session;
}
