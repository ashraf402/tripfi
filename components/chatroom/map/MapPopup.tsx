"use client";

import type { MapMarker } from "@/lib/types/chat";
import { X } from "lucide-react";
import Link from "next/link";

interface MapPopupProps {
  marker: MapMarker;
  onClose: () => void;
}

export function MapPopup({ marker, onClose }: MapPopupProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-50 bg-surface border border-border rounded-xl p-3 shadow-lg animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground line-clamp-1">
            {marker.name}
          </h4>
          {marker.description && (
            <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">
              {marker.description}
            </p>
          )}
          <Link
            href="#"
            className="text-xs text-primary hover:underline mt-2 inline-block"
            onClick={(e) => e.preventDefault()} // Prevent nav for mock
          >
            View Details
          </Link>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
