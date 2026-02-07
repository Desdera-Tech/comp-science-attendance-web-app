"use client";

import { formatWholeNumber } from "@/lib/utils";
import { useStudentAnalyticsInfo } from "../hooks/use-analytics";
import { AnalyticCard, AnalyticCardSkeleton } from "./analytic-card";

export function StudentAnalytics({
  initialRecords,
}: {
  initialRecords: number;
}) {
  const { data, isPending } = useStudentAnalyticsInfo({
    records: initialRecords,
  });

  if (isPending) {
    return <AnalyticCardSkeleton />;
  }

  const records = formatWholeNumber(data?.records || 0);

  return <AnalyticCard title="Records" value={records} />;
}
