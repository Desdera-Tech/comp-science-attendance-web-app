import { RecordLink } from "@/features/record/types";
import { getPaginationParams } from "@/lib/api/pagination";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types";
import { ApiEnvelope, PageResponse } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const { id: recordId } = await params;

    const { searchParams } = new URL(req.url);
    const order = searchParams.get("order") as Order;

    const { page, limit, skip } = getPaginationParams(searchParams);

    const [links, total] = await Promise.all([
      prisma.recordLink.findMany({
        where: { recordId },
        skip,
        take: limit,
        orderBy: { createdAt: order === "DESC" ? "desc" : "asc" },
      }),
      prisma.recordLink.count({
        where: { recordId },
      }),
    ]);

    const data: ApiEnvelope<PageResponse<RecordLink>> = {
      message: "Record links fetched successfully",
      data: {
        items: links,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(data);
  },
);
