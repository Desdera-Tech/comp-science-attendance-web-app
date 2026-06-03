import { StudentNominationsTable } from "@/features/nomination/components/nominations-table";

export default function NominationPage() {
  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Nominations</h1>
      </div>
      <StudentNominationsTable />
    </div>
  );
}
