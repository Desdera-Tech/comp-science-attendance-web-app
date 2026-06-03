import { NominationListData } from "@/features/nomination/types";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { ApiEnvelope } from "@/types/api";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ listId: string }> }) => {
    const { listId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN", "STUDENT"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const nominationList = await prisma.nominationList.findUnique({
      where: { id: listId },
    });

    if (!nominationList) {
      throw new ApiError("Nomination list not found", 404);
    }

    const nominatedStudents = await prisma.nomination.groupBy({
      by: ["nomineeId"],
      where: {
        nominationListId: listId,
      },
    });

    const data: ApiEnvelope<NominationListData> = {
      message: "Nomination list fetched successfully",
      data: {
        ...nominationList,
        nominations: nominatedStudents.length,
      },
    };

    return NextResponse.json(data);
  },
);

export const DELETE = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ listId: string }> }) => {
    const { listId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("Unauthorized", 401);
    }

    await prisma.nominationList.delete({
      where: { id: listId },
    });

    const data: ApiEnvelope<any> = {
      message: "Nomination list deleted successfully",
    };

    return NextResponse.json(data);
  },
);
