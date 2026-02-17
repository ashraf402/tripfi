"use client";

export default function TrustedBy() {
  const brands = ["Coinbase", "Binance", "Bitcoin.com", "Travala", "Expedia"];

  return (
    <section className="py-10 border-b border-(--border) bg-(--surface)">
      <div className="container px-4 max-w-6xl mx-auto">
        <p className="text-center text-sm font-medium font-heading text-(--text-secondary) mb-8 uppercase tracking-wider">
          TRUSTED BY MODERN TRAVELERS FROM
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-xl md:text-2xl font-bold text-(--text-secondary) hover:text-(--foreground) transition-colors cursor-default"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
