import { NotFoundComp } from "@/components/not-found";
import { EditAdminForm } from "@/features/admin/components/edit-admin-form";
import { requireRoleWithRedirect } from "@/lib/auth/require-role";
import { prisma } from "@/lib/prisma";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await requireRoleWithRedirect(["SUPER_ADMIN"]);

  const admin = await prisma.user.findUnique({
    where: { id, OR: [{ role: "SUPER_ADMIN" }, { role: "ADMIN" }] },
  });

  if (!admin) {
    return (
      <NotFoundComp
        title="Admin not found"
        description="The requested admin details could not be found on the server."
        className="max-w-md"
      />
    );
  }

  return (
    <div className="w-full lg:w-1/2">
      <EditAdminForm admin={admin} />
    </div>
  );
}
