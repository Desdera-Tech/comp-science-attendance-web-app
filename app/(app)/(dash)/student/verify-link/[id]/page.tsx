import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { authOptions } from "@/lib/auth";
import { requireRoleWithRedirect } from "@/lib/auth/require-role";
import { prisma } from "@/lib/prisma";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { getServerSession } from "next-auth";

export default async function VerifyLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await requireRoleWithRedirect(["STUDENT"]);

  const session = await getServerSession(authOptions);
  const studentId = session?.user.id || "";

  const link = await prisma.recordLink.findUnique({
    where: { id },
    include: {
      record: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!link) {
    return (
      <div className="flex flex-1 items-start">
        <Empty>
          <EmptyHeader>
            <EmptyMedia className="size-24" variant="default">
              <IconCircleX className="size-16" />
            </EmptyMedia>
            <EmptyTitle className="font-semibold text-2xl">
              Link Invalid
            </EmptyTitle>
            <EmptyDescription>The record link is invalid</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  await prisma.recordEntry.create({
    data: {
      recordId: link.recordId,
      userId: studentId,
    },
  });

  if (link.type === "ONE_TIME_USE") {
    await prisma.recordLink.delete({ where: { id } });
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
            You have been added to the record list for: {link.record.title}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
