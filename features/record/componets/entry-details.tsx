"use client";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteRecordEntry } from "../hooks/use-record";
import { RecordEntry } from "../types";

export function EntryDetails({
  className,
  entry,
  recordTitle,
  ...props
}: React.ComponentProps<"div"> & { entry: RecordEntry; recordTitle: string }) {
  const router = useRouter();

  const { id: entryId, recordId, name, matricNo } = entry;

  const { mutateAsync: deleteEntry, isPending: isDeleting } =
    useDeleteRecordEntry();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onDeleteEntry = async () => {
    if (isDeleting) return;
    await deleteEntry(
      { id: recordId, entryId },
      {
        onSuccess: async (response) => {
          const { error, message } = response;
          if (error) {
            toast.error(message);
          } else {
            router.push(`/admin/records/${recordId}/entries`);
            toast.success(message);
          }
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Manage Entry</CardTitle>
            <CardDescription>
              This is an entry for the record list:{" "}
              <Link href={`/admin/records/${recordId}/entries`}>
                {recordTitle}
              </Link>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <Input id="link" label="Name" type="text" value={name} readOnly />
          <Input
            id="link"
            label="Matric No."
            type="text"
            value={matricNo}
            readOnly
          />
          <Button
            variant="destructive"
            title="Remove entry"
            className="w-full"
            onClick={() => setDialogOpen(true)}
            loading={isDeleting}
          >
            Remove Entry
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this student from the record list. This is
              irreversible, are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDeleteEntry}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
