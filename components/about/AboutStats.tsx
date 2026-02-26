import { StatCard } from "@/components/shared/StatCard";

export function AboutStats() {
  const stats = [
    { value: "1 Week", label: "Dev Time" },
    { value: "$20K", label: "Prize Track" },
    { value: "∞", label: "Trips Possible" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {stats.map((stat, i) => (
        <StatCard key={i} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}
