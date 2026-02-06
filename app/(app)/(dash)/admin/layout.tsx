import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireRole } from "@/lib/auth/require-role";
import { redirect } from "next/navigation";

export default async function AdminPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar isAdmin={true} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
