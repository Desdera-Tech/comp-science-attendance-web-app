import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { passwordHash } from "@/utils/password";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: studentId } = await params;

    if (!(await requireRole(["SUPER_ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { password } = changePasswordSchema.parse(body);

    const student = await prisma.user.findUnique({
      where: { id: studentId, role: "STUDENT" },
    });

    if (!student) {
      throw new ApiError("Student not found", 409);
    }

    const hashedPassword = await passwordHash(password);

    await prisma.user.update({
      where: { id: studentId },
      data: {
        password: hashedPassword,
      },
    });

    const data: ApiEnvelope<any> = {
      message: "Student password changed successfully",
    };

    return NextResponse.json(data);
  },
);
