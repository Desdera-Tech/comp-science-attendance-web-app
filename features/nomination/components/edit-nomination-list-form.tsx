"use client";

import Branding from "@/components/branding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NominationFormValues, nominationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { NominationListData } from "../types";

export default function EditNominationListForm({
  className,
  list,
  ...props
}: React.ComponentProps<"div"> & {
  list: NominationListData;
}) {
  const { id, title, description, nominations, createdAt } = list;

  const { control } = useForm<NominationFormValues>({
    resolver: zodResolver(nominationSchema),
    defaultValues: {
      title,
      description: description || "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Nomination List</CardTitle>
            <CardDescription>
              Created on {formatDate(createdAt, "MMM dd, yyyy")}
            </CardDescription>
          </div>
          <div className="flex">
            {/* <Button
                  loading={isDeleting}
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2Icon className="text-destructive" />
                </Button> */}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <form>
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
                        readOnly
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id="description"
                        type="text"
                        label="Description"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={fieldState.error}
                        aria-invalid={fieldState.invalid}
                        readOnly
                      />
                    </Field>
                  )}
                />
                <Field className="col-span-full">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant="outline"
                      type="button"
                      asChild
                    >
                      <Link href={`/admin/nominations/${id}/nominations`}>
                        View Nominations ({nominations})
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
    </div>
  );
}
