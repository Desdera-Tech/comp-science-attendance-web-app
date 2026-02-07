"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";

export default function TablePagination<TData>({
  table,
  totalResults,
}: {
  table: Table<TData>;
  totalResults: number;
}) {
  const { pageIndex, pageSize } = table.getState().pagination;

  const pageCount =
    typeof table.getPageCount === "function"
      ? table.getPageCount()
      : Math.ceil(totalResults / pageSize);

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  // 1-based for display
  const currentPage = pageIndex + 1;

  // Keep the "Page x of y" stable even if pageCount is 0
  const safePageCount = Math.max(pageCount, 1);

  // Small helper to avoid invalid jumps
  const goto = (n: number) => {
    const next = Math.min(Math.max(n, 1), safePageCount);
    table.setPageIndex(next - 1);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {totalResults === 0 ? 0 : pageIndex * pageSize + 1}
        </span>{" "}
        –{" "}
        <span className="font-medium text-foreground">
          {Math.min((pageIndex + 1) * pageSize, totalResults)}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {totalResults.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Page size */}
        <Select
          value={String(pageSize)}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="h-9 w-30">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            {[1, 10, 20, 30, 50, 100].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Controls */}
        <Button
          variant="outline"
          className="h-9"
          onClick={() => table.setPageIndex(0)}
          disabled={!canPrev}
        >
          First
        </Button>
        <Button
          variant="outline"
          className="h-9"
          onClick={() => table.previousPage()}
          disabled={!canPrev}
        >
          Prev
        </Button>

        <div className="px-2 text-sm">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{safePageCount}</span>
        </div>

        <Button
          variant="outline"
          className="h-9"
          onClick={() => table.nextPage()}
          disabled={!canNext}
        >
          Next
        </Button>
        <Button
          variant="outline"
          className="h-9"
          onClick={() => table.setPageIndex(safePageCount - 1)}
          disabled={!canNext}
        >
          Last
        </Button>

        {/* Jump to page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Go to</span>
          <input
            className="h-9 w-16 rounded-md border bg-background px-2 text-sm"
            type="number"
            min={1}
            max={safePageCount}
            defaultValue={currentPage}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const val = Number((e.target as HTMLInputElement).value);
              if (!Number.isFinite(val)) return;
              goto(val);
            }}
          />
        </div>
      </div>
    </div>
  );
}
