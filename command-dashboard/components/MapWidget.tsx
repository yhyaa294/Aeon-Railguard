'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield, AlertTriangle, Radio } from 'lucide-react';

// Dynamic imports for React-Leaflet components to disable SSR
// This is required because Leaflet references the window object which is not available on the server
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Fix for default Leaflet icon not showing in Next.js
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface MapWidgetProps {
  trainDistance?: number;
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'SCANNING';
}

export default function MapWidget({ trainDistance = 0, status }: MapWidgetProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcon();
    setIsMounted(true);
  }, []);

  // Determine marker color/icon based on status
  // We can't easily change the default icon color without custom icons, 
  // but we can simulate it or just use the location to show the train.
  // For this widget, we'll position the marker based on "distance" to simulate movement along a track.
  // Let's assume a simple linear track for visualization.
  const baseLat = 51.505;
  const baseLng = -0.09;
  // Simulate movement: as distance decreases (train gets closer), it moves towards a "crossing" point.
  // Let's say 0 is the crossing. 
  const position: [number, number] = [baseLat, baseLng + (trainDistance * 0.00005)];

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-500 animate-pulse">
        Memuat Modul Peta...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <MapContainer
        center={[baseLat, baseLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-slate-900">
              <strong>Kereta Terdeteksi</strong><br />
              Jarak: {trainDistance}m<br />
              Status: {status}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* HUD Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-600 shadow-lg text-white min-w-[140px]">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Status Sistem</div>
          <div className="flex items-center gap-2 font-bold font-mono">
            {status === 'CRITICAL' && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
            {status === 'SAFE' && <Shield className="w-4 h-4 text-emerald-500" />}
            {status === 'SCANNING' && <Radio className="w-4 h-4 text-blue-500 animate-spin" />}
            <span className={
              status === 'CRITICAL' ? 'text-red-500' :
                status === 'WARNING' ? 'text-amber-500' :
                  status === 'SAFE' ? 'text-emerald-500' : 'text-blue-500'
            }>{status}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-600 shadow-lg text-white">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Jarak</div>
          <div className="font-mono text-xl">{trainDistance}m</div>
        </div>
      </div>
    </div>
  );
}
