import { RecordData } from "@/features/record/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { recordSchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: recordId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN", "STUDENT"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const record = await prisma.record.findUnique({
      where: { id: recordId },
      include: {
        _count: {
          select: {
            recordEntries: true,
            recordLinks: true,
          },
        },
      },
    });

    if (!record) {
      throw new ApiError("Record not found", 404);
    }

    const data: ApiEnvelope<RecordData> = {
      message: "Record fetched successfully",
      data: {
        ...record,
        entries: record._count.recordEntries,
        links: record._count.recordLinks,
      },
    };

    return NextResponse.json(data);
  },
);

export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: recordId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { title } = recordSchema.parse(body);

    const record = await prisma.record.update({
      where: { id: recordId },
      data: { title },
      include: {
        _count: {
          select: {
            recordEntries: true,
            recordLinks: true,
          },
        },
      },
    });

    const data: ApiEnvelope<RecordData> = {
      message: "Record edited successfully",
      data: {
        ...record,
        entries: record._count.recordEntries,
        links: record._count.recordLinks,
      },
    };

    return NextResponse.json(data);
  },
);

export const DELETE = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: recordId } = await params;

    if (!(await requireRole(["SUPER_ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    await prisma.record.delete({ where: { id: recordId } });

    const data: ApiEnvelope<any> = {
      message: "Record deleted successfully",
    };

    return NextResponse.json(data);
  },
);
