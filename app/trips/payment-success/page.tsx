"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params.get("booking_id");
  const paymentId = params.get("payment_id");

  const [status, setStatus] = useState<"confirming" | "success" | "error">(
    "confirming",
  );

  useEffect(() => {
    if (!bookingId) {
      router.replace("/chat");
      return;
    }

    const confirm = async () => {
      try {
        const res = await axios.post("/api/bookings/confirm", {
          bookingId,
          paymentId,
        });

        const data = res.data;

        if (!data.success) throw new Error(data.error || "Payment failed");

        setStatus("success");

        // Redirect to trips dashboard
        setTimeout(() => {
          router.replace(`/trips?confirmed=${data.tripId}`);
        }, 2000);
      } catch {
        setStatus("error");
      }
    };

    confirm();
  }, [bookingId, paymentId, router]);

  return (
    <div
      className="min-h-screen bg-background
                    flex items-center
                    justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 px-4"
      >
        {status === "confirming" && (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            <h2 className="text-foreground text-xl font-bold">
              Confirming your payment...
            </h2>
            <p className="text-secondary text-sm">
              Just a moment while we verify your BCH transaction
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-foreground text-2xl font-bold">Trip booked!</h2>
            <p className="text-secondary text-sm">
              Taking you to your trip dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-foreground text-xl font-bold">
              Something went wrong
            </h2>
            <p className="text-secondary text-sm">
              Your payment may have gone through. Check your trips dashboard.
            </p>
            <Button
              onClick={() => router.replace("/dashboard")}
              className="bg-primary text-black font-bold rounded-full px-6 py-3 h-auto text-sm hover:bg-primary/90 transition-colors"
            >
              Go to dashboard
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
