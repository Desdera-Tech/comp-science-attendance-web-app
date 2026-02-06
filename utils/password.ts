import bcrypt from "bcrypt";

export const passwordHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const passwordCompare = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
