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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EditStudentFormValues, editStudentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDeleteStudent, useEditStudent } from "../hooks/use-student";
import { Student } from "../types";

export function EditStudentForm({
  className,
  student,
  ...props
}: React.ComponentProps<"div"> & { student: Student }) {
  const router = useRouter();

  const { mutateAsync: editStudent } = useEditStudent();
  const { mutateAsync: deleteStudent, isPending: isDeleting } =
    useDeleteStudent();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { id, firstName, middleName, lastName, username } = student;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditStudentFormValues>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      firstName,
      middleName: middleName || "",
      lastName,
      username,
    },
  });

  const onSubmit = async (data: EditStudentFormValues) => {
    await editStudent(
      { id, ...data },
      {
        onSuccess: async (response) => {
          const { error, message } = response;
          if (error) {
            toast.error(message);
          } else {
            toast.success(message);
          }
        },
      },
    );
  };

  const onDeleteStudent = async () => {
    if (isDeleting) return;
    await deleteStudent(id, {
      onSuccess: async (response) => {
        const { error, message } = response;
        if (error) {
          toast.error(message);
        } else {
          router.push("/admin/admins");
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
            <CardTitle>Edit Student</CardTitle>
            <CardDescription>
              Edit this student&apos;s information
            </CardDescription>
          </div>
          <Button
            loading={isDeleting}
            variant="ghost"
            size="icon"
            onClick={() => setDialogOpen(true)}
          >
            <Trash2Icon className="text-destructive" />
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 px-6">
                <Controller
                  control={control}
                  name="firstName"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id="firstName"
                        type="text"
                        label="First Name"
                        placeholder="Enter Student first name"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={fieldState.error}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="middleName"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id="middleName"
                        type="text"
                        label="Middle Name"
                        placeholder="Enter Student middle name"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={fieldState.error}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id="lastName"
                        type="text"
                        label="Last Name"
                        placeholder="Enter Student last name"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={fieldState.error}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="username"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id="username"
                        type="text"
                        label="Matric No"
                        placeholder="Enter a Matric No"
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
                </Field>
              </div>
              <Branding />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this student, and all their record history. This
              is irreversible, are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDeleteStudent}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
