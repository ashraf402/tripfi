"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/landing/Logo";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema, SignUpFormData } from "@/lib/validations/auth";
import { sanitizeEmail, sanitizeName } from "@/lib/utils/sanitize";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TextField } from "@/components/ui/inputs/TextField";
import { PasswordField } from "@/components/ui/inputs/PasswordField";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export function SignUpForm() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: SignUpFormData) => {
    setServerError("");

    const { value: cleanEmail, isClean: emailOk } = sanitizeEmail(values.email);
    const { value: cleanName } = sanitizeName(values.name);

    if (!emailOk) {
      setServerError("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cleanName);
    formData.append("email", cleanEmail);
    formData.append("password", values.password);

    const result = await signUp(formData);
    if (result?.error) {
      setServerError(result.error);
      return;
    }

    // Store sanitized email for OTP verification page
    sessionStorage.setItem("tripfi-pending-email", cleanEmail);
    router.push("/verify-email");
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setServerError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setIsGoogleLoading(false);
      setServerError("Google sign-in failed. Please try again.");
    }
    // On success the browser navigates to Google — no setIsGoogleLoading(false)
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-3 py-12 lg:px-12 xl:px-24 bg-background">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center mb-10">
          <Logo />
        </div>

        {/* Glassmorphic Card */}
        <Card className="bg-surface backdrop-blur-md border border-border rounded-2xl sm:p-2 overflow-hidden min-w-0 shadow-2xl">
          <CardContent className="p-8 pb-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Create Account
              </h2>
              <p className="text-text-secondary font-medium">
                Start your journey with us today.
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
                <p className="text-red-400 text-sm">{serverError}</p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Full Name */}
                <TextField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  autoComplete="name"
                />

                {/* Email */}
                <TextField
                  control={form.control}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                />

                {/* Password */}
                <PasswordField
                  control={form.control}
                  showStrength
                  autoComplete="new-password"
                />

                {/* Confirm Password */}
                <PasswordField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  autoComplete="new-password"
                />

                {/* Terms Checkbox */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3 py-2">
                        <div className="flex h-5 items-center">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormLabel className="text-xs text-text-secondary leading-normal font-normal cursor-pointer">
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-primary hover:underline font-semibold"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline font-semibold"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </FormLabel>
                      </div>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Create Account Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-black font-bold font-heading py-6 rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-lg shadow-[rgba(0,208,132,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Create Account</span>
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-4 text-text-secondary font-bold tracking-widest">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
            />

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-text-secondary font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:opacity-80 font-bold transition-colors ml-1"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
