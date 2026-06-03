import { NominationListData } from "@/features/nomination/types";
import { getPaginationParams } from "@/lib/api/pagination";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { nominationListSchema } from "@/lib/validation";
import { Order } from "@/types";
import { ApiEnvelope, PageResponse } from "@/types/api";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const order = searchParams.get("order") as Order;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { page, limit, skip } = getPaginationParams(searchParams);

  const [nominationsList, total] = await Promise.all([
    prisma.nominationList.findMany({
      where: {
        ...(search && {
          title: { contains: search, mode: "insensitive" },
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
        nominations: {
          select: {
            nomineeId: true,
          },
        },
      },
    }),
    prisma.nominationList.count({
      where: {
        ...(search && {
          title: { contains: search, mode: "insensitive" },
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

  const data: ApiEnvelope<PageResponse<NominationListData>> = {
    message: "Nominations list fetched successfully",
    data: {
      items: nominationsList.map((list) => ({
        ...list,
        nominations: new Set(list.nominations.map((n) => n.nomineeId)).size,
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  return NextResponse.json(data);
});

export const POST = withErrorHandler(async (req: Request) => {
  if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError("Unauthorized", 401);
  }

  const body = await req.json();
  const { title, description } = nominationListSchema.parse(body);

  const nominationList = await prisma.nominationList.create({
    data: { title, description, createdByUserId: session.user.id },
  });

  const data: ApiEnvelope<NominationListData> = {
    message: "Nomination list created successfully",
    data: {
      id: nominationList.id,
      title: nominationList.title,
      description: nominationList.description,
      nominations: 0,
      createdAt: nominationList.createdAt,
    },
  };

  return NextResponse.json(data);
});
