"use client";
import React, { useEffect, useState } from "react";
import "../mist.css";
import { useMap } from "react-leaflet";

export default function MistOverlay({ trail }) {
  const map = useMap();
  const maskId = "fog-mask";
  const [pixelTrail, setPixelTrail] = useState([]);


  // Create custom pane for fog
  useEffect(() => {
    // Create pane only once
    if (!map.getPane("mistPane")) {
      const pane = map.createPane("mistPane");
      pane.style.zIndex = 250; // Below markers and popups
      pane.style.pointerEvents = "none";
    }
  }, [map]);


  // Convert lat/lng trail to pixel positions
  const updatePixelTrail = () => {
    const pixels = trail.map((latlng) => {
      const point = map.latLngToContainerPoint(latlng);
      return { x: point.x, y: point.y };
    });
    setPixelTrail(pixels);
  };

  useEffect(() => {
    updatePixelTrail();
    map.on("move", updatePixelTrail);
    map.on("zoom", updatePixelTrail);

    return () => {
      map.off("move", updatePixelTrail);
      map.off("zoom", updatePixelTrail);
    };
  }, [map, trail]);

  return (
    // Attach directly over the Leaflet overlay pane
    <div
      className="mist-layer leaflet-overlay-pane"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Don't block map interactions
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <mask id={maskId}>
          {/* Start fully fogged */}
          <rect width="100%" height="100%" fill="white" />
          {/* Cut holes for visited trail */}
          {pixelTrail.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={60} // radius of reveal
              fill="black"
            />
          ))}
        </mask>
      </svg>

      <div
        className="fog-content"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      >
        {/* Clouds */}
        {[...Array(8)].map((_, i) => (
          <div key={`cloud-${i}`} className={`mist-cloud cloud-${(i % 8) + 1}`} />
        ))}
        {/* Medium mist */}
        {[...Array(5)].map((_, i) => (
          <div key={`medium-${i}`} className={`mist-medium medium-${i + 1}`} />
        ))}
        {/* Small mist */}
        {[...Array(4)].map((_, i) => (
          <div key={`small-${i}`} className={`mist-small small-${i + 1}`} />
        ))}
        {/* Overlay layers */}
        {[...Array(3)].map((_, i) => (
          <React.Fragment key={`fog-pair-${i}`}>
            <div className="fog-overlay" />
            <div className="wispy-mist" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
