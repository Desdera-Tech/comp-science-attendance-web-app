import { Admin } from "@/features/admin/types";
import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { prisma } from "@/lib/prisma";
import { editAdminSchema } from "@/lib/validation";
import { ApiEnvelope } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: adminId } = await params;

    if (!(await requireRole(["SUPER_ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId, OR: [{ role: "SUPER_ADMIN" }, { role: "ADMIN" }] },
    });

    if (!admin) {
      throw new ApiError("Admin not found", 404);
    }

    const data: ApiEnvelope<Admin> = {
      message: "Admin fetched successfully",
      data: admin,
    };

    return NextResponse.json(data);
  },
);

export const POST = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: adminId } = await params;

    if (!(await requireRole(["SUPER_ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { firstName, lastName, username } = editAdminSchema.parse(body);

    const admin = await prisma.user.findUnique({
      where: { id: adminId, OR: [{ role: "SUPER_ADMIN" }, { role: "ADMIN" }] },
    });

    if (!admin) {
      throw new ApiError("Admin not found", 409);
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && admin.username !== username) {
      throw new ApiError("Username already exists", 409);
    }

    await prisma.user.update({
      where: { id: adminId },
      data: {
        firstName,
        lastName,
        username,
      },
    });

    const data: ApiEnvelope<Admin> = {
      message: "Admin edited successfully",
      data: {
        ...admin,
        firstName,
        lastName,
        username,
      },
    };

    return NextResponse.json(data);
  },
);

export const DELETE = withErrorHandler(
  async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: adminId } = await params;

    if (!(await requireRole(["SUPER_ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    await prisma.user.delete({
      where: { id: adminId, OR: [{ role: "SUPER_ADMIN" }, { role: "ADMIN" }] },
    });

    const data: ApiEnvelope<any> = {
      message: "Admin deleted successfully",
    };

    return NextResponse.json(data);
  },
);
