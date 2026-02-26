"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

interface IToggleTheme {
  showText?: boolean;
}

export function ThemeToggle({ showText = true }: IToggleTheme) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-2 rounded-full 
                 border border-border bg-surface 
                 text-text-secondary hover:text-foreground
                 hover:border-primary transition-all duration-200
                 text-sm font-medium cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      {showText && (theme === "dark" ? "Light mode" : "Dark mode")}
    </button>
  );
}
