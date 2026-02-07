import { TableQuery } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addAdmin,
  deleteAdmin,
  editAdmin,
  getAdmin,
  getAdmins,
} from "../services/admin";

export function useAdmins(q: TableQuery) {
  return useQuery({
    queryKey: ["admins", q],
    queryFn: async () => {
      const response = await getAdmins(q);
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch admins");
    },
  });
}

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

export function useAdminInfo(id: string) {
  return useQuery({
    queryKey: ["admin-info", id],
    queryFn: async () => {
      const response = await getAdmin(id);
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Error fetching Admin info");
    },
  });
}

export function useEditAdmin() {
  return useMutation({
    mutationFn: editAdmin,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while updating the admin. Please try again.",
      );
    },
  });
}

export function useDeleteAdmin() {
  return useMutation({
    mutationFn: deleteAdmin,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while removing the admin. Please try again.",
      );
    },
  });
}
