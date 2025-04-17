import { adminEmails } from "./adminsEmail";

export const isAdmin = (email: string | null): boolean => {
  if (!email) return false;
  return adminEmails.some((admin) => admin.email === email);
};
