import { RecordEntry } from "@/features/record/types";
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

export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const { id: recordId } = await params;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const order = searchParams.get("order") as Order;

    const { page, limit, skip } = getPaginationParams(searchParams);

    const searchTerms = search?.split(" ").filter(Boolean);

    const where: Prisma.RecordEntryWhereInput = {
      recordId,
      ...(search && {
        OR: [
          {
            user: {
              username: { contains: search, mode: QueryMode.insensitive },
            },
          },

          // First name only
          {
            user: {
              firstName: { contains: search, mode: QueryMode.insensitive },
            },
          },

          // Middle name only
          {
            user: {
              middleName: { contains: search, mode: QueryMode.insensitive },
            },
          },

          // Last name only
          {
            user: {
              lastName: { contains: search, mode: QueryMode.insensitive },
            },
          },

          // Full name search: "John Doe"
          ...(searchTerms && searchTerms.length > 1
            ? [
                {
                  AND: [
                    {
                      user: {
                        firstName: {
                          contains: searchTerms[0],
                          mode: QueryMode.insensitive,
                        },
                      },
                    },
                    {
                      user: {
                        lastName: {
                          contains: searchTerms[1],
                          mode: QueryMode.insensitive,
                        },
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
                      user: {
                        firstName: {
                          contains: searchTerms[0],
                          mode: QueryMode.insensitive,
                        },
                      },
                    },
                    {
                      user: {
                        middleName: {
                          contains: searchTerms[1],
                          mode: QueryMode.insensitive,
                        },
                      },
                    },
                    {
                      user: {
                        lastName: {
                          contains: searchTerms[2],
                          mode: QueryMode.insensitive,
                        },
                      },
                    },
                  ],
                },
              ]
            : []),
        ],
      }),
    };

    const [entries, total] = await Promise.all([
      prisma.recordEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: order === "DESC" ? "desc" : "asc" },
        include: {
          user: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              username: true,
            },
          },
        },
      }),
      prisma.recordEntry.count({ where }),
    ]);

    const data: ApiEnvelope<PageResponse<RecordEntry>> = {
      message: "Record entries fetched successfully",
      data: {
        items: entries.map(({ user, ...entry }) => ({
          ...entry,
          name: user.lastName + " " + user.firstName + " " + user.middleName,
          matricNo: user.username,
        })),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(data);
  },
);
