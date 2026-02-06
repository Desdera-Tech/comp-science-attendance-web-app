import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addAdmin } from "../services/admin";

export function useAddAdmin() {
  return useMutation({
    mutationFn: addAdmin,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while adding the admin. Please try again.",
      );
    },
  });
}
