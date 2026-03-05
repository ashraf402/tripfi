import type { Metadata } from "next";
import { Suspense } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageLoader } from "@/components/shared/PageLoader";

export const metadata: Metadata = {
  title: "Login — TripFi",
  description:
    "Sign in to TripFi — the world's first premium travel booking platform powered by Bitcoin Cash.",
};

export default function LoginPage() {
  return (
    <ScrollArea className="h-screen w-full">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <BrandPanel />
        <Suspense fallback={<PageLoader />}>
          <LoginForm />
        </Suspense>
      </div>
    </ScrollArea>
  );
}
