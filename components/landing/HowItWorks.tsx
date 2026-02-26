"use client";

import { motion } from "framer-motion";
import { Search, CreditCard, Plane } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find your trip",
    description:
      "Search millions of flights and hotels worldwide with our AI-powered engine.",
  },
  {
    icon: CreditCard,
    title: "Pay with BCH",
    description:
      "Connect your wallet and pay instantly with Bitcoin Cash. No hidden fees.",
  },
  {
    icon: Plane,
    title: "Travel freely",
    description:
      "Receive your booking confirmation instantly and enjoy your trip.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-4">
            3 simple steps
          </h2>
          <p className="text-text-secondary text-lg">
            Booking your next adventure is as easy as 1-2-3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mb-6 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(0,208,132,0.2)] transition-all duration-300 relative z-10">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
