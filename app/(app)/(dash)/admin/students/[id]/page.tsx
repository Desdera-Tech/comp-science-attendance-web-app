import { NotFoundComp } from "@/components/not-found";
import { ChangeStudentPasswordForm } from "@/features/student/components/change-password-form";
import { EditStudentForm } from "@/features/student/components/edit-student-form";
import { prisma } from "@/lib/prisma";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await prisma.user.findUnique({
    where: { id, role: "STUDENT" },
  });

  if (!student) {
    return (
      <NotFoundComp
        title="Student not found"
        description="The requested student details could not be found on the server."
        className="max-w-md"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 gap-4">
      <div className="lg:col-span-2 xl:col-span-1">
        <EditStudentForm student={student} />
      </div>
      <div className="lg:col-span-1 xl:col-span-1">
        <ChangeStudentPasswordForm studentId={student.id} />
      </div>
    </div>
  );
}
