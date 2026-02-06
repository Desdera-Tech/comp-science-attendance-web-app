import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addStudent } from "../services/student";

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
