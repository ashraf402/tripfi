"use client";
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Plane, Clock, AlertTriangle } from "lucide-react";
import type { FlightStatusData } from "@/lib/types/chat";

interface FlightStatusCardProps {
  data: FlightStatusData;
}

export function FlightStatusCard({ data }: FlightStatusCardProps) {
  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "landed":
      case "scheduled":
        return "text-green-500 bg-green-500/10";
      case "delayed":
        return "text-yellow-500 bg-yellow-500/10";
      case "cancelled":
      case "diverted":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-secondary bg-secondary/10";
    }
  };

  const { status, flightNumber, airline, departure, arrival } = data;

  return (
    <Card className="w-full bg-surface border-border overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${getStatusColor(status)}`}>
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {airline} {flightNumber}
              </CardTitle>
              <div
                className={`text-xs font-medium uppercase tracking-wider mt-1 px-2 py-0.5 rounded w-fit ${getStatusColor(status)}`}
              >
                {status}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
        {/* Departure */}
        <div className="text-left">
          <div className="text-2xl font-bold text-foreground">
            {departure.iataCode}
          </div>
          <div className="text-xs text-secondary mb-2">{departure.airport}</div>
          <div className="text-sm">
            <div className="text-secondary/70 text-xs uppercase mb-0.5">
              Scheduled
            </div>
            <div className="font-mono">
              {new Date(departure.scheduled).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          {departure.actual && (
            <div className="text-sm mt-2 text-primary">
              <div className="text-primary/70 text-xs uppercase mb-0.5">
                Actual
              </div>
              <div className="font-mono">
                {new Date(departure.actual).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}
        </div>

        {/* Flight Path Visual */}
        <div className="flex flex-col items-center justify-center w-full px-4 text-center">
          <div className="text-xs text-secondary mb-2">
            {/* Duration could act as filler here if we calc it */}
            Direct
          </div>
          <div className="relative w-24 h-px bg-border flex items-center justify-center">
            <Plane className="w-4 h-4 text-secondary rotate-90 absolute bg-surface px-1" />
          </div>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">
            {arrival.iataCode}
          </div>
          <div className="text-xs text-secondary mb-2">{arrival.airport}</div>
          <div className="text-sm">
            <div className="text-secondary/70 text-xs uppercase mb-0.5">
              Scheduled
            </div>
            <div className="font-mono">
              {new Date(arrival.scheduled).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          {arrival.estimated && (
            <div className="text-sm mt-2 text-primary">
              <div className="text-primary/70 text-xs uppercase mb-0.5">
                Estimated
              </div>
              <div className="font-mono">
                {new Date(arrival.estimated).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
