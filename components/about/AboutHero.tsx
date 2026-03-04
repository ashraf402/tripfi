"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Icon from "../ui/icons/Icon";

export function AboutHero() {
  return (
    <section className="relative px-6 py-16 md:py-24 lg:px-20 overflow-hidden mt-20 bg-background">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              BCH-1 Hackcelerator
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading leading-[1.1] tracking-tight text-foreground">
            We&apos;re building the{" "}
            <span className="text-primary">future of travel</span> payments.
          </h1>
          <p className="text-secondary text-lg max-w-lg leading-relaxed">
            AI-driven itineraries meeting peer-to-peer Bitcoin Cash payments.
            Experience borderless travel planning with zero friction.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="h-12 px-8 rounded-full bg-primary text-background font-bold hover:bg-primary-hover transition-colors">
              Start Planning
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-full border-border bg-transparent text-foreground font-medium hover:border-primary hover:text-primary transition-all flex items-center gap-2"
            >
              <Icon name="code" className="size-4" />
              View Source
            </Button>
          </div>
        </motion.div>

        {/* 3D Globe Visual Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-100 w-full flex items-center justify-center lg:justify-end z-10"
        >
          {/* Abstract Globe Representation */}
          <div className="relative w-80 h-80 md:w-112.5 md:h-112.5">
            <div className="w-full aspect-square max-size-120 bg-primary/30 dark:bg-primary/20 rounded-full overflow-hidden border-2 border-primary/40">
              <Image
                src="/images/about/map.svg"
                alt="Sphere"
                fill
                className="absolute object-cover inset-0 opacity-40 rounded-full"
              />
            </div>
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
            {/* <Image src="/images/about/abstract-map.svg" alt="Abstract Map Lines" width={500} height={500} className="absolute inset-0 rounded-full shadow-2xl shadow-primary/20" /> */}
            <div className="absolute inset-4 rounded-full border border-dashed border-primary/30 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-12 rounded-full border border-dotted border-primary/40 animate-[spin_10s_linear_infinite]" />

            {/* Floating Card Example inside the globe area */}
            <div className="absolute top-2/3 left-4/6 -translate-x-1/2 -translate-y-1/2 bg-surface/80 backdrop-blur-md border border-border p-4 rounded-xl flex items-center gap-3 shadow-glow animate-bounce duration-3000 whitespace-nowrap">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Icon name="airplane" className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted">Flight to Tokyo</p>
                <p className="text-sm font-bold text-foreground">0.45 BCH</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
