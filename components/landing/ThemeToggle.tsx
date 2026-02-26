"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface IToggleTheme {
  showText?: boolean;
  className?: string;
}

export function ThemeToggle({ showText = true, className }: IToggleTheme) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-surface text-text-secondary hover:text-foreground hover:border-primary transition-all duration-200 text-sm font-medium cursor-pointer",
        !showText && "p-2 size-10",
        className,
      )}
      aria-label="Toggle theme"
      size={showText ? "default" : "icon"}
    >
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      {showText && (theme === "dark" ? "Light mode" : "Dark mode")}
    </Button>
  );
}
