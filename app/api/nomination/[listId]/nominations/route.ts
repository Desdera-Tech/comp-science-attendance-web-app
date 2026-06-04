import { NominationData } from "@/features/nomination/types";
import { Prisma } from "@/generated/prisma/client";
import { getPaginationParams } from "@/lib/api/pagination";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types";
import { ApiEnvelope, PageResponse } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ listId: string }> }) => {
    const { listId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN", "STUDENT"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const order = searchParams.get("order") as Order;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const { page, limit, skip } = getPaginationParams(searchParams);

    const nominationList = await prisma.nominationList.findUnique({
      where: { id: listId },
      select: { title: true },
    });

    if (!nominationList) {
      throw new ApiError("Nomination list not found", 404);
    }

    const where: Prisma.NominationWhereInput = {
      nominationListId: listId,
      ...(search && {
        nominee: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
      ...((from || to) && {
        createdAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    };

    const [grouped, total] = await Promise.all([
      prisma.nomination.groupBy({
        by: ["nomineeId"],
        where,
        _count: {
          nomineeId: true,
        },
        orderBy: {
          _count: {
            nomineeId: order === "DESC" ? "desc" : "asc",
          },
        },
        skip,
        take: limit,
      }),
      prisma.nomination.groupBy({
        by: ["nomineeId"],
        where,
      }),
    ]);

    const nominees = await prisma.user.findMany({
      where: {
        id: {
          in: grouped.map((g) => g.nomineeId),
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const data: ApiEnvelope<PageResponse<NominationData>> = {
      message: "Nominations fetched successfully",
      data: {
        items: grouped.map((group) => {
          const nominee = nominees.find((n) => n.id === group.nomineeId);

          return {
            nominationListId: listId,
            nominationListTitle: nominationList.title,
            nomineeId: group.nomineeId,
            nomineeName: `${nominee?.firstName} ${nominee?.lastName}`,
            nominations: group._count.nomineeId,
          };
        }),
        page,
        limit,
        total: total.length,
        totalPages: Math.ceil(total.length / limit),
      },
    };

    return NextResponse.json(data);
  },
);
