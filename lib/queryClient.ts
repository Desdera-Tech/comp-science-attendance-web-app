import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🔁 Retry logic for ALL queries
      retry: (failureCount, error: { message?: string }) => {
        const msg = String(error?.message ?? "").toLowerCase();

        const isNetworkError =
          msg.includes("network") ||
          msg.includes("timeout") ||
          msg.includes("offline") ||
          msg.includes("fetch");

        // retry once for network-related issues only
        return isNetworkError && failureCount < 1;
      },

      retryDelay: 1500,

      // sensible defaults for mobile
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },

    mutations: {
      retry: false, // ❌ mutations should almost never auto-retry
    },
  },
});
