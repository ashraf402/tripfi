"use client";

import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function VerifyEmailForm() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 lg:px-40 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-text-secondary">
            Need help?
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <AlertCircle className="w-5 h-5 text-text-secondary" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10 w-full">
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
            We sent a verification link to your email address. Please enter the
            code below.
          </p>

          {/* OTP Input */}
          <div className="w-full mb-10">
            <div className="flex justify-between gap-2 md:gap-4">
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
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold bg-surface border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(0,208,132,0.1)] transition-all duration-200 text-foreground"
                  placeholder="•"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <Button className="w-full bg-primary hover:bg-primary-hover text-black font-bold font-heading py-6 rounded-xl transition-all duration-200 text-lg shadow-lg shadow-[rgba(0,208,132,0.2)] mb-8 active:scale-[0.98]">
            Verify
          </Button>

          {/* Links */}
          <div className="flex flex-col gap-4 w-full">
            <div className="text-text-secondary text-sm">
              Don&apos;t receive the code?
              <Button
                variant="ghost"
                className="text-primary opacity-50 cursor-not-allowed ml-1 font-medium hover:opacity-100 transition-opacity hover:bg-transparent p-0 h-auto"
              >
                Resend code (59s)
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
