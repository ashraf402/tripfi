"use client";

import { Logo } from "@/components/landing/Logo";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import socials from "@/data/socials.json";
import { Headset, Twitter } from "lucide-react";
import Link from "next/link";
import Icon from "../ui/icons/Icon";

const footerLinks = {
  Platform: ["Destinations", "Flights", "Hotels", "Price Alerts"],
  Company: ["About Us", "Careers", "Blog", "Partners"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

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
          {/* The following section is replaced by the user's provided code snippet */}
          {/* {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h4 className="text-foreground font-semibold mb-6">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-text-secondary hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Flights
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Hotels
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
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
                <a href="#" className="hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-heading text-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} TripFi, Inc. All rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
