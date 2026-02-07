import { Button } from "@/components/ui/button";
import { AdminsTable } from "@/features/admin/components/admins-table";
import { authOptions } from "@/lib/auth";
import { LucideUserPlus2 } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AdminsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return;

  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Admins</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/admin/admins/add">
              <LucideUserPlus2 /> Add New Admin
            </Link>
          </Button>
        </div>
      </div>
      <AdminsTable role={session.user.role} />
    </div>
  );
}
