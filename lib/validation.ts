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

export const editAdminSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  username: requiredString,
});

export type EditAdminFormValues = z.infer<typeof editAdminSchema>;

export const addStudentSchema = z.object({
  firstName: requiredString,
  middleName: requiredString,
  lastName: requiredString,
  username: requiredString,
  password: requiredString,
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;

export const editStudentSchema = z.object({
  firstName: requiredString,
  middleName: requiredString,
  lastName: requiredString,
  username: requiredString,
});

export type EditStudentFormValues = z.infer<typeof editStudentSchema>;

export const changePasswordSchema = z.object({
  password: requiredString,
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const recordSchema = z.object({
  title: requiredString,
});

export type RecordFormValues = z.infer<typeof recordSchema>;

export const verifyLinkSchema = z.object({
  link: requiredString,
});

export type VerifyLinkFormValues = z.infer<typeof verifyLinkSchema>;
