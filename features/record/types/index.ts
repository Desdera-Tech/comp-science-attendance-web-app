import { LinkType } from "@/generated/prisma/enums";
import { Order } from "@/types";

export type RecordData = {
  id: string;
  title: string;
  entries: number;
  links: number;
  createdAt: Date;
};

export type RecordLink = {
  id: string;
  recordId: string;
  type: LinkType;
  createdAt: Date;
};

export type RecordEntry = {
  id: string;
  recordId: string;
  userId: string;
  name: string;
  matricNo: string;
  createdAt: Date;
};

export type RecordQuery = {
  page: number;
  size: number;
  search: string;
  order: Order;
  from?: string;
  to?: string;
};

export type RecordEntryQuery = {
  page: number;
  size: number;
  search: string;
  order: Order;
};

export type RecordLinkQuery = {
  page: number;
  size: number;
  order: Order;
};
