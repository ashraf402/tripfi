"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/landing/Logo";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const step = pathname.includes("/wallet") ? 2 : 1;
  const progress = (step / 2) * 100;

  return (
    <div className="h-screen w-full bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <ScrollArea className="h-full w-full">
        <div className="min-h-full flex flex-col items-center justify-center p-6">
          {/* Header */}
          <div className="w-full max-w-lg mb-12 flex flex-col items-center gap-8 relative z-10 mt-10 md:mt-0">
            <Logo />
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-text-secondary">
                <span>Step {step} of 2</span>
                <span>{step === 1 ? "Travel Style" : "Connect Wallet"}</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full max-w-lg relative z-10 mb-10 md:mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
