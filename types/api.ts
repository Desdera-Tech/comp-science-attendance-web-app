import { Order } from ".";

export type ApiEnvelope<T> = {
  message: string;
  data?: T;
  error?: string;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TableQuery = {
  page: number;
  size: number;
  search: string;
  order: Order;
};
