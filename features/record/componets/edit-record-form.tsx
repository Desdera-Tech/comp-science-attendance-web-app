"use client";

import Branding from "@/components/branding";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RecordFormValues, recordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BsFillFileEarmarkExcelFill,
  BsFillFileEarmarkPdfFill,
} from "react-icons/bs";
import { toast } from "sonner";
import { useDeleteRecord, useEditRecord } from "../hooks/use-record";
import { exportRecord } from "../services/record";
import { RecordData } from "../types";

export function EditRecordForm({
  className,
  record,
  ...props
}: React.ComponentProps<"div"> & { record: RecordData }) {
  const router = useRouter();

  const { data } = useSession();
  const role = data?.user.role;

  const { mutateAsync: editRecord } = useEditRecord();
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteRecord();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const { id, title } = record;

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      title,
    },
  });

  const onSubmit = async (data: RecordFormValues) => {
    await editRecord(
      { id, ...data },
      {
        onSuccess: async (response) => {
          const { error, message } = response;
          if (error) {
            toast.error(message);
          } else {
            reset();
            toast.success(message);
          }
        },
      },
    );
  };

  const onDeleteRecord = async () => {
    if (isDeleting) return;
    await deleteRecord(id, {
      onSuccess: async (response) => {
        const { error, message } = response;
        if (error) {
          toast.error(message);
        } else {
          router.push("/admin/records");
          toast.success(message);
        }
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Edit Record</CardTitle>
            <CardDescription>Edit this record&apos;s title</CardDescription>
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExportDialogOpen(true)}
              title="Export record"
            >
              <Upload />
            </Button>
            {role === "SUPER_ADMIN" && (
              <Button
                loading={isDeleting}
                variant="ghost"
                size="icon"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2Icon className="text-destructive" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col gap-7 px-6">
                <Controller
                  control={control}
                  name="title"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id="title"
                        type="text"
                        label="Title"
                        placeholder="Enter the Record title"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={fieldState.error}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
                <Field className="col-span-full">
                  <Button loading={isSubmitting} type="submit">
                    Save
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant="outline"
                      type="button"
                      asChild
                    >
                      <Link href={`/admin/records/${id}/entries`}>
                        View Entries
                      </Link>
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      type="button"
                      asChild
                    >
                      <Link href={`/admin/records/${id}/links`}>
                        View Links
                      </Link>
                    </Button>
                  </div>
                </Field>
              </div>
              <Branding />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this record, and all entries associated with it.
              This is irreversible, are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDeleteRecord}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ExportDialog
        id={id}
        open={exportDialogOpen}
        setOpen={setExportDialogOpen}
      />
    </div>
  );
}

function ExportDialog({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [isPdfPending, setIsPdfPending] = useState(false);
  const [isExcelPending, setIsExcelPending] = useState(false);
  const isPending = isPdfPending || isExcelPending;

  const onExport = async (id: string, format: "pdf" | "excel") => {
    if (format === "pdf") {
      setIsPdfPending(true);
    } else {
      setIsExcelPending(true);
    }

    try {
      const res = await exportRecord({ id, format });

      const blob = res.data;

      // Extract filename from Content-Disposition
      const disposition = res.headers["content-disposition"];
      let filename = `record.${format}`;

      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = filename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error("An error occurred while exporting the record");
      console.error(e);
    } finally {
      setIsPdfPending(false);
      setIsExcelPending(false);
    }
  };

  const onClose = (open: boolean) => {
    if (isPending) return;

    if (!open) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col bg-card max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Export Record</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            disabled={isPending}
            loading={isPdfPending}
            onClick={() => onExport(id, "pdf")}
          >
            <BsFillFileEarmarkPdfFill className="text-destructive" /> Export to
            PDF
          </Button>
          <Button
            variant="outline"
            disabled={isPending}
            loading={isExcelPending}
            onClick={() => onExport(id, "excel")}
          >
            <BsFillFileEarmarkExcelFill className="text-green-500" /> Export to
            Excel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
