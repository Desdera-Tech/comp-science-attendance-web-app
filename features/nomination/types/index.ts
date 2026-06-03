import { Order } from "@/types";

export type NominationQuery = {
  page: number;
  size: number;
  search: string;
  order: Order;
  from?: string;
  to?: string;
};

export type NominationListData = {
  id: string;
  title: string;
  description: string | null;
  nominations: number;
  createdAt: Date;
};

export type NominationData = {
  nominationListId: string;
  nominationListTitle: string;
  nomineeId: string;
  nomineeName: string;
  nominations: number;
};

export type NominatedByData = {
  id: string;
  nominationListId: string;
  nomineeId: string;
  nomineeName: string;
  nominatedById: string;
  nominatedByName: string;
  createdAt: Date;
};
