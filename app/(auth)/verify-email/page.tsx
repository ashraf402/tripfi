import type { Metadata } from "next";
import { Suspense } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { PageLoader } from "@/components/shared/PageLoader";

export const metadata: Metadata = {
  title: "Verify Email — TripFi",
  description:
    "Verify your email address to complete your TripFi account registration.",
};

export default function VerifyEmailPage() {
  return (
    <ScrollArea className="h-screen w-full">
      <Suspense fallback={<PageLoader />}>
        <VerifyEmailForm />
      </Suspense>
    </ScrollArea>
  );
}
