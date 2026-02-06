"use client";

import Branding from "@/components/branding";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn, formatEnumLabel } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function AccountForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data } = useSession();
  if (!data) return;

  const { firstName, middleName, lastName, username, role } = data.user;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            View and verify your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <FieldGroup>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 px-6">
              <Input
                id="firstName"
                type="text"
                label="First name"
                value={firstName}
                readOnly
              />
              {role === "STUDENT" && (
                <Input
                  id="middleName"
                  type="text"
                  label="Middle name"
                  value={middleName}
                  readOnly
                />
              )}
              <Input
                id="lastName"
                type="text"
                label="Last name"
                value={lastName}
                readOnly
              />
              <Input
                id="username"
                type="text"
                label={role === "STUDENT" ? "Matric No" : "Username"}
                value={username}
                readOnly
              />
              <div className={role === "STUDENT" ? "col-span-full" : ""}>
                <Input
                  id="role"
                  type="text"
                  label="Type"
                  value={formatEnumLabel(role)}
                  readOnly
                />
              </div>
            </div>
            <Branding />
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
