import { api } from "@/lib/http/api";
import { exceptionHandler } from "@/lib/http/exception";
import { AddStudentFormValues } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { Student } from "../types";

export async function addStudent(
  data: AddStudentFormValues,
): Promise<ApiEnvelope<Student>> {
  try {
    const res = await api.post<ApiEnvelope<Student>>(
      "/api/auth/add-student",
      data,
    );
    return res.data;
  } catch (err) {
    return exceptionHandler(err);
  }
}
