"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { MapData } from "@/lib/types/chat";

const MapComponent = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-100 rounded-2xl" />,
});

interface TripMapProps {
  data: MapData;
  activeMarkerId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export function TripMap({ data, activeMarkerId, onMarkerClick }: TripMapProps) {
  // We need to ensure window exists before rendering anything map related
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-full h-100 rounded-2xl" />;
  }

  return (
    <div className="size-full min-h-100 rounded-2xl md:rounded-none overflow-hidden border border-border shadow-sm relative z-0">
      <MapComponent
        data={data}
        activeMarkerId={activeMarkerId}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
}
