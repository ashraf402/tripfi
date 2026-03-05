"use client";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/ui/inputs/PasswordField";
import { TextField } from "@/components/ui/inputs/TextField";
import { signIn } from "@/lib/actions/auth";
import { useConversationStore } from "@/lib/store/conversationStore";
import { createClient } from "@/lib/supabase/client";
import { sanitizeEmail } from "@/lib/utils/sanitize";
import { LoginFormData, loginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Google sign-in failed. Please try again.",
  missing_code: "Authentication was cancelled.",
};

function AuthError() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  if (!authError) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
      <p className="text-red-400 text-sm">
        {AUTH_ERROR_MESSAGES[authError] ?? "Something went wrong."}
      </p>
    </div>
  );
}

export function LoginForm() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Clear sensitive data on mount (e.g. after sign out)
  useEffect(() => {
    useConversationStore.getState().reset();
  }, []);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginFormData) => {
    setServerError("");

    const { value: cleanEmail, isClean: emailOk } = sanitizeEmail(values.email);

    if (!emailOk) {
      setServerError("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();
    formData.append("email", cleanEmail);
    formData.append("password", values.password); // never sanitize passwords

    const result = await signIn(formData);
    // signIn redirects on success, result only returns on error
    if (result?.error) {
      setServerError(result.error);
    }
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
    <div className="flex-1 flex flex-col justify-center items-center p-3 sm:p-12 lg:p-24 bg-background">
      {/* Mobile Logo */}
      <div className="lg:hidden mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-105">
        {/* Glassmorphic Card */}
        <Card className="bg-surface backdrop-blur-md border border-border rounded-2xl sm:p-2 overflow-hidden min-w-0 shadow-2xl">
          <CardContent className="p-8 sm:p-10 pb-12 sm:pb-12">
            {/* Heading */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2 text-foreground">
                Welcome Back
              </h3>
              <p className="text-text-secondary">
                Enter your credentials to access your trips
              </p>
            </div>

            {/* OAuth callback error (e.g. ?error=auth_failed) */}
            <Suspense fallback={null}>
              <AuthError />
            </Suspense>

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
                {/* Email Field */}
                <TextField
                  control={form.control}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                />

                {/* Password Field */}
                <PasswordField
                  control={form.control}
                  forgotPasswordHref="/forgot-password"
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-black font-bold font-heading py-6 rounded-xl transition-all duration-200 transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2 shadow-lg shadow-[rgba(0,208,132,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative flex items-center gap-4 py-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-text-secondary text-xs uppercase tracking-widest font-medium whitespace-nowrap">
                or continue with
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google OAuth Button */}
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
              label={
                isGoogleLoading ? "Redirecting to Google..." : "Google Account"
              }
            />
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-bold hover:underline ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
