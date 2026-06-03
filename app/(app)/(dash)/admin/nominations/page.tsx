import { Button } from "@/components/ui/button";
import { NominationsListTable } from "@/features/nomination/components/admin-nominations-list-table";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

export default function NominationsPage() {
  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Nominations</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/admin/nominations/add">
              <PlusCircleIcon /> Add New List
            </Link>
          </Button>
        </div>
      </div>
      <NominationsListTable />
    </div>
  );
}
