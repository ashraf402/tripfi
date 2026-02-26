import React from "react";

interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center text-center gap-2">
      <span className="text-3xl font-black font-heading text-foreground">
        {value}
      </span>
      <span className="text-sm text-secondary uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
