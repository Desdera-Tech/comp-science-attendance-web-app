import { api } from "@/lib/http/api";
import { exceptionHandler } from "@/lib/http/exception";
import { AddAdminFormValues } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { Admin } from "../types";

export async function addAdmin(
  data: AddAdminFormValues,
): Promise<ApiEnvelope<Admin>> {
  try {
    const res = await api.post<ApiEnvelope<Admin>>("/api/auth/add-admin", data);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}
