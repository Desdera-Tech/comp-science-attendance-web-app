import { Admin } from "@/features/admin/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { addAdminSchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { passwordHash } from "@/utils/password";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: Request) => {
  if (!(await requireRole(["SUPER_ADMIN"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const body = await req.json();
  const { firstName, lastName, username, password } =
    addAdminSchema.parse(body);

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new ApiError("Username already exists", 409);
  }

  const hashedPassword = await passwordHash(password);

  const admin = await prisma.user.create({
    data: {
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const data: ApiEnvelope<Admin> = {
    message: "Admin added successfully",
    data: admin,
  };

  return NextResponse.json(data);
});
