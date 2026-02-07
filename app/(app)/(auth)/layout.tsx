import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "STUDENT") {
      return redirect("/student");
    } else {
      return redirect("/admin");
    }
  }

  return <>{children}</>;
}
