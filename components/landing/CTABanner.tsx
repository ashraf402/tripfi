"use client";

import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section className="py-24 bg-(--background) px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-(--primary) px-6 py-16 md:py-24 text-center"
        >
          {/* Background pattern/gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-(--primary) via-(--primary) to-emerald-400 opacity-100" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-black mb-6">
              Ready to fly?
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of travelers saving money and time with TripFi. No
              credit card required to start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-black hover:bg-black/80 text-white text-lg font-semibold px-8 py-4 rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer">
                Create Free Account
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white text-lg font-semibold px-8 py-4 rounded-full transition-all backdrop-blur-sm cursor-pointer border border-transparent hover:border-white/40">
                View Destinations
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
