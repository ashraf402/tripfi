"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { WeatherDay } from "@/lib/types/chat";
import { Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";

interface WeatherForecastProps {
  forecast: WeatherDay[];
}

const iconMap: Record<string, any> = {
  current: Sun,
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  wind: Wind,
};

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <div className="mt-4 flex overflow-x-auto pb-2 scrollbar-hide">
      <ScrollArea className="w-full">
        <div className="flex w-full gap-2 ">
          {forecast.map((day, i) => {
            const Icon = iconMap[day.icon] || Sun;
            return (
              <div
                key={i}
                className="flex min-w-17.5 flex-col items-center gap-2 rounded-xl bg-surface p-3 text-center border border-border"
              >
                <span className="text-xs font-medium text-text-secondary">
                  {day.dayLabel}
                </span>
                <Icon className="h-6 w-6 text-primary" />
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-foreground">
                    {day.high}°
                  </span>
                  <span className="text-[10px] text-text-secondary">
                    {day.low}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
