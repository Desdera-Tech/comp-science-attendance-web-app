"use client";

import { ChevronDownIcon, LucideCalendarRange } from "lucide-react";
import { useState } from "react";
import { DateRange as DateRangeDayPicker } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DateRangeProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  dateRange?: DateRangeDayPicker;
  setDateRange: (range?: DateRangeDayPicker) => void;
  numberOfMonths?: number;
}

export type DateRange = DateRangeDayPicker;

export function DateRange({
  open,
  setOpen,
  dateRange,
  setDateRange,
  numberOfMonths = 1,
}: DateRangeProps) {
  const [dropdown] =
    useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown",
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="justify-between font-normal"
        >
          <LucideCalendarRange className="size-4" />
          {dateRange
            ? dateRange.from?.toLocaleDateString() +
              " - " +
              dateRange.to?.toLocaleDateString()
            : "Select date range"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={(dateRange) => {
            setDateRange(dateRange);
            setOpen(false);
          }}
          captionLayout={dropdown}
          numberOfMonths={numberOfMonths}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
}
