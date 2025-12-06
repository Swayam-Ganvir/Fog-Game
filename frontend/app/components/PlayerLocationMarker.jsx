"use client";

import { Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// Player icon
const playerIcon = new L.Icon({
  iconUrl: "/player-marker.svg", // Ensure this file exists in /public
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function PlayerLocationMarker({ setTrail }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  const revealFog = (latlng) => {
    setTrail((prevTrail) => {
      const alreadyVisited = prevTrail.some(
        (p) =>
          Math.abs(p[0] - latlng[0]) < 0.0001 &&
          Math.abs(p[1] - latlng[1]) < 0.0001
      );
      if (!alreadyVisited) {
        return [...prevTrail, latlng];
      }
      return prevTrail;
    });
  };

  useEffect(() => {
    if (!map) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        setPosition(latlng);
        map.setView(latlng, map.getZoom());
        revealFog(latlng);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);

    // 2️⃣ Simulation mode for testing
    // const simulatedPath = [
    //   [51.505, -0.09],
    //   [51.506, -0.091],
    //   [51.507, -0.092],
    //   [51.508, -0.093],
    //   [51.509, -0.094],
    // ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < simulatedPath.length) {
        const latlng = simulatedPath[index];
        setPosition(latlng);
        map.setView(latlng, map.getZoom());
        revealFog(latlng);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2000); // moves every 2 seconds

    return () => clearInterval(interval);
  }, [map]);

  return position ? (
    <Marker position={position} icon={playerIcon}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}
