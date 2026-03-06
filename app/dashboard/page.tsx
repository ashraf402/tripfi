"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Mock data for demo - in real app would fetch from Supabase
  const stats = [
    { label: "Total Trips", value: "12" },
    { label: "Countries", value: "8" },
    { label: "Money Saved", value: "$1,240" },
  ];

  const recentTrips = [
    {
      id: "1",
      title: "Tokyo Adventure",
      date: "2 days ago",
      status: "Planning",
    },
    {
      id: "2",
      title: "Paris Weekend",
      date: "1 week ago",
      status: "Completed",
    },
    { id: "3", title: "Bali Retreat", date: "2 weeks ago", status: "Saved" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <AppSidebar activeId="" className="border-r border-border" />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <AppSidebar
            activeId=""
            onClose={() => setMobileMenuOpen(false)}
            className="w-full border-r-0"
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden -ml-2 text-text-secondary"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-heading font-bold text-lg">Dashboard</h1>
          </div>
          <Button
            onClick={() => router.push("/chat")}
            size="sm"
            className="gap-2 bg-primary text-black hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            New Trip
          </Button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">
              Welcome back! 👋
            </h2>
            <p className="text-text-secondary">
              Here's an overview of your travel plans.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-surface-card border-border">
                <CardContent className="p-6">
                  <div className="text-sm text-text-secondary mb-1">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold font-heading">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Trips */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-bold">Recent Trips</h3>
              <Link href="#" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTrips.map((trip) => (
                <Link key={trip.id} href={`/chat/${trip.id}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer bg-surface-card border-border group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {trip.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            trip.status === "Completed"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : trip.status === "Saved"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }`}
                        >
                          {trip.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-text-secondary">
                        Edited {trip.date}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Button
                variant="outline"
                onClick={() => router.push("/chat")}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-surface-hover/50 transition-all group h-full min-h-35 whitespace-normal"
              >
                <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="h-5 w-5 text-text-secondary group-hover:text-primary" />
                </div>
                <span className="font-medium text-text-secondary group-hover:text-foreground">
                  Create New Trip
                </span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
