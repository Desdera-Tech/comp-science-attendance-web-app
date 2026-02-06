"use client";

import { formatWholeNumber } from "@/lib/utils";
import { useAdminAnalyticsInfo } from "../hooks/use-analytics";
import { AnalyticCard, AnalyticCardSkeleton } from "./analytic-card";

export function AdminAnalytics() {
  const { data, isPending } = useAdminAnalyticsInfo();

  if (isPending) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <AnalyticCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const students = formatWholeNumber(data?.students || 0);
  const admins = formatWholeNumber(data?.admins || 0);
  const records = formatWholeNumber(data?.records || 0);

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <AnalyticCard title="Students" value={students} />
      <AnalyticCard title="Admins" value={admins} />
      <AnalyticCard title="Records" value={records} />
    </div>
  );
}
