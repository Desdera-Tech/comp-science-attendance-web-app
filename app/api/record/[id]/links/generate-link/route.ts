import { LinkType } from "@/generated/prisma/enums";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: recordId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { type } = body;

    const record = await prisma.record.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new ApiError("Record not found", 404);
    }

    const link = await prisma.recordLink.create({
      data: { recordId, type: type as LinkType },
    });

    const data: ApiEnvelope<string> = {
      message: "Record link created successfully",
      data: link.id,
    };

    return NextResponse.json(data);
  },
);
