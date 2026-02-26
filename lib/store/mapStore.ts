import { create } from "zustand";
import type { MapMarker } from "@/lib/types/chat";

interface MapPanelState {
  isOpen: boolean;
  destination: string;
  centerLat: number;
  centerLng: number;
  markers: MapMarker[];
  zoom: number;

  // Actions
  openMap: (config: {
    destination: string;
    centerLat: number;
    centerLng: number;
    markers: MapMarker[];
    zoom?: number;
  }) => void;

  closeMap: () => void;
}

export const useMapStore = create<MapPanelState>((set) => ({
  isOpen: false,
  destination: "",
  centerLat: 0,
  centerLng: 0,
  markers: [],
  zoom: 12,

  openMap: (config) =>
    set({
      isOpen: true,
      destination: config.destination,
      centerLat: config.centerLat,
      centerLng: config.centerLng,
      markers: config.markers,
      zoom: config.zoom ?? 12,
    }),

  closeMap: () => set({ isOpen: false }),
}));

// Convenience selector hooks
export const useMapOpen = () => useMapStore((s) => s.isOpen);

export const useOpenMap = () => useMapStore((s) => s.openMap);

export const useCloseMap = () => useMapStore((s) => s.closeMap);
