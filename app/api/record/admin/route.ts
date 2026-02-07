import { RecordData } from "@/features/record/types";
import { getPaginationParams } from "@/lib/api/pagination";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types";
import { ApiEnvelope, PageResponse } from "@/types/api";
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

  const [records, total] = await Promise.all([
    prisma.record.findMany({
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
        _count: {
          select: {
            recordEntries: true,
            recordLinks: true,
          },
        },
      },
    }),
    prisma.record.count({
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

  const data: ApiEnvelope<PageResponse<RecordData>> = {
    message: "Records fetched successfully",
    data: {
      items: records.map((record) => ({
        ...record,
        entries: record._count.recordEntries,
        links: record._count.recordLinks,
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  return NextResponse.json(data);
});
