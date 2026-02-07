import { NotFoundComp } from "@/components/not-found";
import { EditRecordForm } from "@/features/record/componets/edit-record-form";
import { GenerateLinkCard } from "@/features/record/componets/generate-link-card";
import { RecordData } from "@/features/record/types";
import { prisma } from "@/lib/prisma";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const record = await prisma.record.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          recordEntries: true,
          recordLinks: true,
        },
      },
    },
  });

  if (!record) {
    return (
      <NotFoundComp
        title="Record not found"
        description="The requested record details could not be found on the server."
        className="max-w-md"
      />
    );
  }

  const data: RecordData = {
    ...record,
    entries: record._count.recordEntries,
    links: record._count.recordLinks,
  };

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <EditRecordForm record={data} />
      </div>
      <div className="lg:col-span-2">
        <GenerateLinkCard record={data} />
      </div>
    </div>
  );
}
