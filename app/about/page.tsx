import { AboutBuiltFor } from "@/components/about/AboutBuiltFor";
import { AboutDifference } from "@/components/about/AboutDifference";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutStack } from "@/components/about/AboutStack";
// import { AboutTeam } from "@/components/about/AboutTeam";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import CTASection from "@/components/shared/CTASection";

export const metadata = {
  title: "About | TripFi",
  description:
    "Learn more about the mission, team, and technology behind TripFi.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <div className="flex-1">
        <AboutHero />
        <AboutMission />
        <AboutDifference />
        <AboutBuiltFor />
        {/* <AboutTeam /> */}
        <AboutStack />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
