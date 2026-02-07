import { NotFoundComp } from "@/components/not-found";
import { RecordLinksTable } from "@/features/record/componets/record-links-table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RecordLinksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          <h1 className="text-xl md:text-2xl font-bold">Record Links</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Links for the record:{" "}
            <Link
              className="underline underline-offset-2"
              href={`/admin/records/${id}`}
            >
              {record.title}
            </Link>
          </p>
        </div>
      </div>
      <RecordLinksTable recordId={id} />
    </div>
  );
}
