"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-4">
            Simple Pricing
          </h2>
          <p className="text-text-secondary">
            Pay for what you use, or unlock premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-3xl border border-border bg-surface-card">
            <h3 className="text-xl font-bold font-heading text-foreground mb-2">
              Explorer
            </h3>
            <p className="text-3xl font-bold text-foreground mb-6">
              $0
              <span className="text-sm font-normal text-text-secondary">
                /mo
              </span>
            </p>
            <ul className="space-y-4 mb-8 text-text-secondary">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> Zero booking fees
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> BCH Payments
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> Basic Support
              </li>
            </ul>
            <Button
              variant="outline"
              className="w-full py-6 rounded-full text-foreground font-semibold hover:bg-surface transition-colors cursor-pointer text-base"
            >
              Get Started
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="p-8 rounded-3xl border border-primary/50 bg-primary/5 relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Nomad</h3>
            <p className="text-3xl font-bold text-foreground mb-6">
              $9
              <span className="text-sm font-normal text-text-secondary">
                /mo
              </span>
            </p>
            <ul className="space-y-4 mb-8 text-text-secondary-300">
              <li className="flex items-center gap-2 text-foreground">
                <Check className="w-5 h-5 text-primary" /> Everything in
                Explorer
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <Check className="w-5 h-5 text-primary" /> 5% Cash back in BCH
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <Check className="w-5 h-5 text-primary" /> AI Trip Planner Pro
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <Check className="w-5 h-5 text-primary" /> Priority Support
              </li>
            </ul>
            <Button className="w-full py-6 rounded-full bg-primary text-black font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 cursor-pointer text-base">
              Start Free Trial
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-3xl border border-border bg-surface-card">
            <h3 className="text-xl font-bold text-foreground mb-2">Agency</h3>
            <p className="text-3xl font-bold text-foreground mb-6">
              $49
              <span className="text-sm font-normal text-text-secondary">
                /mo
              </span>
            </p>
            <ul className="space-y-4 mb-8 text-text-secondary">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> Everything in Nomad
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> Dedicated Agent
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" /> API Access
              </li>
            </ul>
            <Button
              variant="outline"
              className="w-full py-6 rounded-full text-foreground font-semibold hover:bg-surface transition-colors cursor-pointer text-base"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
