"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/landing/Logo";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { resetPassword } from "@/lib/actions/auth";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
type PageState = "idle" | "success";

export function ForgotPasswordForm() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setServerError("");
    const formData = new FormData();
    formData.append("email", values.email);

    const result = await resetPassword(formData);

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    setSubmittedEmail(values.email);
    setPageState("success");
  };

  // SUCCESS STATE
  if (pageState === "success") {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
        {/* Ambient Glow Effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0, 209, 132, 0.15) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full bg-primary/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full bg-primary/5" />

        <div className="relative z-10 w-full max-w-110 px-6">
          <div className="flex flex-col items-center mb-8">
            <Logo />
          </div>

          <Card className="bg-surface backdrop-blur-md border border-border rounded-2xl sm:p-2 shadow-2xl overflow-hidden min-w-0">
            <CardContent className="flex flex-col items-center text-center gap-6 py-4 p-8">
              <div className="w-16 h-16 rounded-full bg-[rgba(0,208,132,0.1)] border border-primary flex items-center justify-center">
                <Mail className="w-7 h-7 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  Check your inbox
                </h2>
                <p className="text-text-secondary text-sm max-w-xs">
                  We sent a password reset link to{" "}
                  <span className="text-foreground font-medium">
                    {submittedEmail}
                  </span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPageState("idle");
                  form.reset();
                }}
                className="rounded-xl border-border text-foreground hover:border-primary hover:bg-transparent transition-colors duration-200"
              >
                Resend email
              </Button>

              <Link
                href="/login"
                className="text-text-secondary text-sm hover:text-primary transition-colors"
              >
                Back to sign in
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // IDLE STATE — form
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Ambient Glow Effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 209, 132, 0.15) 0%, transparent 70%)",
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full bg-primary/10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full bg-primary/5" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-110 px-6">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo />
        </div>

        {/* Reset Password Card */}
        <Card className="bg-surface backdrop-blur-md border border-border rounded-2xl sm:p-2 shadow-2xl overflow-hidden min-w-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-foreground text-2xl font-bold leading-tight tracking-tight mb-2">
                Reset your password
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Enter your email and we&apos;ll send you a reset link
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
                className="space-y-6"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium leading-none ml-1">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          className="w-full bg-surface border-border rounded-xl py-6 pl-4 pr-4 text-foreground placeholder:text-text-secondary focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(0,208,132,0.1)] transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-black font-bold font-heading py-6 rounded-xl shadow-lg shadow-[rgba(0,208,132,0.2)] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>

            {/* Back to Login */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/login"
                className="group flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer / Support */}
        <p className="mt-8 text-center text-text-secondary text-xs">
          Need help?{" "}
          <Link
            href="#"
            className="underline hover:text-foreground transition-colors"
          >
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
