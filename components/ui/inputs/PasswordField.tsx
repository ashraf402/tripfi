"use client";

import React from "react";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Eye, EyeOff } from "lucide-react";
import { getPasswordStrength } from "@/utils/password";
import { strengthColors, strengthLabelColors } from "@/utils/color";
import type { Control, FieldValues, Path } from "react-hook-form";

interface PasswordFieldProps<T extends FieldValues> {
  /** The react-hook-form control from useForm() */
  control: Control<T>;
  /** Field name in your form schema — defaults to "password" */
  name?: Path<T>;
  /** Label text — defaults to "Password" */
  label?: string;
  /** Show the password strength indicator (for signup only) */
  showStrength?: boolean;
  /** autoComplete hint.
   *  Defaults to "current-password" (login).
   *  Pass "new-password" for signup. */
  autoComplete?: string;
  /** Optional "Forgot password?" link href shown inline with the label */
  forgotPasswordHref?: string;
}

export function PasswordField<T extends FieldValues>({
  control,
  name = "password" as Path<T>,
  label = "Password",
  showStrength = false,
  autoComplete = "current-password",
  forgotPasswordHref,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = (field.value as string) ?? "";
        const strength = getPasswordStrength(value);

        return (
          <FormItem>
            {forgotPasswordHref ? (
              <div className="flex justify-between items-center ml-1">
                <FormLabel className="text-sm font-semibold text-text-secondary">
                  {label}
                </FormLabel>
                <Link
                  href={forgotPasswordHref}
                  className="text-xs font-semibold text-primary hover:opacity-80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            ) : (
              <FormLabel className="block text-sm font-semibold text-text-secondary mb-1.5 ml-1">
                {label}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete={autoComplete}
                  className="w-full bg-surface border-border rounded-xl py-6 pl-4 pr-12 text-foreground placeholder:text-text-secondary focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(0,208,132,0.1)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors z-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </FormControl>

            {/* Password Strength — signup only */}
            {showStrength && value.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Password Strength
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${strengthLabelColors[strength.level]}`}
                  >
                    {strength.label}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i <= strength.segments
                          ? strengthColors[strength.level]
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        );
      }}
    />
  );
}
