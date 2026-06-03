import { NotFoundComp } from "@/components/not-found";
import { NominationsTable } from "@/features/nomination/components/nominations-table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NominationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const list = await prisma.nominationList.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          nominations: true,
        },
      },
    },
  });

  if (!list) {
    return (
      <NotFoundComp
        title="List not found"
        description="The requested nomination list could not be found on the server."
        className="max-w-md"
      />
    );
  }

  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Nominations</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Nominations for:{" "}
            <Link
              className="underline underline-offset-2"
              href={`/admin/nominations/${id}`}
            >
              {list.title}
            </Link>
          </p>
        </div>
      </div>
      <NominationsTable id={id} />
    </div>
  );
}
