import { NominationData } from "@/features/nomination/types";
import { getPaginationParams } from "@/lib/api/pagination";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types";
import { ApiEnvelope, PageResponse } from "@/types/api";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  if (!(await requireRole(["STUDENT"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError("Unauthorized", 401);
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const order = searchParams.get("order") as Order;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { page, limit, skip } = getPaginationParams(searchParams);

  const [nominations, total] = await Promise.all([
    prisma.nomination.findMany({
      where: {
        nominatedById: session.user.id,
        ...(search && {
          nominationList: {
            title: { contains: search, mode: "insensitive" },
          },
          nominee: {
            firstName: { contains: search, mode: "insensitive" },
            lastName: { contains: search, mode: "insensitive" },
          },
        }),
        ...((from || to) && {
          createdAt: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }),
      },
      skip,
      take: limit,
      orderBy: { createdAt: order === "DESC" ? "desc" : "asc" },
      include: {
        nominationList: {
          select: {
            title: true,
          },
        },
        nominee: {
          select: {
            firstName: true,
            lastName: true,
            _count: {
              select: {
                nominationsReceived: true,
              },
            },
          },
        },
      },
    }),
    prisma.nomination.count({
      where: {
        nominatedById: session.user.id,
        ...(search && {
          nominationList: {
            title: { contains: search, mode: "insensitive" },
          },
          nominee: {
            firstName: { contains: search, mode: "insensitive" },
            lastName: { contains: search, mode: "insensitive" },
          },
        }),
        ...((from || to) && {
          createdAt: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }),
      },
    }),
  ]);

  const data: ApiEnvelope<PageResponse<NominationData>> = {
    message: "Nominations fetched successfully",
    data: {
      items: nominations.map((nomination) => ({
        ...nomination,
        nominationListTitle: nomination.nominationList.title,
        nomineeName: `${nomination.nominee.firstName} ${nomination.nominee.lastName}`,
        nominations: nomination.nominee._count.nominationsReceived,
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  return NextResponse.json(data);
});
