import { Button } from "@/components/ui/button";
import { StudentsTable } from "@/features/student/components/students-table";
import { LucideUserPlus2 } from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  return (
    <div className="flex flex-col overflow-hidden gap-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Students</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/admin/students/add">
              <LucideUserPlus2 /> Add New Student
            </Link>
          </Button>
        </div>
      </div>
      <StudentsTable />
    </div>
  );
}
