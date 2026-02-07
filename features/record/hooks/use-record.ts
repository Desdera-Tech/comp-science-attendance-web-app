import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addRecord,
  deleteRecord,
  deleteRecordEntry,
  deleteRecordLink,
  editRecord,
  generateRecordLink,
  getRecordEntries,
  getRecordLinks,
  getRecords,
  verifyRecordLink,
} from "../services/record";
import { RecordEntryQuery, RecordLinkQuery, RecordQuery } from "../types";

export function useRecords(isAdmin: boolean, q: RecordQuery) {
  return useQuery({
    queryKey: ["records", q],
    queryFn: async () => {
      const response = await getRecords({ q, isAdmin });
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch records");
    },
  });
}

export function useRecordEntries(id: string, q: RecordEntryQuery) {
  return useQuery({
    queryKey: ["record-entries", id, q],
    queryFn: async () => {
      const response = await getRecordEntries(id, q);
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch record entries");
    },
  });
}

export function useRecordLinks(id: string, q: RecordLinkQuery) {
  return useQuery({
    queryKey: ["record-links", id, q],
    queryFn: async () => {
      const response = await getRecordLinks(id, q);
      if (response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch record links");
    },
  });
}

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

export function useEditRecord() {
  return useMutation({
    mutationFn: editRecord,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while updating the record. Please try again.",
      );
    },
  });
}

export function useDeleteRecord() {
  return useMutation({
    mutationFn: deleteRecord,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while removing the record. Please try again.",
      );
    },
  });
}

export function useDeleteRecordEntry() {
  return useMutation({
    mutationFn: deleteRecordEntry,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while removing the entry. Please try again.",
      );
    },
  });
}

export function useGenerateRecordLink() {
  return useMutation({
    mutationFn: generateRecordLink,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while generating the link. Please try again.",
      );
    },
  });
}

export function useVerifyRecordLink() {
  return useMutation({
    mutationFn: verifyRecordLink,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while verifying the link. Please try again.",
      );
    },
  });
}

export function useDeleteRecordLink() {
  return useMutation({
    mutationFn: deleteRecordLink,
    onError(error) {
      console.error(error);
      toast.error(
        "An error occurred while removing the link. Please try again.",
      );
    },
  });
}
