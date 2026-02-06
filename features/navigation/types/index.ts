import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavGroupType = {
  [groupName: string]: NavParentType[];
};

export type NavParentType = {
  title: string;
  url?: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  items?: NavItemType[];
};

export type NavItemType = { title: string; url: string };
