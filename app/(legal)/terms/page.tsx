import { getLegalDocument } from "@/lib/utils/legalContent";
import { LegalPage } from "@/components/legal/LegalPage";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export async function generateMetadata() {
  const doc = getLegalDocument("terms-of-service");
  return {
    title: `${doc.title} — TripFi`,
    description: `TripFi ${doc.title}. Last updated ${doc.lastUpdated}.`,
  };
}

export default function Page() {
  const doc = getLegalDocument("terms-of-service");
  return (
    <main className="flex min-h-screen w-full flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <div className="flex-1">
        <LegalPage document={doc} />
      </div>
      <Footer />
    </main>
  );
}
