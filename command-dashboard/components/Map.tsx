"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default Leaflet icon not showing
const iconPerson = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Pulsing Red Marker for Accidents
const pulsingIcon = L.divIcon({
  className: "css-icon",
  html: '<div class="pulsing-marker"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export default function MapComponent() {
  
  useEffect(() => {
    // Inject CSS for pulsing marker
    const style = document.createElement('style');
    style.innerHTML = `
      .pulsing-marker {
        width: 20px;
        height: 20px;
        background-color: #ef4444;
        border-radius: 50%;
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 1);
        animation: pulse-red 2s infinite;
      }
      @keyframes pulse-red {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Coordinates for Jakarta (example)
  const center: [number, number] = [-6.2088, 106.8456];
  const accidentPos: [number, number] = [-6.2150, 106.8400];

  return (
    <MapContainer 
      center={center} 
      zoom={14} 
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Regular Train Markers or Station Markers could go here */}
      
      {/* Accident Marker */}
      <Marker position={accidentPos} icon={pulsingIcon}>
        <Popup>
          <div className="text-red-600 font-bold">CRITICAL ALERT</div>
          <div>Obstacle Detected on Track</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
