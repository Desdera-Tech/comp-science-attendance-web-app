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
import { RecordFormValues, recordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAddRecord } from "../hooks/use-record";

export function AddRecordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutateAsync: addRecord } = useAddRecord();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: RecordFormValues) => {
    await addRecord(data, {
      onSuccess: async (response) => {
        const { error, message } = response;
        if (error) {
          toast.error(message);
        } else {
          reset();
          toast.success(message);
        }
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Add Record</CardTitle>
          <CardDescription>
            Create a new record and have student mark themselves
          </CardDescription>
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
                    Create
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
