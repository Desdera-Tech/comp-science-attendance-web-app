import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { addRecordEntrySchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    if (!(await requireRole(["SUPER_ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { matricNo } = addRecordEntrySchema.parse(body);

    const [record, student] = await prisma.$transaction([
      prisma.record.findUnique({
        where: { id },
        select: {
          id: true,
          recordEntries: { where: { user: { username: matricNo } } },
        },
      }),
      prisma.user.findUnique({
        where: { username: matricNo },
      }),
    ]);

    if (!record) {
      throw new ApiError("Record not found", 404);
    }

    if (!student) {
      throw new ApiError("Student not found", 404);
    }

    if (record.recordEntries.length > 0) {
      throw new ApiError("Student already exists in record", 409);
    }

    await prisma.recordEntry.create({
      data: {
        recordId: id,
        userId: student.id,
      },
    });

    const data: ApiEnvelope<any> = {
      message: "Record entry added successfully",
    };

    return NextResponse.json(data);
  },
);
