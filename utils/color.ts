import { PasswordStrength } from "@/types/password";

export const strengthColors: Record<PasswordStrength, string> = {
  weak: "bg-red-500",
  fair: "bg-yellow-500",
  strong: "bg-primary",
  "very-strong": "bg-primary",
};

export const strengthLabelColors: Record<PasswordStrength, string> = {
  weak: "text-red-500",
  fair: "text-yellow-500",
  strong: "text-primary",
  "very-strong": "text-primary",
};
