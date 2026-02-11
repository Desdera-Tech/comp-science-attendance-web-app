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
import {
  AddRecordEntryFormValues,
  addRecordEntrySchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAddRecordEntry } from "../hooks/use-record";

export function AddRecordEntryForm({
  className,
  recordId,
  ...props
}: React.ComponentProps<"div"> & { recordId: string }) {
  const { mutateAsync: addRecordEntry } = useAddRecordEntry();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AddRecordEntryFormValues>({
    resolver: zodResolver(addRecordEntrySchema),
    defaultValues: {
      matricNo: "",
    },
  });

  const onSubmit = async (data: AddRecordEntryFormValues) => {
    await addRecordEntry(
      { ...data, id: recordId },
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Add Entry</CardTitle>
          <CardDescription>
            Add a student to the record by entering their matric number.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col gap-7 px-6">
                <Controller
                  control={control}
                  name="matricNo"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id="matricNo"
                        type="text"
                        label="Matric Number"
                        placeholder="Enter the student's matric number"
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
                    Add Entry
                  </Button>
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
