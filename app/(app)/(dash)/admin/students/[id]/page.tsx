import { NotFoundComp } from "@/components/not-found";
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
    <div className="w-full lg:w-2/3 xl:w-1/2">
      <EditStudentForm student={student} />
    </div>
  );
}
