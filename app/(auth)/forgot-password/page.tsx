import type { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password — TripFi",
  description:
    "Reset your TripFi password. Enter your email and we'll send you a reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <ScrollArea className="h-screen w-full">
      <ForgotPasswordForm />
    </ScrollArea>
  );
}
