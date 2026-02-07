import { NotFoundComp } from "@/components/not-found";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IconCircleCheck } from "@tabler/icons-react";
import { getServerSession } from "next-auth";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const record = await prisma.record.findUnique({
    where: { id },
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

  const entry = await prisma.recordEntry.findFirst({
    where: {
      recordId: id,
      userId: session?.user.id,
    },
  });

  if (!entry) {
    return (
      <NotFoundComp
        title="Entry not found"
        description="Your record entry could not be found on the server."
        className="max-w-md"
      />
    );
  }

  return (
    <div className="flex flex-1 items-start">
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-24" variant="default">
            <IconCircleCheck className="size-16" />
          </EmptyMedia>
          <EmptyTitle className="font-semibold text-2xl">
            Record Added
          </EmptyTitle>
          <EmptyDescription>
            You have been added to the record list for: {record.title}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
