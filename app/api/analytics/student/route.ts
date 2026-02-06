import { Analytics } from "@/features/student/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  if (!(await requireRole(["STUDENT"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const data: ApiEnvelope<Analytics> = {
    message: "Analytics fetched successfully",
    data: {
      records: 0,
    },
  };

  return NextResponse.json(data);
});
