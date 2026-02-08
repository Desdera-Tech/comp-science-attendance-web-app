import { Student } from "@/features/student/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { editStudentSchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: studentId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId, role: "STUDENT" },
    });

    if (!student) {
      throw new ApiError("Student not found", 404);
    }

    const data: ApiEnvelope<Student> = {
      message: "Student fetched successfully",
      data: student,
    };

    return NextResponse.json(data);
  },
);

export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: studentId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { firstName, middleName, lastName, username } =
      editStudentSchema.parse(body);

    const student = await prisma.user.findUnique({
      where: { id: studentId, role: "STUDENT" },
    });

    if (!student) {
      throw new ApiError("Student not found", 409);
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && student.username !== username) {
      throw new ApiError("Username already exists", 409);
    }

    await prisma.user.update({
      where: { id: studentId },
      data: {
        firstName,
        middleName,
        lastName,
        username,
      },
    });

    const data: ApiEnvelope<Student> = {
      message: "Student edited successfully",
      data: {
        ...student,
        firstName,
        middleName,
        lastName,
        username,
      },
    };

    return NextResponse.json(data);
  },
);

export const DELETE = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: studentId } = await params;

    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    await prisma.user.delete({
      where: { id: studentId, role: "STUDENT" },
    });

    const data: ApiEnvelope<any> = {
      message: "Student deleted successfully",
    };

    return NextResponse.json(data);
  },
);
