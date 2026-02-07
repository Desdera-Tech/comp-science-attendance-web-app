import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const DELETE = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ entryId: string }> }) => {
    const { entryId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    await prisma.recordEntry.delete({ where: { id: entryId } });

    const data: ApiEnvelope<any> = {
      message: "Record entry removed successfully",
    };

    return NextResponse.json(data);
  },
);
