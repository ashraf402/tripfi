import Icon from "@/components/ui/icons/Icon";
import { AboutStats } from "./AboutStats";

export function AboutBuiltFor() {
  return (
    <section className="py-20 px-6 lg:px-20 relative border-t border-border overflow-hidden bg-background">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-size-[40px_40px] bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] opacity-20" />
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
            Built for the{" "}
            <span className="text-primary">BCH-1 Hackcelerator</span>
          </h2>
          <p className="text-secondary text-lg leading-relaxed">
            TripFi was conceived and developed specifically for the Bitcoin Cash
            ecosystem. We&apos;re leveraging the low fees and fast confirmation
            times of BCH to solve real-world payment friction in the travel
            industry.
          </p>
          <div className="flex items-center gap-2 text-primary font-medium">
            <Icon name="rocket" style="fill" />
            <span>Hackathon Submission 2024</span>
          </div>
        </div>

        {/* Stats Row */}
        <AboutStats />
      </div>
    </section>
  );
}
