import { Student } from "@/features/student/types";
import { Prisma } from "@/generated/prisma/client";
import { QueryMode } from "@/generated/prisma/internal/prismaNamespace";
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
  const { page, limit, skip } = getPaginationParams(searchParams);

  const searchTerms = search?.split(" ").filter(Boolean);

  const where: Prisma.UserWhereInput = {
    role: "STUDENT",
    ...(search && {
      OR: [
        { username: { contains: search, mode: QueryMode.insensitive } },

        // First name only
        { firstName: { contains: search, mode: QueryMode.insensitive } },

        // Middle name only
        { middleName: { contains: search, mode: QueryMode.insensitive } },

        // Last name only
        { lastName: { contains: search, mode: QueryMode.insensitive } },

        // Full name search: "John Doe"
        ...(searchTerms && searchTerms.length > 1
          ? [
              {
                AND: [
                  {
                    firstName: {
                      contains: searchTerms[0],
                      mode: QueryMode.insensitive,
                    },
                  },
                  {
                    lastName: {
                      contains: searchTerms[1],
                      mode: QueryMode.insensitive,
                    },
                  },
                ],
              },
            ]
          : []),
        ...(searchTerms && searchTerms.length > 2
          ? [
              {
                AND: [
                  {
                    firstName: {
                      contains: searchTerms[0],
                      mode: QueryMode.insensitive,
                    },
                  },
                  {
                    middleName: {
                      contains: searchTerms[1],
                      mode: QueryMode.insensitive,
                    },
                  },
                  {
                    lastName: {
                      contains: searchTerms[2],
                      mode: QueryMode.insensitive,
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    }),
  };

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: order === "DESC" ? "desc" : "asc" },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        username: true,
        createdAt: true,
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);

  const data: ApiEnvelope<PageResponse<Student>> = {
    message: "Students fetched successfully",
    data: {
      items: students,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  return NextResponse.json(data);
});
