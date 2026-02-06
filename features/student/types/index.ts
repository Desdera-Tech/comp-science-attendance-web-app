export type Student = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  username: string;
  password: string;
  createdAt: Date;
};

export type Analytics = {
  records: number;
};
