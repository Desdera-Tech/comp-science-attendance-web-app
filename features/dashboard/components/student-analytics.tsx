"use client";

import { formatWholeNumber } from "@/lib/utils";
import { useStudentAnalyticsInfo } from "../hooks/use-analytics";
import { AnalyticCard, AnalyticCardSkeleton } from "./analytic-card";

export function StudentAnalytics({
  initialRecords,
  initialNominations,
}: {
  initialRecords: number;
  initialNominations: number;
}) {
  const { data, isPending } = useStudentAnalyticsInfo({
    records: initialRecords,
    nominations: initialNominations,
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        <AnalyticCardSkeleton />
        <AnalyticCardSkeleton />
      </div>
    );
  }

  const records = formatWholeNumber(data?.records || 0);

  return (
    <div className="space-y-4">
      <AnalyticCard title="Total Records" value={records} />
      <AnalyticCard
        title="Total Nominations"
        value={formatWholeNumber(data?.nominations || 0)}
      />
    </div>
  );
}
