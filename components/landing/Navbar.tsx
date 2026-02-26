"use client";

import { Logo } from "@/components/landing/Logo";
import { createClient } from "@/lib/supabase/client";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

// --- Micro Components --- //

const NavItem = ({
  href,
  onClick,
  children,
  className,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const isAnchor = href.startsWith("/#");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnchor) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (onClick) onClick();
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

const NavLinksGroup = ({
  isLoggedIn,
  className,
  onLinkClick,
}: {
  isLoggedIn: boolean;
  className?: string;
  onLinkClick?: () => void;
}) => {
  const loggedOutLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Features", href: "/#features" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ];

  const loggedInLinks = [
    { label: "My Trips", href: "/new" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "History", href: "/dashboard" },
  ];

  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  return (
    <>
      {links.map((link) => (
        <NavItem
          key={link.label}
          href={link.href}
          onClick={onLinkClick}
          className={className}
        >
          {link.label}
        </NavItem>
      ))}
    </>
  );
};

const AuthButtons = ({
  isLoggedIn,
  textClassName,
  btnClassName,
  onLinkClick,
}: {
  isLoggedIn: boolean;
  textClassName?: string;
  btnClassName?: string;
  onLinkClick?: () => void;
}) => {
  return (
    <>
      {!isLoggedIn && (
        <NavItem href="/login" onClick={onLinkClick} className={textClassName}>
          Log in
        </NavItem>
      )}
      <NavItem
        href={isLoggedIn ? "/new" : "/signup"}
        onClick={onLinkClick}
        className={btnClassName}
      >
        {isLoggedIn ? "Continue Planning" : "Get Started"}
      </NavItem>
    </>
  );
};

// --- Main Navbar Component --- //

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [navState, setNavState] = useState<NavState>("hero");
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroHeight = useRef<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        <Link href="/">
          <Logo variant={navState === "hero" ? "white" : "default"} />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLinksGroup
            isLoggedIn={isLoggedIn}
            className={`text-sm font-medium transition-colors duration-300 ${current.text} hover:text-primary`}
          />
        </nav>

        <div className="flex items-center gap-3">
          <AuthButtons
            isLoggedIn={isLoggedIn}
            textClassName={`text-sm font-medium transition-colors duration-300 ${current.text} hover:text-primary hidden md:block`}
            btnClassName={`bg-[#00D084] text-black font-semibold rounded-full px-5 py-2 text-sm shrink-0 hover:bg-[#00B36E] transition-colors duration-200 cursor-pointer`}
          />

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
          <NavLinksGroup
            isLoggedIn={isLoggedIn}
            onLinkClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-medium py-2 transition-colors duration-300 ${current.text} hover:text-primary`}
          />
          <div className="flex flex-col gap-6 mt-2 border-t border-gray-100/10 pt-4">
            <AuthButtons
              isLoggedIn={isLoggedIn}
              onLinkClick={() => setMobileMenuOpen(false)}
              textClassName={`text-sm font-medium py-2 transition-colors duration-300 ${current.text} hover:text-primary`}
              btnClassName={`bg-[#00D084] text-black font-semibold rounded-full px-5 py-2 text-sm text-center hover:bg-[#00B36E] transition-colors duration-200 cursor-pointer`}
            />
          </div>
        </div>
      )}
    </header>
  );
}
