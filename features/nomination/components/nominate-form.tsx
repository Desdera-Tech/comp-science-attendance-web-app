"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useNominateStudent } from "../hooks/use-nomination";

type StudentOption = {
  label: string;
  value: string;
};

export function NominateForm({
  listId,
  students,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  listId: string;
  students: StudentOption[];
}) {
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");

  const { mutateAsync: nominateStudent, isPending } = useNominateStudent();

  const selectedStudent = students.find((student) => student.value === userId);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      student.label.toLowerCase().includes(query),
    );
  }, [search, students]);

  const onSubmit = async () => {
    if (!userId) {
      toast.error("Please select a student");
      return;
    }

    await nominateStudent(
      { listId, userId },
      {
        onSuccess: async (response) => {
          const { error, message } = response;
          if (error) {
            toast.error(message);
          } else {
            toast.success(message);
            setUserId("");
            setSearch("");
          }
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Nominate a Student</CardTitle>
          <CardDescription>Nominate a student for an award.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <Input
            placeholder="Search for a student to nominate"
            onChange={(e) => setSearch(e.target.value)}
          />

          {userId && (
            <Student
              key={selectedStudent?.value || ""}
              label={selectedStudent?.label || ""}
              value={selectedStudent?.value || ""}
            />
          )}

          <div className="bg-background rounded-lg">
            <div className="overflow-y-auto p-4" style={{ height: 500 }}>
              <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No students found matching &apos;{search}&apos;
                  </p>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = userId === student.value;

                    return (
                      <Student
                        key={student.value}
                        label={student.label}
                        value={student.value}
                        isSelected={isSelected}
                        onSelect={() => setUserId(student.value)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <Button
            loading={isPending}
            className="w-full"
            type="submit"
            onClick={onSubmit}
          >
            Nominate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Student({
  label,
  value,
  isSelected,
  onSelect,
}: {
  label: string;
  value: string;
  isSelected?: boolean;
  onSelect?: (value: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect && onSelect(value)}
      className={cn(
        "flex items-center justify-between bg-background px-3 py-2 cursor-pointer border rounded-md transition-colors text-sm font-medium",
      )}
    >
      {label}
      {isSelected && <CheckCircle2Icon className="size-4" />}
    </div>
  );
}
