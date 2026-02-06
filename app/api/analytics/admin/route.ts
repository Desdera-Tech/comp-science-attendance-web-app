import { Analytics } from "@/features/admin/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const [admins, students] = await prisma.$transaction([
    prisma.user.count({
      where: { OR: [{ role: "SUPER_ADMIN" }, { role: "ADMIN" }] },
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),
  ]);

  const data: ApiEnvelope<Analytics> = {
    message: "Analytics fetched successfully",
    data: {
      admins,
      students,
      records: 0,
    },
  };

  return NextResponse.json(data);
});
