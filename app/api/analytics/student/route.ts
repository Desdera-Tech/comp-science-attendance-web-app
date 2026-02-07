import { Analytics } from "@/features/student/types";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { ApiEnvelope } from "@/types/api";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  if (!(await requireRole(["STUDENT"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const session = await getServerSession(authOptions);

  const records = await prisma.record.count({
    where: { recordEntries: { some: { userId: session?.user.id } } },
  });

  const data: ApiEnvelope<Analytics> = {
    message: "Analytics fetched successfully",
    data: {
      records,
    },
  };

  return NextResponse.json(data);
});
