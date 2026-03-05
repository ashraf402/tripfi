"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useBCHRate } from "@/lib/hooks/useBCHRate";
import type { ItineraryData } from "@/lib/types/chat";
import axios from "axios";
import {
  Bitcoin,
  Loader2,
  MapPin,
  Shield,
  CheckCircle,
  Copy,
  Check,
  Plane,
  Hotel,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  IS_TESTNET,
  activeNetwork,
  buildBCHPaymentURI,
} from "@/lib/services/payment/bchPayment";
import { TestnetBadge } from "@/components/shared/TestnetBadge";
import { AnimatePresence, motion } from "framer-motion";
import { useConversationStore } from "@/lib/store/conversationStore";

type Step = "summary" | "payment" | "polling" | "confirmed";

interface PaymentInvoiceState {
  bookingId: string;
  paymentAddress: string;
  amountBch: number;
  amountUsd: number;
  bchRate: number;
  paymentUri?: string;
  networkLabel?: string;
  costs?: {
    flightCost: number;
    hotelCost: number;
    activitiesCost: number;
    taxesAndFees: number;
    total: number;
  };
  wasRestored?: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: ItineraryData;
  conversationId: string;
}

export function BookingModal({
  isOpen,
  onClose,
  itinerary,
  conversationId,
}: BookingModalProps) {
  const [step, setStep] = useState<Step>("summary");
  const [invoice, setInvoice] = useState<PaymentInvoiceState | null>(null);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [explorerUrl, setExplorerUrl] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { rate: bchRate } = useBCHRate();

  const costs = itinerary.costs ?? {
    flightCost: 0,
    hotelCost: 0,
    activitiesCost: 0,
    taxesAndFees: 0,
    total: itinerary.totalCostUsd ?? 0,
  };
  const totalUsd = costs.total;
  const totalBchCalculated = bchRate ? totalUsd / bchRate : 0;

  // The stable identifier for this specific itinerary.
  // tripId is set by the orchestrator when the itinerary is built.
  // const itineraryId = itinerary.tripId ?? null;
  const itineraryId =
    itinerary.tripId ??
    `${itinerary.destination}-${itinerary.startDate}-${itinerary.endDate}-${itinerary.travelers ?? 1}`;

  // Check Supabase for an existing pending booking for this itinerary.
  // Returns the invoice if found, null otherwise.
  async function checkForExistingBooking(
    id: string,
  ): Promise<PaymentInvoiceState | null> {
    try {
      const res = await axios.get("/api/bookings/pending", {
        params: { itinerary_id: id },
      });
      if (res.data.exists) {
        return res.data.invoice as PaymentInvoiceState;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function handleCreateInvoice() {
    setIsLoading(true);
    setError("");

    try {
      // Check for an existing pending booking BEFORE creating a new one
      if (itineraryId) {
        const existingInvoice = await checkForExistingBooking(itineraryId);
        if (existingInvoice) {
          // Restore existing invoice — no new booking, no new address
          setInvoice({ ...existingInvoice, wasRestored: true });
          setStep("payment");
          return;
        }
      }

      // No existing booking found — create a new one
      const res = await axios.post("/api/bookings/create", {
        itineraryId,
        conversationId,
        origin: itinerary.origin ?? "Unknown",
        destination: itinerary.destination,
        destinationCity: itinerary.destination,
        departureDate: itinerary.startDate,
        returnDate: itinerary.endDate,
        travelers: itinerary.travelers ?? 1,
        tripDays: itinerary.totalDays ?? 0,
        travelStyle: "Mixed",
        totalUsd: costs.total,
        flightCost: costs.flightCost,
        hotelCost: costs.hotelCost,
        activitiesCost: costs.activitiesCost,
        taxesAndFees: costs.taxesAndFees,
        itineraryData: itinerary,
      });

      setInvoice({
        bookingId: res.data.bookingId,
        paymentAddress: res.data.paymentAddress,
        amountBch: res.data.amountBch,
        amountUsd: res.data.amountUsd,
        bchRate: res.data.bchRate,
        paymentUri: res.data.paymentUri,
        networkLabel: res.data.networkLabel,
        costs: res.data.costs,
        wasRestored: false,
      });
      setStep("payment");
    } catch (err: any) {
      setError(
        err.response?.data?.error ?? "Failed to generate payment address.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopyAddress() {
    if (!invoice?.paymentAddress) return;
    await navigator.clipboard.writeText(invoice.paymentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleStartPolling() {
    if (!invoice?.bookingId) return;
    setStep("polling");
    setError("");

    const maxAttempts = 120;
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await axios.get(
          `/api/bookings/poll?booking_id=${invoice.bookingId}`,
        );

        if (res.data.status === "confirmed") {
          setTxHash(res.data.txHash);
          setExplorerUrl(res.data.explorerUrl);
          setStep("confirmed");

          // Update store with bookedTripId
          if (conversationId) {
            const store = useConversationStore.getState();
            const currentMessages = store.messages[conversationId] || [];
            const newMessages = currentMessages.map((m) => {
              if (
                m.data &&
                "tripId" in m.data &&
                (m.data as ItineraryData).tripId === itinerary.tripId
              ) {
                return {
                  ...m,
                  data: {
                    ...m.data,
                    bookedTripId: res.data.tripId,
                  },
                };
              }
              return m;
            });
            store.setMessages(conversationId, newMessages);
          }

          setTimeout(() => {
            router.replace(`/trips?confirmed=${invoice.bookingId}`);
          }, 3000);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setStep("payment");
          setError(
            "Payment not detected yet. Send the exact amount and try again.",
          );
        }
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        }
      }
    };

    poll();
  }

  // Build QR value: prefer the stored paymentUri, fall back to computing it
  const qrValue = invoice?.paymentUri
    ? invoice.paymentUri
    : invoice?.paymentAddress
      ? buildBCHPaymentURI(
          invoice.paymentAddress,
          invoice.amountBch,
          "TripFi booking",
        )
      : "";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && step !== "polling") onClose();
      }}
    >
      <SheetContent
        onInteractOutside={(e) => {
          if (step === "polling") e.preventDefault();
        }}
        side="bottom"
        className="bg-surface-card border-border rounded-t-3xl px-0 pb-0 sm:max-w-lg sm:mx-auto sm:rounded-3xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 focus:outline-none overflow-hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-1 pb-2 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <AnimatePresence mode="wait">
          {step === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SheetHeader className="px-6 pb-4 border-b border-border text-left">
                <SheetTitle className="text-foreground font-bold text-lg flex items-center gap-2">
                  Confirm booking
                  <TestnetBadge />
                </SheetTitle>
                <SheetDescription className="text-secondary text-xs">
                  {itinerary.totalDays ?? 0} days in {itinerary.destination}
                </SheetDescription>
              </SheetHeader>

              <div className="px-6 py-4 space-y-3">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${
                    IS_TESTNET
                      ? "bg-amber-500/10 border-amber-500/20"
                      : "bg-primary/10 border-primary/20"
                  }`}
                >
                  <Shield
                    className={`w-4 h-4 shrink-0 ${IS_TESTNET ? "text-amber-400" : "text-primary"}`}
                  />
                  <p
                    className={`text-xs font-medium ${IS_TESTNET ? "text-amber-400" : "text-primary"}`}
                  >
                    {" "}
                    {IS_TESTNET
                      ? `Testnet mode — prices are randomized for demo purposes`
                      : `${activeNetwork.label} — real BCH will be charged`}
                  </p>
                </div>

                {costs.flightCost > 0 && (
                  <CostRow
                    icon={<Plane className="w-4 h-4" />}
                    label="Flights"
                    amount={costs.flightCost}
                  />
                )}
                {costs.hotelCost > 0 && (
                  <CostRow
                    icon={<Hotel className="w-4 h-4" />}
                    label={`Hotel (${itinerary.totalDays} nights)`}
                    amount={costs.hotelCost}
                  />
                )}
                {costs.activitiesCost > 0 && (
                  <CostRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Activities"
                    amount={costs.activitiesCost}
                  />
                )}
                {costs.taxesAndFees > 0 && (
                  <CostRow
                    icon={<Receipt className="w-4 h-4" />}
                    label="Taxes and fees (est.)"
                    amount={costs.taxesAndFees}
                  />
                )}

                <Separator />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-foreground font-bold">Total</span>
                  <div className="text-right">
                    {" "}
                    <p className="text-foreground font-bold text-lg">
                      ${totalUsd.toFixed(2)}{" "}
                    </p>{" "}
                    <p className="text-primary text-sm font-medium">
                      {totalBchCalculated.toFixed(8)} BCH{" "}
                    </p>
                  </div>
                </div>

                <p className="text-secondary text-xs text-center">
                  Live Rate: 1 BCH = ${bchRate?.toLocaleString() ?? "..."}
                </p>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center px-6 pb-2">
                  {error}
                </p>
              )}

              <div className="px-6 pb-10 pt-2">
                <Button
                  onClick={handleCreateInvoice}
                  disabled={isLoading}
                  className="w-full bg-primary text-black font-bold rounded-full h-14 text-base hover:bg-primary/90 gap-2"
                >
                  {isLoading ? (
                    <>
                      {" "}
                      <Loader2 className="w-5 h-5 animate-spin" />{" "}
                      Generating...{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <Bitcoin className="w-5 h-5" /> Generate payment
                      address{" "}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "payment" && invoice && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SheetHeader className="px-6 pb-4 border-b border-border text-center">
                <SheetTitle className="text-foreground font-bold text-lg">
                  Pay with Bitcoin Cash
                </SheetTitle>
              </SheetHeader>

              <div className="px-6 py-6 space-y-6">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border w-max mx-auto ${
                    IS_TESTNET
                      ? "bg-amber-500/10 border-amber-500/20"
                      : "bg-primary/10 border-primary/20"
                  }`}
                >
                  <Shield
                    className={`w-4 h-4 shrink-0 ${IS_TESTNET ? "text-amber-400" : "text-primary"}`}
                  />
                  <p
                    className={`text-xs font-medium ${IS_TESTNET ? "text-amber-400" : "text-primary"}`}
                  >
                    {" "}
                    {IS_TESTNET
                      ? `Testnet mode — prices are randomized for demo purposes`
                      : `${invoice.networkLabel ?? activeNetwork.label} — real BCH will be charged`}
                  </p>
                </div>

                {/* Restore banner — shown when a previous address was recovered */}
                {invoice.wasRestored && (
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <p className="text-blue-400 text-xs">
                      Previous payment address restored. Send to the same
                      address shown below.
                    </p>
                  </div>
                )}

                <div className="bg-white p-4 rounded-2xl w-max mx-auto">
                  <QRCodeSVG
                    value={qrValue}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm text-secondary">Amount</p>
                  <p className="text-3xl font-bold text-foreground">
                    {" "}
                    {invoice.amountBch.toFixed(8)}{" "}
                    <span className="text-lg text-primary ml-2">BCH</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-secondary text-center">Address</p>
                  <div className="flex items-center gap-2 bg-surface p-3 rounded-xl border border-border">
                    {" "}
                    <p className="text-xs font-mono text-foreground truncate flex-1">
                      {" "}
                      {invoice.paymentAddress}{" "}
                    </p>{" "}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyAddress}
                      className="h-8 w-8 text-secondary hover:text-foreground"
                    >
                      {" "}
                      {copied ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}{" "}
                    </Button>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center px-6 pb-2">
                  {error}
                </p>
              )}

              <div className="px-6 pb-10 pt-2 space-y-3">
                <Button
                  onClick={handleStartPolling}
                  className="w-full bg-primary text-black font-bold rounded-full h-14 text-base hover:bg-primary/90"
                >
                  I have sent the payment
                </Button>
                <p className="text-center text-xs text-secondary">
                  Send exactly {invoice.amountBch.toFixed(8)} BCH to this
                  address
                </p>
              </div>
            </motion.div>
          )}

          {step === "polling" && (
            <motion.div
              key="polling"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-20 flex flex-col items-center justify-center text-center px-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Checking blockchain...
              </h3>
              <p className="text-secondary text-sm">
                Waiting for the transaction to be detected.
                <br />
                This may take a few minutes.
              </p>
            </motion.div>
          )}

          {step === "confirmed" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center px-6"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Payment confirmed!
              </h3>
              {txHash && explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm hover:underline mb-4 break-all"
                >
                  {txHash}
                </a>
              )}
              <p className="text-secondary text-sm">
                Taking you to your trip...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}

function CostRow({
  icon,
  label,
  amount,
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-secondary">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-foreground text-sm font-medium">
        ${amount.toFixed(2)}
      </span>
    </div>
  );
}
