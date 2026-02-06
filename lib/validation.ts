import { z } from "zod";

const requiredString = z.string().min(1, "Required");

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const addAdminSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  username: requiredString,
  password: requiredString,
});

export type AddAdminFormValues = z.infer<typeof addAdminSchema>;

export const addStudentSchema = z.object({
  firstName: requiredString,
  middleName: requiredString,
  lastName: requiredString,
  username: requiredString,
  password: requiredString,
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;

export const addRecordSchema = z.object({
  title: requiredString,
});

export type AddRecordFormValues = z.infer<typeof addRecordSchema>;
