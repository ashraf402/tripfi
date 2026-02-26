"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="py-24 bg-background px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-primary px-6 py-16 md:py-24 text-center"
        >
          {/* Background pattern/gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-emerald-400 opacity-100" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-background),transparent_50%)] opacity-20" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-surface mb-6">
              Ready to fly?
            </h2>
            <p className="text-surface/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of travelers saving money and time with TripFi. No
              credit card required to start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-surface hover:bg-background/90 text-primary text-lg font-semibold px-8 py-4 h-fit rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer">
                  Create Free Account
                </Button>
              </Link>

              <Button className="h-fit text-lg font-semibold px-8 py-4 rounded-full transition-all backdrop-blur-sm cursor-pointer border-surface hover:border-surface/70 border-2 text-surface ">
                View Destinations
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
