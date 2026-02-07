import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { ApiEnvelope } from "@/types/api";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PATCH = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    if (!(await requireRole(["STUDENT"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const session = await getServerSession(authOptions);
    const studentId = session?.user.id || "";

    const link = await prisma.recordLink.findUnique({ where: { id } });
    if (!link) {
      throw new ApiError("Link is invalid", 400);
    }

    await prisma.$transaction([
      prisma.recordLink.delete({ where: { id } }),
      prisma.recordEntry.create({
        data: {
          recordId: link.recordId,
          userId: studentId,
        },
      }),
    ]);

    const data: ApiEnvelope<string> = {
      message: "Entry added successfully",
      data: link.recordId,
    };

    return NextResponse.json(data);
  },
);
