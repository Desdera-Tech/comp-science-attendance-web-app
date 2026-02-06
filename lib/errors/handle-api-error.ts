import { ApiEnvelope } from "@/types/api";
import { getReasonPhrase } from "http-status-codes";
import { NextResponse } from "next/server";
import { ApiError } from "./api-error";

export function handleApiError(
  error: unknown,
): NextResponse<ApiEnvelope<null>> {
  console.error("API ERROR:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        message: error.message,
        error: getReasonPhrase(error.status),
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      message: "Internal server error",
      error: getReasonPhrase(500),
    },
    { status: 500 },
  );
}
