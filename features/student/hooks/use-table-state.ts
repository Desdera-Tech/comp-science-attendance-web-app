"use client";

import { Order } from "@/types";
import type { SortingState } from "@tanstack/react-table";
import * as React from "react";

export function useTableState() {
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
