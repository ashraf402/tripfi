import { AboutDifferenceCard } from "./AboutDifferenceCard";

export function AboutDifference() {
  const differences = [
    {
      icon: "brain",
      title: "AI-Powered Planning",
      description:
      "Smart itineraries generated in seconds using Groq & Gemini. Forget hours of research; get a personalized plan instantly.",
    },
    {
      icon: "currency_bitcoin_2",
      title: "Pay with BCH",
      description:
      "Seamless, borderless crypto payments. No foreign transaction fees, instant settlement, and peer-to-peer freedom.",
    },
    {
      icon: "server",
      title: "Real-Time Data",
      description:
        "Live pricing and availability sourced directly from Amadeus APIs, ensuring your trip is bookable the moment you decide.",
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-20 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {differences.map((diff, index) => (
            <AboutDifferenceCard
              key={index}
              icon={diff.icon}
              title={diff.title}
              description={diff.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
