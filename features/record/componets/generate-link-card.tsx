"use client";

import Branding from "@/components/branding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGenerateRecordLink } from "../hooks/use-record";
import { RecordData } from "../types";

export function GenerateLinkCard({
  className,
  record,
  ...props
}: React.ComponentProps<"div"> & { record: RecordData }) {
  const { id } = record;
  const { mutateAsync: generateLink, isPending: isGenerating } =
    useGenerateRecordLink();

  const [linkId, setLinkId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const onGenerateLink = async () => {
    if (isGenerating) return;
    setLinkId("");

    await generateLink(id, {
      onSuccess: async (response) => {
        const { error, message, data } = response;
        if (error) {
          toast.error(message);
        } else {
          setLinkId(data || "");
          toast.success(message);
        }
      },
    });
  };

  const handleCopy = async () => {
    if (isCopied) return;

    const message = `
    Please join the record list by logging into your portal at
    ${BASE_URL}, and going to your dashboard and paste the link below
    
    ${BASE_URL}/student/verify-link/${linkId}
    `;

    try {
      await navigator.clipboard.writeText(message);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Generate Link</CardTitle>
            <CardDescription>
              Generate a link for students to use to join the record entries
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex gap-2 px-6">
          <div className="flex-1">
            <Input
              id="link"
              type="text"
              placeholder="Generate a new link"
              value={linkId}
              readOnly
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            title="Genrate link"
            loading={isGenerating}
            onClick={onGenerateLink}
          >
            <RefreshCcw />
          </Button>
          {linkId && (
            <Button
              variant="outline"
              size="icon"
              title="Copy link"
              onClick={handleCopy}
              disabled={isCopied}
            >
              {isCopied ? <CheckIcon /> : <ClipboardIcon />}
            </Button>
          )}
        </CardContent>
        <CardFooter className="px-0">
          <Branding />
        </CardFooter>
      </Card>
    </div>
  );
}
