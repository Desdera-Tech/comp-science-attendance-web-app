import { NotFoundComp } from "@/components/not-found";
import { EntryDetails } from "@/features/record/componets/entry-details";
import { RecordEntry } from "@/features/record/types";
import { prisma } from "@/lib/prisma";

export default async function RecordEntryPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;

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

  const entry = await prisma.recordEntry.findUnique({
    where: { id: entryId },
    include: {
      user: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          username: true,
        },
      },
    },
  });

  if (!entry) {
    return (
      <NotFoundComp
        title="Entry not found"
        description="The requested record entry could not be found on the server."
        className="max-w-md"
      />
    );
  }

  const data: RecordEntry = {
    ...entry,
    name:
      entry.user.lastName +
      " " +
      entry.user.firstName +
      " " +
      entry.user.middleName,
    matricNo: entry.user.username,
  };

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <EntryDetails entry={data} recordTitle={record.title} />
      </div>
    </div>
  );
}
