"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";

export default function BCHSection() {
  return (
    <section className="py-24 bg-(--background) relative overflow-hidden px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--primary)/10 text-(--primary) text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-(--primary) animate-pulse" />
              NOW LIVE: BCH PAYMENTS
            </div>

            <h2 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-(--foreground) mb-6">
              <span className="text-(--primary)">Bitcoin Cash</span>
            </h2>

            <p className="text-xl text-(--text-secondary) mb-8 leading-relaxed max-w-lg">
              Book flights and hotels instantly with zero foreign transaction
              fees. Experience the future of borderless travel with
              crypto-native speed.
            </p>

            <button className="group bg-(--primary) hover:bg-(--primary-hover) text-black text-lg font-semibold px-8 py-4 rounded-full transition-all flex items-center gap-2 hover:shadow-[0_0_24px_rgba(0,208,132,0.2)]">
              Start Booking
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-12 flex items-center gap-4">
              {/* Avatars placeholder */}
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-(--background) bg-(--surface) flex items-center justify-center text-xs text-(--text-secondary)"
                  >
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-(--text-secondary)">
                Join 10,000+ travelers today
              </p>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-4/3 rounded-4xl overflow-hidden border border-(--border) shadow-2xl">
              <Image
                src="/images/landing/bch_wing.png"
                alt="View from airplane window"
                fill
                className="object-cover max-w-full h-auto"
              />

              {/* Overlay Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-(--surface)/60 backdrop-blur-md border border-(--border) p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-(--text-secondary)">
                      Transaction Confirmed
                    </p>
                    <p className="text-(--foreground) font-medium">
                      Flight to Tokyo
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-(--text-secondary)">Fee</p>
                  <p className="text-(--primary) font-bold">$0.01</p>
                </div>
              </div>
            </div>

            {/* Glow effect behind */}
            <div className="absolute -inset-4 bg-(--primary)/20 blur-[100px] -z-10 rounded-full opacity-50 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
