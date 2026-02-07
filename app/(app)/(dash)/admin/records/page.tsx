import { Button } from "@/components/ui/button";
import { RecordsTable } from "@/features/record/componets/records-table";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

export default function RecordsPage() {
  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Records</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/admin/records/add">
              <PlusCircleIcon /> Add New Record
            </Link>
          </Button>
        </div>
      </div>
      <RecordsTable />
    </div>
  );
}
