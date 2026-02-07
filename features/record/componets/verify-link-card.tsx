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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VerifyLinkFormValues, verifyLinkSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ClipboardPasteIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useVerifyRecordLink } from "../hooks/use-record";

export function VerifyLinkCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const { mutateAsync: verifyLink } = useVerifyRecordLink();
  const [isPasted, setIsPasted] = useState(false);

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<VerifyLinkFormValues>({
    resolver: zodResolver(verifyLinkSchema),
    defaultValues: {
      link: "",
    },
  });

  const handlePaste = async () => {
    if (isPasted) return;

    try {
      const text = await navigator.clipboard.readText();
      setValue("link", text);

      setIsPasted(true);
      setTimeout(() => setIsPasted(false), 2000);
    } catch (err) {
      console.error("Failed to paste text: ", err);
    }
  };

  const onVerifyLink = async (values: VerifyLinkFormValues) => {
    await verifyLink(extractToken(values.link), {
      onSuccess: async (response) => {
        const { error, message, data: recordId } = response;
        if (error) {
          toast.error(message);
        } else {
          reset();
          toast.success(message);

          router.push(`/student/record/${recordId}`);
        }
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Verify Link</CardTitle>
            <CardDescription>
              Paste a record link to join the list of entries for a student
              record.{" "}
              <span className="font-semibold">
                Please ensure you&apos;re logged into your student account
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex gap-2 px-6">
          <form className="flex-1" onSubmit={handleSubmit(onVerifyLink)}>
            <div className="flex gap-2">
              <Controller
                control={control}
                name="link"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState,
                }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-1">
                    <Input
                      id="link"
                      type="text"
                      placeholder="Paste a record link here"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={fieldState.error}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
              <Button
                variant="outline"
                size="icon"
                title="Paste link"
                type="button"
                onClick={handlePaste}
                disabled={isPasted}
              >
                {isPasted ? <CheckIcon /> : <ClipboardPasteIcon />}
              </Button>
              <Button loading={isSubmitting} type="submit">
                Verify
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-0">
          <Branding />
        </CardFooter>
      </Card>
    </div>
  );
}

function extractToken(input: string): string {
  try {
    // If it's a valid URL, extract the last path segment
    const url = new URL(input);
    return url.pathname.split("/").filter(Boolean).pop()!;
  } catch {
    // Not a URL → assume it's already the token
    return input;
  }
}
