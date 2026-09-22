"use client";

import { useState } from "react";

type Props = {
  name: string;
  location: string;
};

type MapProvider = {
  id: string;
  label: string;
  icon: string;
  href: (q: string) => string;
};

type SearchProvider = {
  id: string;
  label: string;
  icon: string;
  href: (q: string) => string;
};

const MAP_PROVIDERS: MapProvider[] = [
  {
    id: "google",
    label: "Google Maps",
    icon: "🗺️",
    href: (q) => `https://www.google.com/maps/search/?api=1&query=${q}`,
  },
  {
    id: "apple",
    label: "Apple Maps",
    icon: "🍎",
    href: (q) => `https://maps.apple.com/?q=${q}`,
  },
  {
    id: "waze",
    label: "Waze",
    icon: "🚗",
    href: (q) => `https://waze.com/ul?q=${q}&navigate=yes`,
  },
  {
    id: "here",
    label: "HERE Maps",
    icon: "📍",
    href: (q) => `https://share.here.com/l/${q}`,
  },
  {
    id: "osm",
    label: "OpenStreetMap",
    icon: "🌍",
    href: (q) => `https://www.openstreetmap.org/search?query=${q}`,
  },
];

const SEARCH_PROVIDERS: SearchProvider[] = [
  {
    id: "google",
    label: "Google",
    icon: "G",
    href: (q) => `https://www.google.com/search?q=${q}`,
  },
  {
    id: "bing",
    label: "Bing",
    icon: "B",
    href: (q) => `https://www.bing.com/search?q=${q}`,
  },
  {
    id: "ddg",
    label: "DuckDuckGo",
    icon: "🦆",
    href: (q) => `https://duckduckgo.com/?q=${q}`,
  },
  {
    id: "brave",
    label: "Brave Search",
    icon: "🦁",
    href: (q) => `https://search.brave.com/search?q=${q}`,
  },
];

export default function MapSearchLinks({ name, location }: Props) {
  const [open, setOpen] = useState<"map" | "search" | null>(null);

  const mapQuery = encodeURIComponent(`${name}, ${location}, Manipur, India`);
  const searchQuery = encodeURIComponent(`${name} ${location} Manipur`);

  const toggle = (panel: "map" | "search") =>
    setOpen((prev) => (prev === panel ? null : panel));

  return (
    <div className="msl-root">
      <div className="msl-triggers">
        <button
          className={`msl-btn${open === "map" ? " msl-btn--active" : ""}`}
          onClick={() => toggle("map")}
          aria-expanded={open === "map"}
          aria-label="Open in maps"
        >
          <span className="msl-icon">📍</span> Maps
        </button>
        <button
          className={`msl-btn${open === "search" ? " msl-btn--active" : ""}`}
          onClick={() => toggle("search")}
          aria-expanded={open === "search"}
          aria-label="Search online"
        >
          <span className="msl-icon">🔍</span> Search
        </button>
      </div>

      {open === "map" && (
        <div className="msl-panel" role="menu">
          {MAP_PROVIDERS.map((p) => (
            <a
              key={p.id}
              href={p.href(mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="msl-link"
              role="menuitem"
            >
              <span className="msl-provider-icon">{p.icon}</span>
              {p.label}
            </a>
          ))}
        </div>
      )}

      {open === "search" && (
        <div className="msl-panel" role="menu">
          {SEARCH_PROVIDERS.map((p) => (
            <a
              key={p.id}
              href={p.href(searchQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="msl-link"
              role="menuitem"
            >
              <span className="msl-provider-icon msl-provider-icon--text">{p.icon}</span>
              {p.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
