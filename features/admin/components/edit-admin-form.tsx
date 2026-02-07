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
import { EditAdminFormValues, editAdminSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDeleteAdmin, useEditAdmin } from "../hooks/use-admin";
import { Admin } from "../types";

export function EditAdminForm({
  className,
  admin,
  ...props
}: React.ComponentProps<"div"> & { admin: Admin }) {
  const router = useRouter();

  const { data } = useSession();
  const role = data?.user.role;

  const { mutateAsync: editAdmin } = useEditAdmin();
  const { mutateAsync: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { id, firstName, lastName, username } = admin;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditAdminFormValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      firstName,
      lastName,
      username,
    },
  });

  const onSubmit = async (data: EditAdminFormValues) => {
    await editAdmin(
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

  const onDeleteAdmin = async () => {
    if (isDeleting) return;
    await deleteAdmin(id, {
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
            <CardTitle>Edit Admin</CardTitle>
            <CardDescription>
              Edit this admin&apos;s information
            </CardDescription>
          </div>
          {role === "SUPER_ADMIN" && (
            <Button
              loading={isDeleting}
              variant="ghost"
              size="icon"
              onClick={() => setDialogOpen(true)}
            >
              <Trash2Icon className="text-destructive" />
            </Button>
          )}
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
                    <Field
                      className="col-span-full"
                      data-invalid={fieldState.invalid}
                    >
                      <Input
                        id="username"
                        type="text"
                        label="Username"
                        placeholder="Enter a Username"
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
              This will remove this admin. This is irreversible, are you sure
              you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDeleteAdmin}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
