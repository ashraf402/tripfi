"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white" | "dark";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Determine the logo source based on variant and theme
  const getSrc = () => {
    if (variant === "white") return "/images/logo-white.png";
    if (variant === "dark") return "/images/logo-dark.png";
    // "default" — theme-aware
    if (!mounted) return "/images/logo-dark.png"; // SSR fallback
    return resolvedTheme === "dark"
      ? "/images/logo-white.png"
      : "/images/logo-dark.png";
  };

  return (
    <div className={cn("relative h-8 w-auto aspect-3/1", className)}>
      <Image
        src={getSrc()}
        alt="TripFi Logo"
        width={100}
        height={32}
        className="object-contain max-w-full h-auto"
        priority
      />
    </div>
  );
}
