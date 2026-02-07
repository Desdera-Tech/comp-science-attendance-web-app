import { TableQuery } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addStudent,
  deleteStudent,
  editStudent,
  getStudent,
  getStudents,
} from "../services/student";

export function useStudents(q: TableQuery) {
  return useQuery({
    queryKey: ["students", q],
    queryFn: async () => {
      const response = await getStudents(q);
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch users");
    },
  });
}

export function useAddStudent() {
  return useMutation({
    mutationFn: addStudent,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while adding the student. Please try again.",
      );
    },
  });
}

export function useStudentInfo(id: string) {
  return useQuery({
    queryKey: ["student-info", id],
    queryFn: async () => {
      const response = await getStudent(id);
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Error fetching Student info");
    },
  });
}

export function useEditStudent() {
  return useMutation({
    mutationFn: editStudent,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while updating the student. Please try again.",
      );
    },
  });
}

export function useDeleteStudent() {
  return useMutation({
    mutationFn: deleteStudent,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while removing the student. Please try again.",
      );
    },
  });
}
