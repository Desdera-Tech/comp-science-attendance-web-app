import { StudentAnalytics } from "@/features/dashboard/components/student-analytics";
import { RecordsTable } from "@/features/record/componets/student-records-table";
import { VerifyLinkCard } from "@/features/record/componets/verify-link-card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function StudentDashHomePage() {
  const session = await getServerSession(authOptions);

  const records = await prisma.record.count({
    where: { recordEntries: { some: { userId: session?.user.id } } },
  });

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div>
        <StudentAnalytics initialRecords={records} />
      </div>
      <div className="md:col-span-2">
        <VerifyLinkCard />
      </div>
      <div className="col-span-full">
        <RecordsTable />
      </div>
    </div>
  );
}
