import { Option, Order } from "@/types";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const DATE_RANGE_OPTIONS: Option[] = [
  { label: "All Time", value: "all_time" },
  { label: "Last 7 Days", value: "days_7" },
  { label: "Custom Range", value: "custom_range" },
];

export type FilterItem<T> = {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  value: T;
};

export const orderFilterData: FilterItem<Order>[] = [
  { Icon: IconSortAscending, label: "Ascending", value: "ASC" },
  { Icon: IconSortDescending, label: "Descending", value: "DESC" },
];
