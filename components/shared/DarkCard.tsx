import React from "react";

interface DarkCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DarkCard({ children, className = "" }: DarkCardProps) {
  return (
    <div
      className={`p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all hover:shadow-glow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
