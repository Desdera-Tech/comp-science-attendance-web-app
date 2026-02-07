import { RecordData } from "@/features/record/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { recordSchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: Request) => {
  if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const body = await req.json();
  const { title } = recordSchema.parse(body);

  const record = await prisma.record.create({
    data: { title },
  });

  const data: ApiEnvelope<RecordData> = {
    message: "Record added successfully",
    data: {
      title: record.title,
      entries: 0,
      links: 0,
      createdAt: record.createdAt,
    },
  };

  return NextResponse.json(data);
});
