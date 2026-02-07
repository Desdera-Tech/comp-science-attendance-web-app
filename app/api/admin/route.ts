import { Admin } from "@/features/admin/types";
import { getPaginationParams } from "@/lib/api/pagination";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types";
import { ApiEnvelope, PageResponse } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  if (!(await requireRole(["SUPER_ADMIN"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const order = searchParams.get("order") as Order;
  const { page, limit, skip } = getPaginationParams(searchParams);

  const [admins, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN"] },
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      skip,
      take: limit,
      orderBy: { createdAt: order === "DESC" ? "desc" : "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN"] },
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
    }),
  ]);

  const data: ApiEnvelope<PageResponse<Admin>> = {
    message: "Admins fetched successfully",
    data: {
      items: admins,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  return NextResponse.json(data);
});
