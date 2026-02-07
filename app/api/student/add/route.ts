import { Student } from "@/features/student/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { addStudentSchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { passwordHash } from "@/utils/password";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: Request) => {
  if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
    throw new ApiError("Unauthorized", 401);
  }

  const body = await req.json();
  const { firstName, middleName, lastName, username, password } =
    addStudentSchema.parse(body);

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new ApiError("Username already exists", 409);
  }

  const hashedPassword = await passwordHash(password);

  const student = await prisma.user.create({
    data: {
      firstName,
      middleName,
      lastName,
      username,
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  const data: ApiEnvelope<Student> = {
    message: "Student added successfully",
    data: student,
  };

  return NextResponse.json(data);
});
