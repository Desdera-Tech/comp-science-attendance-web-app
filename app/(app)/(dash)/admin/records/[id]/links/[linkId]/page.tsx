import { NotFoundComp } from "@/components/not-found";
import { LinkDetails } from "@/features/record/componets/link-details";
import { requireRoleWithRedirect } from "@/lib/auth/require-role";
import { prisma } from "@/lib/prisma";

export default async function RecordLinkPage({
  params,
}: {
  params: Promise<{ id: string; linkId: string }>;
}) {
  const { id, linkId } = await params;

  await requireRoleWithRedirect(["SUPER_ADMIN", "ADMIN"]);

  const record = await prisma.record.findUnique({ where: { id } });

  if (!record) {
    return (
      <NotFoundComp
        title="Record not found"
        description="The requested record details could not be found on the server."
        className="max-w-md"
      />
    );
  }

  const link = await prisma.recordLink.findUnique({ where: { id: linkId } });

  if (!link) {
    return (
      <NotFoundComp
        title="Link not found"
        description="The requested record link could not be found on the server."
        className="max-w-md"
      />
    );
  }

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <LinkDetails link={link} />
      </div>
    </div>
  );
}
