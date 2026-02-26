import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import BCHSection from "@/components/landing/BCHSection";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/landing/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col bg-black text-white selection:bg-primary selection:text-black overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <ScrollArea data-main-scroll="true" className="h-full w-full">
          <Hero />
          {/* <TrustedBy /> */}
          <Features />
          <HowItWorks />
          <BCHSection />
          <Testimonials />
          <Pricing />
          <CTASection />
          <Footer />
        </ScrollArea>
        <ScrollToTop />
      </div>
    </main>
  );
}
