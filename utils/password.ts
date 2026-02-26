import { PasswordStrength } from "@/types/password";

export function getPasswordStrength(password: string): {
  level: PasswordStrength;
  label: string;
  segments: number;
} {
  if (password.length === 0) return { level: "weak", label: "", segments: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: "weak", label: "Weak", segments: 1 };
  if (score === 2) return { level: "fair", label: "Fair", segments: 2 };
  if (score === 3) return { level: "strong", label: "Strong", segments: 3 };
  return { level: "very-strong", label: "Very Strong", segments: 4 };
}
