"use client";

import { DateRangeType, Order, RangeValue } from "@/types";
import type { SortingState } from "@tanstack/react-table";
import { addDays, startOfDay } from "date-fns";
import * as React from "react";

export function useRecordsTableState() {
  const [search, setSearch] = React.useState("");
  const [order, setOrder] = React.useState<Order>("DESC");

  const [rangeValue, setRangeValue] = React.useState<RangeValue>("all_time");
  const [dateRange, setDateRange] = React.useState<DateRangeType | undefined>(
    undefined,
  );
  const [rangeOpen, setRangeOpen] = React.useState(false);

  // TanStack state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  const fromTime = dateRange?.from?.getTime();
  const toTime = dateRange?.to?.getTime();

  const handleRangeChange = (v: string) => {
    const value = v as RangeValue;
    setRangeValue(value);

    const today = startOfDay(new Date());

    if (value === "all_time") {
      setDateRange(undefined);
      setRangeOpen(false);
      return;
    }

    if (value === "days_7") {
      setDateRange({ from: addDays(today, -6), to: today });
      setRangeOpen(false);
      return;
    }

    // custom_range
    setDateRange((prev) => prev ?? { from: addDays(today, -6), to: today });
    setRangeOpen(true);
  };

  // When filters change, reset to first page (common expected behavior)
  React.useEffect(() => {
    setPageIndex(0);
  }, [search, order, rangeValue, fromTime, toTime]);

  return {
    // filters UI state
    search,
    setSearch,
    order,
    setOrder,
    rangeValue,
    setRangeValue,
    dateRange,
    setDateRange,
    rangeOpen,
    setRangeOpen,
    handleRangeChange,

    // table state
    sorting,
    setSorting,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
  };
}

export function useRecordEntriesTableState() {
  const [search, setSearch] = React.useState("");
  const [order, setOrder] = React.useState<Order>("DESC");

  // TanStack state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  // When filters change, reset to first page (common expected behavior)
  React.useEffect(() => {
    setPageIndex(0);
  }, [search, order]);

  return {
    // filters UI state
    search,
    setSearch,
    order,
    setOrder,

    // table state
    sorting,
    setSorting,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
  };
}

export function useRecordLinksTableState() {
  const [order, setOrder] = React.useState<Order>("DESC");

  // TanStack state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  // When filters change, reset to first page (common expected behavior)
  React.useEffect(() => {
    setPageIndex(0);
  }, [order]);

  return {
    // filters UI state
    order,
    setOrder,

    // table state
    sorting,
    setSorting,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
  };
}
