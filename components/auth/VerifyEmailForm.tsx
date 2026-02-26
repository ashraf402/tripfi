"use client";

import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function VerifyEmailForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Read email from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("tripfi-pending-email");
    if (!stored) {
      router.replace("/signup");
      return;
    }
    setEmail(stored);
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move back on backspace if empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsVerifying(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setIsVerifying(false);
      setError(
        error.message.includes("expired")
          ? "This code has expired. Request a new one."
          : "Incorrect code. Please try again.",
      );
      // Clear boxes on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    // Success — clear storage and redirect
    sessionStorage.removeItem("tripfi-pending-email");
    router.replace("/new");
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setError("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setIsResending(false);

    if (error) {
      setError("Failed to resend. Please try again.");
      return;
    }

    // Reset everything
    setCountdown(59);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center px-6 lg:px-40 py-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-2 sm:px-4 py-12 relative z-10 w-full">
        <div className="bg-surface backdrop-blur-md border border-border rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center w-full max-w-120">
          {/* Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="bg-primary/10 border border-primary/20 w-20 h-20 rounded-2xl flex items-center justify-center relative shadow-[0_0_15px_rgba(0,209,132,0.4)]">
              <Mail className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Heading & Subtext */}
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-foreground">
            Verify your email
          </h1>
          <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-[320px]">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-semibold">
              {email || "your email"}
            </span>
            . Please enter it below.
          </p>

          {/* OTP Input */}
          <div className="max-w-full mb-10">
            <div className="flex justify-center gap-3 md:gap-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="size-10 sm:size-12 md:size-14 text-center text-xl font-bold bg-surface border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(0,208,132,0.1)] transition-all duration-200 text-foreground"
                  placeholder="•"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4 -mt-6">
              {error}
            </p>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={
              isVerifying || otp.join("").length < 6 || otp.includes("")
            }
            className="w-full bg-primary hover:bg-primary-hover text-black font-bold font-heading py-6 rounded-xl transition-all duration-200 text-lg shadow-lg shadow-[rgba(0,208,132,0.2)] mb-8 active:scale-[0.98]"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify"
            )}
          </Button>

          {/* Links */}
          <div className="flex flex-col gap-4 w-full">
            <div className="text-text-secondary text-sm">
              Don&apos;t receive the code?
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={`
                  ml-1 font-medium hover:bg-transparent p-0 h-auto transition-all
                  ${
                    canResend
                      ? "text-primary opacity-100 cursor-pointer"
                      : "text-primary opacity-50 cursor-not-allowed"
                  }
                `}
              >
                {isResending
                  ? "Sending..."
                  : canResend
                    ? "Resend code"
                    : `Resend code (${countdown}s)`}
              </Button>
            </div>
            <div className="pt-4 border-t border-border w-full">
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 text-text-secondary hover:text-foreground transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Wrong email? Go back
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
