"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

export default function LiveMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null); // Use any for L.Map to avoid type import issues during SSR

    useEffect(() => {
        // Dynamically import Leaflet only on the client side
        const initMap = async () => {
            if (typeof window === "undefined") return;
            if (!mapRef.current) return;
            if (mapInstanceRef.current) return;

            // Dynamic import to bypass SSR restrictions
            const L = (await import('leaflet')).default;

            // Custom Dark Mode Map Style (CartoDB Dark Matter)
            const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            });

            const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 15); // Jakarta Coordinates
            darkLayer.addTo(map);

            // Fix Icon
            const DefaultIcon = L.icon({
                iconUrl: iconUrl,
                iconRetinaUrl: iconRetinaUrl,
                shadowUrl: shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            });
            L.Marker.prototype.options.icon = DefaultIcon;

            // Add Crossing Marker
            L.marker([-6.2088, 106.8456]).addTo(map)
                .bindPopup("<b>AEON GATE 01</b><br>Status: MONITORING")
                .openPopup();

            // Add Danger Tone Circle
            L.circle([-6.2088, 106.8456], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.2,
                radius: 200
            }).addTo(map);

            mapInstanceRef.current = map;
        };

        initMap();

        return () => {
            // Cleanup can be added here if strict react mode double-rendering causes issues
        };
    }, []);

    return (
        <div className="relative h-full w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
            <div className="absolute top-2 left-2 z-[9999] bg-slate-900/80 p-1 px-2 text-xs font-mono text-kai-blue-400 border border-kai-blue-600 rounded">
                LIVE_TRACKING // GPS LOCK
            </div>
            <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        </div>
    );
}
