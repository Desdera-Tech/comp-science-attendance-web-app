"use client";

import { formatWholeNumber } from "@/lib/utils";
import { useAdminAnalyticsInfo } from "../hooks/use-analytics";
import { AnalyticCard, AnalyticCardSkeleton } from "./analytic-card";

export function AdminAnalytics() {
  const { data, isPending } = useAdminAnalyticsInfo();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <AnalyticCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const students = formatWholeNumber(data?.students || 0);
  const admins = formatWholeNumber(data?.admins || 0);
  const records = formatWholeNumber(data?.records || 0);
  const nominations = formatWholeNumber(data?.nominations || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <AnalyticCard title="Students" value={students} />
      <AnalyticCard title="Admins" value={admins} />
      <AnalyticCard title="Records" value={records} />
      <AnalyticCard title="Nominations" value={nominations} />
    </div>
  );
}
