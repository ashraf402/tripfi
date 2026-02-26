import type { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email — TripFi",
  description:
    "Verify your email address to complete your TripFi account registration.",
};

export default function VerifyEmailPage() {
  return (
    <ScrollArea className="h-screen w-full">
      <VerifyEmailForm />
    </ScrollArea>
  );
}
