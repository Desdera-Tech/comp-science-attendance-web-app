import { NotFoundComp } from "@/components/not-found";
import { RecordEntriesTable } from "@/features/record/componets/record-entries-table";
import { requireRoleWithRedirect } from "@/lib/auth/require-role";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RecordEntriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Record Entries</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Entries for the record:{" "}
            <Link
              className="underline underline-offset-2"
              href={`/admin/records/${id}`}
            >
              {record.title}
            </Link>
          </p>
        </div>
      </div>
      <RecordEntriesTable recordId={id} />
    </div>
  );
}
