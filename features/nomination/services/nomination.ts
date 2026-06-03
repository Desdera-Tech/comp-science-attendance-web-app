import { api } from "@/lib/api";
import { exceptionHandler } from "@/lib/api/exception";
import { NominationFormValues } from "@/lib/validation";
import { ApiEnvelope, PageResponse } from "@/types/api";
import { NominationData, NominationListData, NominationQuery } from "../types";

function toQueryString(q: NominationQuery) {
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

export async function getNominationsList({
  q,
}: {
  q: NominationQuery;
}): Promise<ApiEnvelope<PageResponse<NominationListData>>> {
  const qs = toQueryString(q);

  try {
    const res = await api.get<ApiEnvelope<PageResponse<NominationListData>>>(
      `/api/nomination?${qs}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function getNominations({
  id,
  q,
}: {
  id: string;
  q: NominationQuery;
}): Promise<ApiEnvelope<PageResponse<NominationData>>> {
  const qs = toQueryString(q);

  try {
    const res = await api.get<ApiEnvelope<PageResponse<NominationData>>>(
      `/api/nomination/${id}/nominations?${qs}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function addNominationList(
  data: NominationFormValues,
): Promise<ApiEnvelope<NominationData>> {
  try {
    const res = await api.post<ApiEnvelope<NominationData>>(
      "/api/nomination",
      data,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}
