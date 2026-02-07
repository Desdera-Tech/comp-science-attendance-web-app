import { Analytics } from "@/features/student/types";
import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics, getStudentAnalytics } from "../services/analytics";

export function useAdminAnalyticsInfo() {
  return useQuery({
    queryKey: ["admin-analytics-info"],
    queryFn: async () => {
      const response = await getAdminAnalytics();
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Error fetching Analytics info");
    },
  });
}

export function useStudentAnalyticsInfo(initialData: Analytics) {
  return useQuery({
    queryKey: ["student-analytics-info"],
    queryFn: async () => {
      const response = await getStudentAnalytics();
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Error fetching Analytics info");
    },
    initialData,
  });
}
