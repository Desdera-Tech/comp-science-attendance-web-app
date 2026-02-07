import { api } from "@/lib/api";
import { exceptionHandler } from "@/lib/api/exception";
import { AddAdminFormValues, EditAdminFormValues } from "@/lib/validation";
import { ApiEnvelope, PageResponse, TableQuery } from "@/types/api";
import { Admin } from "../types";

function toQueryString(q: TableQuery) {
  const params = new URLSearchParams();

  params.set("page", String(q.page));
  params.set("limit", String(q.size));
  params.set("search", q.search ?? "");
  params.set("order", q.order);

  return params.toString();
}

export async function getAdmins(
  q: TableQuery,
): Promise<ApiEnvelope<PageResponse<Admin>>> {
  const qs = toQueryString(q);

  try {
    const res = await api.get<ApiEnvelope<PageResponse<Admin>>>(
      `/api/admin?${qs}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function addAdmin(
  data: AddAdminFormValues,
): Promise<ApiEnvelope<Admin>> {
  try {
    const res = await api.post<ApiEnvelope<Admin>>("/api/admin/add", data);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function getAdmin(id: string): Promise<ApiEnvelope<Admin>> {
  try {
    const res = await api.get<ApiEnvelope<Admin>>(`/api/admin/${id}`);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function editAdmin({
  id,
  ...data
}: EditAdminFormValues & { id: string }): Promise<ApiEnvelope<Admin>> {
  try {
    const res = await api.post<ApiEnvelope<Admin>>(`/api/admin/${id}`, data);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function deleteAdmin(id: string): Promise<ApiEnvelope<any>> {
  try {
    const res = await api.delete<ApiEnvelope<any>>(`/api/admin/${id}`);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}
