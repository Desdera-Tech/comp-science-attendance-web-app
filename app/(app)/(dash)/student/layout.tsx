import { requireRole } from "@/lib/auth/require-role";
import { redirect } from "next/navigation";

export default async function StudentPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await requireRole(["STUDENT"]))) {
    redirect("/login");
  }

  return <>{children}</>;
}
