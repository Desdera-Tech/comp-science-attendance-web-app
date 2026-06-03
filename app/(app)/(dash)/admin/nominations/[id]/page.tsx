import { NotFoundComp } from "@/components/not-found";
import EditNominationListForm from "@/features/nomination/components/edit-nomination-list-form";
import { NominationListData } from "@/features/nomination/types";
import { prisma } from "@/lib/prisma";

export default async function NominationListPage({
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

  const data: NominationListData = {
    ...list,
    nominations: list._count.nominations,
  };

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <EditNominationListForm list={data} />
      </div>
    </div>
  );
}
