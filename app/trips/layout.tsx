"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 h-dvh">
        <main className="flex-1 min-h-0 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
