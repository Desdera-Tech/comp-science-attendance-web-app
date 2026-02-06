import { Analytics as AdminAnalytics } from "@/features/admin/types";
import { Analytics as StudentAnalytics } from "@/features/student/types";
import { api } from "@/lib/http/api";
import { exceptionHandler } from "@/lib/http/exception";
import { ApiEnvelope } from "@/types/api";

export async function getAdminAnalytics(): Promise<
  ApiEnvelope<AdminAnalytics>
> {
  try {
    const res = await api.get<ApiEnvelope<AdminAnalytics>>(
      "/api/analytics/admin",
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function getStudentAnalytics(): Promise<
  ApiEnvelope<StudentAnalytics>
> {
  try {
    const res = await api.get<ApiEnvelope<StudentAnalytics>>(
      "/api/analytics/student",
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}
