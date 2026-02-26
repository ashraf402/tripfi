"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { completeOnboarding } from "@/lib/actions/profile";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  CircleCheck,
  Loader2,
  Receipt,
  Shield,
  Wallet,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type WalletOption = "connect" | "later" | null;

export default function WalletConnectPage() {
  const router = useRouter();
  const [option, setOption] = useState<WalletOption>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletError, setWalletError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateBCHAddress = (address: string): boolean => {
    // BCH addresses start with 'bitcoincash:q' or just 'q'
    // or legacy format starting with '1'
    const bchRegex =
      /^(bitcoincash:)?(q|p)[a-z0-9]{41}$|^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    return bchRegex.test(address.trim());
  };

  const handleWalletBlur = () => {
    if (option === "connect" && walletAddress.length > 0) {
      if (!validateBCHAddress(walletAddress)) {
        setWalletError("Please enter a valid BCH address");
      } else {
        setWalletError("");
      }
    }
  };

  const handleFinish = async () => {
    setServerError("");

    // Validate wallet address if option selected
    if (option === "connect") {
      if (!walletAddress) {
        setWalletError("Please enter your BCH wallet address");
        return;
      }
      if (!validateBCHAddress(walletAddress)) {
        setWalletError("Please enter a valid BCH address");
        return;
      }
    }

    setLoading(true);

    const result = await completeOnboarding(
      option === "connect" ? walletAddress.trim() : undefined,
    );

    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
      return;
    }

    // On success completeOnboarding redirects to /new
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="relative text-center space-y-2">
        <Button
          variant="ghost"
          className="absolute left-0 top-0 p-0 hover:bg-transparent hover:text-foreground text-text-secondary"
          onClick={() => router.push("/onboarding/style")}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-heading font-bold text-foreground pt-8 md:pt-0">
          Connect your BCH wallet
        </h1>
        <p className="text-text-secondary">
          Pay for bookings instantly with near-zero fees.
        </p>
      </div>

      <div className="space-y-4">
        {/* Option A: Connect Wallet */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card
            onClick={() => {
              setOption("connect");
              setWalletError("");
            }}
            className={cn(
              "cursor-pointer p-6 border-2 transition-all duration-200 rounded-3xl",
              option === "connect"
                ? "border-primary bg-primary/5"
                : "border-border bg-surface hover:border-primary/50",
            )}
          >
            <div className="flex items-center gap-4 mb-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  option === "connect"
                    ? "bg-primary text-black"
                    : "bg-surface-card text-text-secondary",
                )}
              >
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  I have a BCH wallet
                </h3>
              </div>
              {option === "connect" && (
                <div className="ml-auto bg-primary rounded-full p-1">
                  <CheckIcon className="w-3 h-3 text-black font-bold" />
                </div>
              )}
            </div>

            <AnimatePresence>
              {option === "connect" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-2 border-t border-border/50">
                    <div className="space-y-2">
                      <Input
                        value={walletAddress}
                        onChange={(e) => {
                          setWalletAddress(e.target.value);
                          setWalletError("");
                        }}
                        onBlur={handleWalletBlur}
                        placeholder="bitcoincash:qp3wjpa..."
                        className="font-mono text-sm bg-surface-card border-border rounded-xl text-foreground placeholder:text-text-secondary focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(0,208,132,0.1)] transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {walletError && (
                        <p className="text-red-400 text-xs">{walletError}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Option B: Skip */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card
            onClick={() => {
              setOption("later");
              setWalletAddress("");
              setWalletError("");
            }}
            className={cn(
              "cursor-pointer p-6 border-2 border-dashed transition-all duration-200 rounded-3xl",
              option === "later"
                ? "border-text-secondary bg-surface-card"
                : "border-border bg-transparent hover:border-text-secondary",
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  option === "later"
                    ? "bg-text-secondary text-white"
                    : "bg-surface-card text-text-secondary",
                )}
              >
                <CircleCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  I&apos;ll set this up later
                </h3>
                <p className="text-sm text-text-secondary">
                  You can add this in Settings anytime.
                </p>
              </div>
              {option === "later" && (
                <div className="ml-auto bg-text-secondary rounded-full p-1">
                  <CheckIcon className="w-3 h-3 text-white font-bold" />
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <Separator />

      {/* Benefits Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start p-4 bg-surface-card rounded-xl">
          <Zap className="w-6 h-6 text-primary mb-2" />
          <h4 className="font-bold text-sm text-foreground">Fast</h4>
          <p className="text-xs text-text-secondary">Settles in &lt; 2s</p>
        </div>
        <div className="flex flex-col items-center md:items-start p-4 bg-surface-card rounded-xl">
          <Shield className="w-6 h-6 text-primary mb-2" />
          <h4 className="font-bold text-sm text-foreground">Cheap</h4>
          <p className="text-xs text-text-secondary">Fees &lt; $0.001</p>
        </div>
        <div className="flex flex-col items-center md:items-start p-4 bg-surface-card rounded-xl">
          <Receipt className="w-6 h-6 text-primary mb-2" />
          <h4 className="font-bold text-sm text-foreground">Secure</h4>
          <p className="text-xs text-text-secondary">Receipt included</p>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <p className="text-red-400 text-sm text-center">{serverError}</p>
      )}

      {/* Finish button */}
      <Button
        onClick={handleFinish}
        disabled={loading || option === null}
        className="w-full py-6 text-lg font-bold font-heading rounded-xl shadow-lg shadow-[rgba(0,208,132,0.2)] active:scale-[0.98] transition-all bg-primary text-black hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Finish Setup"
        )}
      </Button>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
