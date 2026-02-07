import { requireRoleWithRedirect } from "@/lib/auth/require-role";

export default async function StudentPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRoleWithRedirect(["STUDENT"]);

  return <>{children}</>;
}
