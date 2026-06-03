import { NominationData } from "@/features/nomination/types";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { ApiEnvelope } from "@/types/api";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  async (
    _: Request,
    { params }: { params: Promise<{ listId: string; userId: string }> },
  ) => {
    const { listId, userId } = await params;

    if (!(await requireRole(["STUDENT"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("Unauthorized", 401);
    }

    if (
      (await prisma.nominationList.findUnique({ where: { id: listId } })) ===
      null
    ) {
      throw new ApiError("Nomination list not found", 404);
    }

    if (
      await prisma.nomination.findUnique({
        where: {
          nominationListId_nominatedById: {
            nominationListId: listId,
            nominatedById: session.user.id,
          },
        },
      })
    ) {
      throw new ApiError("You have already nominated for this list", 400);
    }

    const nomination = await prisma.nomination.upsert({
      where: {
        nominationListId_nominatedById_nomineeId: {
          nominationListId: listId,
          nominatedById: session.user.id,
          nomineeId: userId,
        },
      },
      create: {
        nominationListId: listId,
        nominatedById: session.user.id,
        nomineeId: userId,
      },
      update: {},
    });

    const nominee = await prisma.user.findUnique({
      where: { id: nomination.nominatedById },
      select: { firstName: true, lastName: true },
    });

    const nominationCount = await prisma.nomination.count({
      where: { nomineeId: userId, nominationListId: listId },
    });

    const data: ApiEnvelope<NominationData> = {
      message: "Nomination created successfully",
      data: {
        ...nomination,
        nomineeName: `${nominee?.firstName} ${nominee?.lastName}`,
        nominations: nominationCount,
      },
    };

    return NextResponse.json(data);
  },
);

export const DELETE = withErrorHandler(
  async (
    _: Request,
    { params }: { params: Promise<{ listId: string; userId: string }> },
  ) => {
    const { listId, userId } = await params;

    if (!(await requireRole(["STUDENT"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("Unauthorized", 401);
    }

    await prisma.nomination.delete({
      where: {
        nominationListId_nominatedById_nomineeId: {
          nominationListId: listId,
          nominatedById: session.user.id,
          nomineeId: userId,
        },
      },
    });

    const data: ApiEnvelope<any> = {
      message: "Nomination deleted successfully",
    };

    return NextResponse.json(data);
  },
);
