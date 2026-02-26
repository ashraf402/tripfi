import { SectionHeader } from "@/components/shared/SectionHeader";
import { Compass } from "lucide-react";

export function AboutMission() {
  return (
    <section className="py-20 px-6 bg-surface border-y border-border">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          icon="compass"
          headline="Our Mission"
          subtext="To decentralize travel by making planning instant and payments borderless through the power of Bitcoin Cash and Artificial Intelligence."
          centered
        />
      </div>
    </section>
  );
}
