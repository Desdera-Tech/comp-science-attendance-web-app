import { LinkType } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import { exceptionHandler } from "@/lib/api/exception";
import { AddRecordEntryFormValues, RecordFormValues } from "@/lib/validation";
import { ApiEnvelope, PageResponse } from "@/types/api";
import {
  RecordData,
  RecordEntryQuery,
  RecordLink,
  RecordLinkQuery,
  RecordQuery,
} from "../types";

function toQueryString(q: RecordQuery) {
  const params = new URLSearchParams();

  params.set("page", String(q.page));
  params.set("limit", String(q.size));
  params.set("search", q.search ?? "");
  params.set("order", q.order);

  if (q.from && q.to) {
    if (q.from) params.set("from", q.from);
    if (q.to) params.set("to", q.to);
  }

  return params.toString();
}

export async function getRecords({
  q,
  isAdmin,
}: {
  q: RecordQuery;
  isAdmin: boolean;
}): Promise<ApiEnvelope<PageResponse<RecordData>>> {
  const qs = toQueryString(q);

  try {
    const res = await api.get<ApiEnvelope<PageResponse<RecordData>>>(
      `/api/record/${isAdmin ? "admin" : "student"}?${qs}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function getRecordEntries(
  id: string,
  query: RecordEntryQuery,
): Promise<ApiEnvelope<PageResponse<RecordLink>>> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.size));
  params.set("search", query.search ?? "");
  params.set("order", query.order);

  try {
    const res = await api.get<ApiEnvelope<PageResponse<RecordLink>>>(
      `/api/record/${id}/entries?${params}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function getRecordLinks(
  id: string,
  query: RecordLinkQuery,
): Promise<ApiEnvelope<PageResponse<RecordLink>>> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.size));
  params.set("order", query.order);

  try {
    const res = await api.get<ApiEnvelope<PageResponse<RecordLink>>>(
      `/api/record/${id}/links?${params}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function addRecord(
  data: RecordFormValues,
): Promise<ApiEnvelope<RecordData>> {
  try {
    const res = await api.post<ApiEnvelope<RecordData>>(
      "/api/record/add",
      data,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function editRecord({
  id,
  ...data
}: RecordFormValues & { id: string }): Promise<ApiEnvelope<RecordData>> {
  try {
    const res = await api.post<ApiEnvelope<RecordData>>(
      `/api/record/${id}`,
      data,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function deleteRecord(id: string): Promise<ApiEnvelope<any>> {
  try {
    const res = await api.delete<ApiEnvelope<any>>(`/api/record/${id}`);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function addRecordEntry({
  id,
  ...data
}: AddRecordEntryFormValues & { id: string }): Promise<
  ApiEnvelope<RecordData>
> {
  try {
    const res = await api.post<ApiEnvelope<RecordData>>(
      `/api/record/${id}/entries/add`,
      data,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function deleteRecordEntry({
  id,
  entryId,
}: {
  id: string;
  entryId: string;
}): Promise<ApiEnvelope<any>> {
  try {
    const res = await api.delete<ApiEnvelope<any>>(
      `/api/record/${id}/entries/${entryId}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function generateRecordLink({
  id,
  type,
}: {
  id: string;
  type: LinkType;
}): Promise<ApiEnvelope<string>> {
  try {
    const res = await api.post<ApiEnvelope<string>>(
      `/api/record/${id}/links/generate-link`,
      { type },
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function verifyRecordLink(
  id: string,
): Promise<ApiEnvelope<string>> {
  try {
    const res = await api.patch<ApiEnvelope<string>>(
      `/api/record/verify-link/${id}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function deleteRecordLink({
  id,
  linkId,
}: {
  id: string;
  linkId: string;
}): Promise<ApiEnvelope<any>> {
  try {
    const res = await api.delete<ApiEnvelope<any>>(
      `/api/record/${id}/links/${linkId}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function exportRecord({
  id,
  format,
}: {
  id: string;
  format: "pdf" | "excel";
}) {
  return api.get(`/api/record/${id}/export?format=${format}`, {
    responseType: "blob",
  });
}
