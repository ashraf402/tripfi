"use client";

import { format } from "date-fns";
import type { LegalDocument, LegalSection } from "@/lib/types/legal";

interface LegalPageProps {
  document: LegalDocument;
}

export function LegalPage({ document: doc }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="my-12">
          <h1 className="text-foreground text-3xl font-bold tracking-tight mb-3">
            {doc.title}
          </h1>
          <div className="flex items-center gap-4 text-text-secondary text-sm">
            <span>
              Effective: {format(new Date(doc.effectiveDate), "MMMM d, yyyy")}
            </span>
            <span>·</span>
            <span>
              Last updated: {format(new Date(doc.lastUpdated), "MMMM d, yyyy")}
            </span>
          </div>
        </div>

        {/* Table of contents */}
        <nav className="bg-surface border border-border rounded-2xl p-6 mb-12">
          <p className="text-foreground font-semibold text-sm mb-4">Contents</p>
          <ol className="space-y-2">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(section.id)
                      ?.scrollIntoView({ behavior: "smooth" });

                    // Also update the URL hash without jumping
                    window.history.pushState(null, "", `#${section.id}`);
                  }}
                  className="text-text-secondary hover:text-primary text-sm transition-colors"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-12">
          {doc.sections.map((section) => (
            <LegalSectionBlock key={section.id} section={section} />
          ))}
        </div>

        {/* Footer contact */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-text-secondary text-sm">
            Questions about this document? Contact us at{" "}
            <a
              href={`mailto:${doc.contact.email}`}
              className="text-primary hover:underline"
            >
              {doc.contact.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function LegalSectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-foreground text-xl font-bold mb-4">
        {section.heading}
      </h2>

      {section.content && (
        <p className="text-text-secondary leading-relaxed mb-4">
          {section.content}
        </p>
      )}

      {section.list && (
        <ul className="space-y-2 mb-4 ml-4">
          {section.list.map((item, i) => (
            <li
              key={i}
              className="text-text-secondary leading-relaxed flex items-start gap-2"
            >
              <span className="text-primary mt-1.5 shrink-0 text-xs">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.footer && (
        <p className="text-text-secondary leading-relaxed mt-4 italic text-sm">
          {section.footer}
        </p>
      )}

      {section.subsections && (
        <div className="space-y-6 mt-4">
          {section.subsections.map((sub) => (
            <div key={sub.heading}>
              <h3 className="text-foreground font-semibold text-base mb-2">
                {sub.heading}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {sub.content}
              </p>
              {sub.list && (
                <ul className="space-y-2 mt-3 ml-4">
                  {sub.list.map((item, i) => (
                    <li
                      key={i}
                      className="text-text-secondary leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-primary mt-1.5 shrink-0 text-xs">
                        ▸
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
