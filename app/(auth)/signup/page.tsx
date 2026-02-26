import type { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignUpBrandPanel } from "@/components/auth/SignUpBrandPanel";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up — TripFi",
  description:
    "Create your TripFi account — start planning sustainable adventures powered by Bitcoin Cash.",
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
      <SignUpBrandPanel />
      <div className="flex-1 lg:w-1/2 h-full">
        <ScrollArea className="h-full w-full">
          <SignUpForm />
        </ScrollArea>
      </div>
    </div>
  );
}
