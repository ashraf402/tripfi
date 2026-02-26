"use client";

import type { WeatherData } from "@/lib/types/chat";
import { CloudSun, Droplets, Info, Wind } from "lucide-react";
import { WeatherForecast } from "./WeatherForecast";

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className="w-full rounded-2xl border border-border bg-surface-card p-5">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-text-secondary">
            {data.destination}
          </div>
          <div className="mt-1 font-heading text-4xl font-bold text-foreground">
            {data.currentTemp}°C
          </div>
          <div className="mt-1 text-sm font-medium text-primary">
            {data.description}
          </div>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <CloudSun className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5" />
          Hum: {data.humidity}%
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="h-3.5 w-3.5" />
          Wind: {data.windSpeed} km/h
        </div>
      </div>

      <WeatherForecast forecast={data.forecast} />

      <div className="mt-4 flex gap-2 rounded-lg bg-blue-500/10 p-3 text-blue-400">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p className="text-xs">{data.packingTip}</p>
      </div>
    </div>
  );
}
