"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Morgan",
    role: "Digital Nomad",
    content:
      "TripFi has completely changed how I travel. Paying with BCH is seamless and saving 3% on every booking adds up!",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    role: "Crypto Investor",
    content:
      "Finally, a real-world use case for crypto that actually works better than the traditional system. The UI is stunning.",
    stars: 5,
  },
  {
    name: "David Kim",
    role: "Frequent Flyer",
    content:
      "The AI recommendations are spot on. I found a hidden gem in Kyoto that I would have never found otherwise.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-(--surface) border-y border-(--border) px-4">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-center text-(--foreground) mb-16">
          Loved by nomads
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-(--surface-card) backdrop-blur-sm border border-(--border) p-8 rounded-2xl hover:border-(--border-hover) transition-colors"
            >
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-(--text-secondary) mb-6 italic">
                "{t.content}"
              </p>
              <div>
                <p className="text-(--foreground) font-semibold">{t.name}</p>
                <p className="text-sm text-(--text-secondary)/70">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
