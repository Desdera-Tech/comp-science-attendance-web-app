import { ApiEnvelope } from "@/types/api";
import { AxiosError, isAxiosError } from "axios";

export const exceptionHandler = <Data = unknown>(
  error: unknown,
): ApiEnvelope<Data> => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      name?: string;
      message?: string;
      error?: string;
    }>;

    // 1️⃣ Server responded with HTTP status
    if (axiosError.response) {
      const status = axiosError.response.status;
      const body = axiosError.response.data;

      // 🔥 Throw on 5xx
      if (status >= 500) {
        return {
          message:
            "An unexpected server error occurred. Please try again later.",
          error: "Unexpected error",
        };
      }

      return {
        message: body?.message ?? "Request failed",
        error: body?.error ?? "Request failed",
      };
    }

    // 2️⃣ Request made but no response (network/server down)
    if (axiosError.request) {
      // Timeout
      if (axiosError.code === "ECONNABORTED") {
        return {
          message: "Request timed out. Please try again.",
          error: "REQUEST_TIMEOUT",
        } as ApiEnvelope<Data>;
      }

      // No internet / server unreachable
      return {
        message: "Unable to connect. Please check your internet connection.",
        error: "NETWORK_ERROR",
      } as ApiEnvelope<Data>;
    }

    // 3️⃣ Axios config/setup error
    return {
      message: axiosError.message || "Unexpected request error",
      error: "AXIOS_ERROR",
    } as ApiEnvelope<Data>;
  }

  // -------------------------------
  // Non-Axios errors → crash
  // -------------------------------
  throw error;
};
