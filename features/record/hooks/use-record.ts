import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addRecord } from "../services/record";

export function useAddRecord() {
  return useMutation({
    mutationFn: addRecord,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while adding the record. Please try again.",
      );
    },
  });
}
