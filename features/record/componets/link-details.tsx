"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteRecordLink } from "../hooks/use-record";
import { RecordLink } from "../types";

export function LinkDetails({
  className,
  link,
  ...props
}: React.ComponentProps<"div"> & { link: RecordLink }) {
  const router = useRouter();

  const { id: linkId, recordId, type } = link;
  const [isCopied, setIsCopied] = useState(false);

  const { mutateAsync: deleteLink, isPending: isDeleting } =
    useDeleteRecordLink();

  const handleCopy = async () => {
    if (isCopied) return;

    const message = `Please join the record list by going to your portal at\n${BASE_URL}/student, and pasting the link below\n\n${BASE_URL}/student/verify-link/${linkId}`;

    try {
      await navigator.clipboard.writeText(message);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const onDeleteLink = async () => {
    if (isDeleting) return;
    await deleteLink(
      { id: recordId, linkId },
      {
        onSuccess: async (response) => {
          const { error, message } = response;
          if (error) {
            toast.error(message);
          } else {
            router.push(`/admin/records/${recordId}/links`);
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
            <CardTitle>Manage Link</CardTitle>
            <CardDescription>
              Copy link for a student, or remove entirely
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex gap-2 px-6">
          <div className="flex-1">
            <Input
              id="link"
              type="text"
              placeholder="Link"
              value={linkId}
              readOnly
            />
          </div>
          <Input
            id="type"
            type="text"
            placeholder="Link type"
            value={type}
            readOnly
          />
          <Button
            variant="outline"
            size="icon"
            title="Copy link"
            onClick={handleCopy}
            disabled={isCopied}
          >
            {isCopied ? <CheckIcon /> : <ClipboardIcon />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            title="Remove link"
            onClick={onDeleteLink}
            loading={isDeleting}
          >
            <Trash2Icon />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
