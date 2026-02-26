"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { MapData, MapMarker } from "@/lib/types/chat";

// ── Custom marker icons per type ──────────────────────

// Lucide SVG paths for each marker type (24x24 viewBox)
const MARKER_ICONS: Record<
  MapMarker["type"],
  { svg: string; bg: string; border: string }
> = {
  hotel: {
    // Building2 icon
    svg: `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 6h4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M10 10h4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M10 14h4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M10 18h4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    bg: "#00D084",
    border: "#00b371",
  },
  activity: {
    // MapPin icon
    svg: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="white" stroke-width="2"/>`,
    bg: "#3B82F6",
    border: "#2563eb",
  },
  airport: {
    // Plane icon
    svg: `<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    bg: "#F97316",
    border: "#ea580c",
  },
  restaurant: {
    // UtensilsCrossed icon
    svg: `<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m2 22 5.5-1.5" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="m18 13 4 4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="m7 21 3-3" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    bg: "#A855F7",
    border: "#9333ea",
  },
};

function createMarkerIcon(type: MapMarker["type"]): L.DivIcon {
  const config = MARKER_ICONS[type] ?? MARKER_ICONS.activity;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background: ${config.bg};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2.5px solid ${config.border};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
          ${config.svg}
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -19],
  });
}

// Pre-build icons so they're reused
const markerIcons: Record<MapMarker["type"], L.DivIcon> = {
  hotel: createMarkerIcon("hotel"),
  activity: createMarkerIcon("activity"),
  airport: createMarkerIcon("airport"),
  restaurant: createMarkerIcon("restaurant"),
};

// ── Map center updater ────────────────────────────────

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

// ── Auto-fit bounds ───────────────────────────────────
// Adjusts the map view to fit all markers

function FitBounds({ markers }: { markers: MapData["markers"] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length < 2) return;
    const bounds = L.latLngBounds(
      markers.map((m) => [m.latitude, m.longitude] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [markers, map]);

  return null;
}

// ── Custom zoom controls ──────────────────────────────

function ZoomControls() {
  const map = useMap();

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <button
        onClick={() => map.zoomIn()}
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(30,30,30,0.85)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: 18,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(30,30,30,0.85)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: 18,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────

interface LeafletMapProps {
  data: MapData;
  activeMarkerId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export default function LeafletMap({
  data,
  activeMarkerId,
  onMarkerClick,
}: LeafletMapProps) {
  const { theme } = useTheme();

  // Build polyline path from marker order
  const polylinePath: [number, number][] = data.markers.map((m) => [
    m.latitude,
    m.longitude,
  ]);

  const shouldDrawRoute = data.markers.length >= 2;

  return (
    <MapContainer
      center={[data.centerLat, data.centerLng]}
      zoom={data.zoom}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false} /* Hide attribution to prevent UI overlap */
      style={{ height: "100%", width: "100%" }}
    >
      {/* Theme-dependent tile layer */}
      <TileLayer
        url={
          theme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
      />

      <MapUpdater center={[data.centerLat, data.centerLng]} zoom={data.zoom} />

      {/* Auto-fit when multiple markers */}
      {data.markers.length >= 2 && <FitBounds markers={data.markers} />}

      {/* Custom zoom controls */}
      <ZoomControls />

      {/* Route polyline connecting waypoints */}
      {shouldDrawRoute && (
        <Polyline
          positions={polylinePath}
          pathOptions={{
            color: "#6366f1",
            weight: 3,
            opacity: 0.7,
            dashArray: "8, 6",
          }}
        />
      )}

      {/* Custom markers */}
      {data.markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={markerIcons[marker.type] ?? markerIcons.activity}
          eventHandlers={{
            click: () => onMarkerClick?.(marker.id),
          }}
        >
          <Popup>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                minWidth: 160,
                padding: "2px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: MARKER_ICONS[marker.type]?.bg ?? "#888",
                    flexShrink: 0,
                  }}
                />
                <strong style={{ fontSize: 13 }}>{marker.name}</strong>
              </div>
              {marker.description && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#666",
                    margin: "4px 0 0",
                    lineHeight: 1.4,
                  }}
                >
                  {marker.description}
                </p>
              )}
              <div
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: MARKER_ICONS[marker.type]?.bg ?? "#888",
                  fontWeight: 600,
                  marginTop: 6,
                  paddingTop: 4,
                  borderTop: "1px solid #eee",
                }}
              >
                {marker.type}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
