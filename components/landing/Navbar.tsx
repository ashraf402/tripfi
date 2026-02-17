"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/landing/Logo";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

type NavState = "hero" | "light" | "dark";

const navStyles = {
  hero: {
    wrapper: "bg-transparent border-b border-transparent",
    text: "text-white",
    logo: "/images/logo-white.png",
    hamburger: "text-white",
  },
  light: {
    wrapper:
      "bg-white/85 backdrop-blur-md border-b border-[var(--border)] shadow-sm",
    text: "text-[#0A0A0A]",
    logo: "/images/logo-dark.png",
    hamburger: "text-[#0A0A0A]",
  },
  dark: {
    wrapper: "bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[var(--border)]",
    text: "text-white",
    logo: "/images/logo-white.png",
    hamburger: "text-white",
  },
};

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [navState, setNavState] = useState<NavState>("hero");
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroHeight = useRef<number>(0);

  useEffect(() => {
    setMounted(true);

    // Measure hero section height dynamically
    const heroSection = document.querySelector("#hero");
    if (heroSection) {
      heroHeight.current = heroSection.getBoundingClientRect().height;
    }

    const scrollViewport = document.querySelector(
      '[data-main-scroll="true"] [data-radix-scroll-area-viewport]',
    );

    const handleScroll = () => {
      const scrollTop = scrollViewport
        ? (scrollViewport as HTMLElement).scrollTop
        : window.scrollY;

      if (scrollTop < heroHeight.current) {
        setNavState("hero");
      } else {
        setNavState(resolvedTheme === "dark" ? "dark" : "light");
      }
    };

    const target = scrollViewport || window;
    target.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => target.removeEventListener("scroll", handleScroll);
  }, [resolvedTheme]);

  // SSR fallback — avoids hydration mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-transparent" />
    );
  }

  const current = navStyles[navState];

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${current.wrapper}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo — swaps based on state */}
        {/* Logo — swaps based on state */}
        <Link href="/">
          <Logo variant={navState === "hero" ? "white" : "default"} />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Pricing"].map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              className={`
                text-sm font-medium transition-colors duration-300
                ${current.text}
                hover:text-(--primary)
              `}
            >
              {link}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* CTA — NEVER changes, theme-immune */}
          <button
            className="bg-[#00D084] text-black font-semibold
                       rounded-full px-5 py-2 text-sm shrink-0
                       hover:bg-[#00B36E] transition-colors duration-200 cursor-pointer"
          >
            Get Started
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`
              md:hidden transition-colors duration-300
              ${current.hamburger}
            `}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          className={`
            md:hidden px-4 pb-4 flex flex-col gap-4
            ${
              navState === "hero"
                ? "bg-black/70 backdrop-blur-md"
                : navState === "dark"
                  ? "bg-[#0A0A0A]/95"
                  : "bg-white/95"
            }
          `}
        >
          {["Features", "How it Works", "Pricing"].map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                text-sm font-medium py-2 transition-colors duration-300
                ${current.text}
                hover:text-(--primary)
              `}
            >
              {link}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
