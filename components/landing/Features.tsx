"use client";

import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";
import { Map, Shield, ShieldCheck, Sparkles, TrendingDown } from "lucide-react"; // ShieldCheck for card 2, Shield for card 4
import Image from "next/image";
import { useEffect, useState } from "react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function Features() {
  const [scrollRef, setScrollRef] = useState<{
    current: Element | null;
  } | null>(null);

  useEffect(() => {
    // Locate the scroll viewport element by ID (added in ScrollArea component)
    const viewport = document.getElementById("scroll-area-viewport");
    if (viewport) {
      setScrollRef({ current: viewport });
    }
  }, []);

  return (
    <section className="py-24 px-4 w-full overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            root: scrollRef || undefined,
            once: true,
            margin: "-100px",
          }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tight leading-tight mb-3 font-heading text-foreground">
            Everything you need for{" "}
            <span className="text-primary">seamless travel</span>
          </h2>
          <p className="text-text-secondary max-w-md mb-16 text-lg">
            Experience travel planning reimagined with the power of blockchain
            and AI. Designed for the modern nomad.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* ROW 1: Smart Trip Planning (Large, col-span-4) */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{
              root: scrollRef || undefined,
              once: true,
              amount: 0.2,
            }}
            variants={cardVariants}
            className="group relative col-span-1 md:col-span-2 lg:col-span-4 overflow-hidden rounded-2xl border border-border bg-surface-card backdrop-blur-md p-6 flex flex-col hover:border-primary hover:shadow-[0_0_32px_rgba(0,208,132,0.12)] transition-all duration-300 cursor-pointer min-w-0"
          >
            {/* AI Badge */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border-white/10 text-[10px] font-medium text-primary uppercase tracking-wider"
              >
                <Sparkles className="w-3 h-3" />
                Generative AI Configured
              </Badge>
            </div>

            <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
              <Map className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-2">
              Smart Trip Planning
            </h3>
            <p className="text-text-secondary">
              Our AI analyzes thousands of routes to build your perfect
              itinerary in seconds, not hours.
            </p>
            <div className="mt-4 w-full h-48 rounded-xl overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
                alt="Road through canyon"
                fill
                className="object-cover max-w-full h-auto"
              />
            </div>
          </motion.div>

          {/* ROW 1: Instant Payments (col-span-2) */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{
              root: scrollRef || undefined,
              once: true,
              amount: 0.2,
            }}
            variants={cardVariants}
            className="group col-span-1 md:col-span-2 lg:col-span-2 overflow-hidden rounded-2xl border border-border bg-surface-card backdrop-blur-md p-6 flex flex-col hover:border-primary hover:shadow-[0_0_32px_rgba(0,208,132,0.12)] transition-all duration-300 cursor-pointer min-w-0"
          >
            <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
              {/* Bitcoin B symbol substitute or text */}
              <span className="text-primary font-bold text-lg">₿</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-2">
              Instant Payments
            </h3>
            <p className="text-text-secondary">
              Settle bookings in under a minute with Bitcoin Cash.
            </p>

            <div className="mt-auto pt-8 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Processing Time</span>
                <span className="text-primary font-mono text-right">
                  {"< 2s"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Network Fee</span>
                <span className="text-primary font-mono text-right">
                  $0.001
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Security</span>
                <span className="text-primary font-mono flex items-center gap-1 justify-end">
                  <ShieldCheck size={12} /> AES-256
                </span>
              </div>
            </div>
          </motion.div>

          {/* ROW 2: AI Recommendations (col-span-3) */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{
              root: scrollRef || undefined,
              once: true,
              amount: 0.2,
            }}
            variants={cardVariants}
            className="group col-span-1 lg:col-span-3 overflow-hidden rounded-2xl border border-border bg-surface-card backdrop-blur-md p-6 flex flex-col hover:border-primary hover:shadow-[0_0_32px_rgba(0,208,132,0.12)] transition-all duration-300 cursor-pointer min-w-0"
          >
            {/* AI Badge */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border-white/10 text-[10px] font-medium text-primary uppercase tracking-wider"
              >
                <Sparkles className="w-3 h-3" />
                Generative AI Configured
              </Badge>
            </div>

            <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
              {/* Location Pin substitute using Map or generic */}
              <Map className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-2">
              AI Recommendations
            </h3>
            <p className="text-text-secondary">
              Personalized spots based on your taste profile and past trips.
            </p>
          </motion.div>

          {/* ROW 2: Secure Protocol (col-span-3) */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{
              root: scrollRef || undefined,
              once: true,
              amount: 0.2,
            }}
            variants={cardVariants}
            className="group col-span-1 lg:col-span-3 overflow-hidden rounded-2xl border border-border bg-surface-card backdrop-blur-md p-6 flex flex-col hover:border-primary hover:shadow-[0_0_32px_rgba(0,208,132,0.12)] transition-all duration-300 cursor-pointer min-w-0"
          >
            <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-2">
              Secure Protocol
            </h3>
            <p className="text-text-secondary">
              Cryptographically secured reservations on the blockchain.
            </p>
          </motion.div>

          {/* ROW 3: Unbeatable Low Fees (Large, col-span-6) */}
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{
              root: scrollRef || undefined,
              once: true,
              amount: 0.2,
            }}
            variants={cardVariants}
            className="group col-span-1 md:col-span-2 lg:col-span-6 overflow-hidden rounded-2xl border border-border bg-surface-card backdrop-blur-md p-6 flex flex-col md:flex-row items-center gap-6 hover:border-primary hover:shadow-[0_0_32px_rgba(0,208,132,0.12)] transition-all duration-300 cursor-pointer min-w-0"
          >
            <div className="flex-1">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
                <TrendingDown className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                Unbeatable Low Fees
              </h3>
              <p className="text-text-secondary max-w-sm">
                We cut out the middlemen. No hidden fees, no surprise charges.
                Pay only for your trip.
              </p>
            </div>

            {/* Price Comparison Chart */}
            <div className="flex-1 w-full max-w-sm">
              <div className="space-y-3">
                {/* Competitor A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Competitor A</span>
                    <span>$12.50 fee</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-red-500/50 rounded-full"></div>
                  </div>
                </div>
                {/* Competitor B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Competitor B</span>
                    <span>$9.00 fee</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-yellow-500/50 rounded-full"></div>
                  </div>
                </div>
                {/* TripFi */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-primary">
                    <span>TripFi</span>
                    <span>$0.05 fee</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[2%] bg-primary rounded-full shadow-[0_0_10px_#00D084]"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
