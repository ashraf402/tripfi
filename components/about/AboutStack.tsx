import { TechPill } from "@/components/shared/TechPill";

export function AboutStack() {
  const stack = [
    { name: "Next.js 16", iconName: "next-js", isInvertible: true },
    { name: "TypeScript", iconName: "typescript" },
    { name: "Supabase", iconName: "supabase" },
    { name: "Groq AI", iconName: "groq-ai", isInvertible: true },
    { name: "Google Gemini", iconName: "gemini-ai" },
    { name: "Amadeus API", iconName: "amadeus" },
    { name: "Bitcoin Cash", iconName: "bitcoin-cash" },
    { name: "Tailwind CSS", iconName: "tailwind-css" },
  ];

  return (
    <section className="py-16 px-6 lg:px-20 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <p className="text-sm font-semibold text-muted uppercase tracking-widest">
          Powered By
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl">
          {stack.map((item, i) => (
            <TechPill
              key={i}
              name={item.name}
              iconName={item.iconName}
              invertible={item.isInvertible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
