import { requireRole } from "@/lib/auth/require-role";
import { ApiError } from "@/lib/errors/api-error";
import { withErrorHandler } from "@/lib/errors/with-error-handler";
import { exportRecordEntriesToExcel } from "@/lib/exports/exportToExcel";
import { exportRecordEntriesToPDF } from "@/lib/exports/exportToPdf";
import { prisma } from "@/lib/prisma";

export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    if (!(await requireRole(["SUPER_ADMIN", "ADMIN"]))) {
      throw new ApiError("Unauthorized", 401);
    }

    const { id: recordId } = await params;

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    if (!format || !["excel", "pdf"].includes(format)) {
      return new Response("Invalid export format", { status: 400 });
    }

    const record = await prisma.record.findUnique({
      where: { id: recordId },
      select: { title: true },
    });

    if (!record) {
      return new Response("Record not found", { status: 404 });
    }

    const entries = await prisma.recordEntry.findMany({
      where: {
        recordId,
      },
      orderBy: {
        user: {
          username: "asc",
        },
      },
      select: {
        user: {
          select: {
            lastName: true,
            firstName: true,
            middleName: true,
            username: true,
          },
        },
      },
    });

    const formatted = entries.map((entry, index) => ({
      sn: index + 1,
      name: `${entry.user.lastName} ${entry.user.firstName}${entry.user.middleName ? " " + entry.user.middleName : ""}`,
      matricNumber: entry.user.username,
    }));

    const title = record.title;
    const fileName = safeFileName(title);

    if (format === "excel") {
      const buffer = await exportRecordEntriesToExcel(formatted, title);

      return new Response(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
        },
      });
    }

    const buffer = await exportRecordEntriesToPDF(formatted, title);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}.pdf`,
      },
    });
  },
);

function safeFileName(title: string) {
  return title.replace(/[<>:"/\\|?*]+/g, "").trim();
}
