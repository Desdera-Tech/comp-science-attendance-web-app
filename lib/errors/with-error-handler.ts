import { handleApiError } from "@/lib/errors/handle-api-error";
import { NextRequest } from "next/server";

type Handler = (req: NextRequest, ctx?: any) => Promise<Response>;

export function withErrorHandler(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
