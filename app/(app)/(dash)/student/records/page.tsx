import { RecordsTable } from "@/features/record/componets/student-records-table";

export default function RecordsPage() {
  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Records</h1>
      </div>
      <RecordsTable />
    </div>
  );
}
