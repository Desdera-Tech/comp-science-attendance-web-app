"use client";

import FilterDropdown from "@/components/table/filter-dropdown";
import TablePagination from "@/components/table/table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/lib/debounce";
import { cn } from "@/lib/utils";
import { Order } from "@/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { EyeIcon, MoreVertical, RotateCwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStudents } from "../hooks/use-student";
import { useTableState } from "../hooks/use-table-state";
import { Student } from "../types";

const columns: ColumnDef<Student>[] = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "middleName", header: "Middle Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "username", header: "Matric Number" },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) => {
      const { createdAt } = row.original;

      return formatDate(createdAt, "dd MMMM yyyy, hh:mm:aa");
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/admin/students/${id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <EyeIcon /> View student
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export function StudentsTable() {
  const tableState = useTableState();

  const { data, isPending, isFetching, status, refetch } = useStudents({
    page: tableState.pageIndex,
    size: tableState.pageSize,
    search: tableState.search,
    order: tableState.order,
  });

  const total = data?.total || 0;
  const pageCount = data?.totalPages || 0;
  const rows = data?.items || [];

  const table = useReactTable({
    data: rows,
    columns: columns as ColumnDef<unknown, unknown>[],

    // IMPORTANT: manual because server-side
    manualPagination: true,
    pageCount,

    manualSorting: true,

    // You can also set manualFiltering: true, (even if not using column filters)
    manualFiltering: true,

    state: {
      sorting: tableState.sorting,
      pagination: {
        pageIndex: tableState.pageIndex,
        pageSize: tableState.pageSize,
      },
    },

    onSortingChange: tableState.setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({
              pageIndex: tableState.pageIndex,
              pageSize: tableState.pageSize,
            })
          : updater;

      tableState.setPageIndex(next.pageIndex);
      tableState.setPageSize(next.pageSize);
    },

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        search={tableState.search}
        setSearch={tableState.setSearch}
        order={tableState.order}
        setOrder={tableState.setOrder}
        isFetching={isFetching}
        refetch={refetch}
      />

      <div className="rounded-md bg-surface border overflow-x-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="p-3">
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-5 justify-center"
                >
                  <Spinner className="size-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((r) => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id} className="p-3">
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-5 text-center text-sm"
                >
                  {status === "error" && (
                    <div className="text-destructive">
                      An error occurred while fetching students
                    </div>
                  )}
                  {status === "success" && <div>No students found.</div>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} totalResults={total} />
    </div>
  );
}

function Toolbar(props: {
  search: string;
  setSearch: (v: string) => void;

  order: Order;
  setOrder: (v: Order) => void;

  isFetching: boolean;
  refetch: () => void;
}) {
  const { setSearch, order, setOrder, isFetching, refetch } = props;

  const [searchValue, setSearchValue] = useState("");
  const searchDebounced = useDebouncedValue(searchValue);

  useEffect(() => setSearch(searchDebounced), [searchDebounced, setSearch]);

  return (
    <div className="space-y-2">
      <Card className="py-4">
        <CardContent className="flex items-end justify-between px-4">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              className="min-w-62 h-9.5"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Name or Matric no"
            />
            <FilterDropdown order={order} setOrder={setOrder} />
            <Button type="button" variant="ghost" size="icon" onClick={refetch}>
              <RotateCwIcon
                className={cn("size-5", { "animate-spin": isFetching })}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
