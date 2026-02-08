import { api } from "@/lib/api";
import { exceptionHandler } from "@/lib/api/exception";
import {
  AddStudentFormValues,
  ChangePasswordFormValues,
  EditStudentFormValues,
} from "@/lib/validation";
import { ApiEnvelope, PageResponse, TableQuery } from "@/types/api";
import { Student } from "../types";

function toQueryString(q: TableQuery) {
  const params = new URLSearchParams();

  params.set("page", String(q.page));
  params.set("limit", String(q.size));
  params.set("search", q.search ?? "");
  params.set("order", q.order);

  return params.toString();
}

export async function getStudents(
  q: TableQuery,
): Promise<ApiEnvelope<PageResponse<Student>>> {
  const qs = toQueryString(q);

  try {
    const res = await api.get<ApiEnvelope<PageResponse<Student>>>(
      `/api/student?${qs}`,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function addStudent(
  data: AddStudentFormValues,
): Promise<ApiEnvelope<Student>> {
  try {
    const res = await api.post<ApiEnvelope<Student>>("/api/student/add", data);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function getStudent(id: string): Promise<ApiEnvelope<Student>> {
  try {
    const res = await api.get<ApiEnvelope<Student>>(`/api/student/${id}`);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function editStudent({
  id,
  ...data
}: EditStudentFormValues & { id: string }): Promise<ApiEnvelope<Student>> {
  try {
    const res = await api.post<ApiEnvelope<Student>>(
      `/api/student/${id}`,
      data,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function changeStudentPassword({
  id,
  ...data
}: ChangePasswordFormValues & { id: string }): Promise<ApiEnvelope<any>> {
  try {
    const res = await api.post<ApiEnvelope<any>>(
      `/api/student/${id}/change-password`,
      data,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}

export async function deleteStudent(id: string): Promise<ApiEnvelope<any>> {
  try {
    const res = await api.delete<ApiEnvelope<any>>(`/api/student/${id}`);
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}
