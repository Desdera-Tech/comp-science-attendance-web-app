export type Student = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  username: string;
  createdAt: Date;
};

export type Analytics = {
  records: number;
};

export type StudentsPage = {
  students: Student[];
  nextCursor: string | null;
};
