import { NotFoundComp } from "@/components/not-found";
import { NominateForm } from "@/features/nomination/components/nominate-form";
import { prisma } from "@/lib/prisma";

export default async function NominatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const list = await prisma.nominationList.findUnique({
    where: { id },
  });

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, firstName: true, lastName: true },
  });

  const formattedStudents = students.map((student) => ({
    label: `${student.firstName} ${student.lastName}`,
    value: student.id,
  }));

  if (!list) {
    return (
      <NotFoundComp
        title="List not found"
        description="The requested nomination list could not be found on the server."
        className="max-w-md"
      />
    );
  }

  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">{list.title}</h1>
      </div>
      <div className="w-full lg:w-1/2 xl:w-1/3">
        <NominateForm listId={id} students={formattedStudents} />
      </div>
    </div>
  );
}
