import { api } from "@/lib/http/api";
import { exceptionHandler } from "@/lib/http/exception";
import { AddRecordFormValues } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { RecordData } from "../types";

export async function addRecord(
  data: AddRecordFormValues,
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
