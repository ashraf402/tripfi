"use client";

import { Logo } from "@/components/landing/Logo";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import socials from "@/data/socials.json";
import Link from "next/link";
import Icon from "../ui/icons/Icon";


export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="container px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Logo />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6 text-text-secondary">
              The world's first premium travel booking platform powered by
              Bitcoin Cash. Travel smarter, faster, and cheaper.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-foreground transition-colors"
              >
                <Icon name="social_x" />
              </a>
              <a
                href={socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-foreground transition-colors"
              >
                <Icon name="telegram" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a
                  href="/chat"
                  className="hover:text-primary transition-colors"
                >
                  Flights
                </a>
              </li>
              <li>
                <a
                  href="/chat"
                  className="hover:text-primary transition-colors"
                >
                  Hotels
                </a>
              </li>
              <li>
                <a
                  href="/chat"
                  className="hover:text-primary transition-colors"
                >
                  AI Planner
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-primary transition-colors"
                >
                  Careers
                </a>
              </li>
              {/* <li>
                <a href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a
                  href="/help"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-primary transition-colors">
                  API
                </a>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Refund Policy", href: "/refunds" },
                { label: "Acceptable Use", href: "/acceptable-use" },
                { label: "Disclaimer", href: "/disclaimer" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mt-8" />
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} TripFi, Inc. All rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
