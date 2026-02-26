"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { FlightSearchResults } from "../flights/FlightSearchResults";
import { HotelSearchResults } from "../hotels/HotelSearchResults";
import { ItineraryCard } from "../itinerary/ItineraryCard";
import { DestinationGrid } from "../destinations/DestinationGrid";
import { ActivitySearchResults } from "../activities/ActivitySearchResults";
import { PriceSummaryCard } from "../budget/PriceSummaryCard";
import { WeatherCard } from "../weather/WeatherCard";
import { TripMap } from "../map/TripMap";
import { MacroMap } from "../maps/MacroMap";
import { RouteMap } from "../maps/RouteMap";
import { RadiusMap } from "../maps/RadiusMap";
import type { ChatMessage as ChatMessageType } from "@/lib/types/chat";

// Component Mapping
const COMPONENT_MAP: Record<string, any> = {
  FlightSearchResults, // Responsive
  HotelSearchResults, // Responsive
  ItineraryCard, // Responsive
  DestinationGrid,
  ActivitySearchResults, // Responsive
  PriceSummaryCard,
  WeatherCard, // Responsive
  TripMap,
  MacroMap,
  RouteMap,
  RadiusMap,
};

interface ChatMessageProps {
  message: ChatMessageType;
  onQuickPick?: (text: string) => void;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  onQuickPick,
}: ChatMessageProps) {
  if (message.role === "user") {
    return <UserMessage message={message} />;
  }

  const shouldRender = message.component !== null && message.data !== null;
  const shouldRenderSecondary =
    message.secondaryComponent != null && message.secondaryData != null;

  const RichComponent =
    shouldRender && message.component ? COMPONENT_MAP[message.component] : null;

  const SecondaryComponent =
    shouldRenderSecondary && message.secondaryComponent
      ? COMPONENT_MAP[message.secondaryComponent]
      : null;

  return (
    <div className="flex w-full max-w-screen sm:max-w-full flex-col gap-4">
      <AssistantMessage message={message} onQuickPick={onQuickPick} />

      {shouldRender && RichComponent && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-full"
        >
          <RichComponent data={message.data} />
        </motion.div>
      )}

      {shouldRenderSecondary && SecondaryComponent && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-full max-w-full"
        >
          <SecondaryComponent data={message.secondaryData} />
        </motion.div>
      )}
    </div>
  );
});
