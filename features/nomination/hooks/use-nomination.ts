import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addNominationList,
  deleteNominationList,
  getNominations,
  getNominationsList,
  getStudentNominations,
} from "../services/nomination";
import { NominationQuery } from "../types";

export function useNominationsList(q: NominationQuery) {
  return useQuery({
    queryKey: ["nominations-list", q],
    queryFn: async () => {
      const response = await getNominationsList({ q });
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch nominations list");
    },
  });
}

export function useNominations(id: string, q: NominationQuery) {
  return useQuery({
    queryKey: ["nominations", id, q],
    queryFn: async () => {
      const response = await getNominations({ id, q });
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch nominations");
    },
  });
}

export function useStudentNominations(q: NominationQuery) {
  return useQuery({
    queryKey: ["student-nominations", q],
    queryFn: async () => {
      const response = await getStudentNominations({ q });
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch nominations");
    },
  });
}

export function useAddNominationList() {
  return useMutation({
    mutationFn: addNominationList,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while adding the nomination. Please try again.",
      );
    },
  });
}

export function useDeleteNominationList() {
  return useMutation({
    mutationFn: deleteNominationList,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while removing the nomination. Please try again.",
      );
    },
  });
}
