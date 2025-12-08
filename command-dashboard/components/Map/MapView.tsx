'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDashboard, Station, Post, Unit } from '@/contexts/DashboardContext';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue in Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

// Custom marker icons
const createIcon = (color: string, size: number = 24) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const stationIcon = createIcon('#2D3588', 28);  // Blue for Stations
const postIcon = createIcon('#F6841F', 22);      // Orange for Posts
const unitIcon = createIcon('#10B981', 18);      // Green for Units (CCTV)
const alertIcon = createIcon('#EF4444', 28);     // Red for alerts

// Default center (East Java region)
const DEFAULT_CENTER: [number, number] = [-7.55, 112.15];
const DEFAULT_ZOOM = 10;

// Map Controller Component - handles auto-zoom
function MapController() {
  const map = useMap();
  const { selectedNode, currentRole, dataTree, isEmergency } = useDashboard();

  useEffect(() => {
    if (!selectedNode || !dataTree) return;

    const nodeType = selectedNode.type;
    const nodeData = selectedNode.data;

    if (nodeType === 'unit' && nodeData) {
      // Unit selected: High zoom to exact location
      const unit = nodeData as Unit;
      map.flyTo([unit.lat, unit.long], 17, { duration: 1.5 });
    } else if (nodeType === 'post' && nodeData) {
      // Post selected: Zoom to post location
      const post = nodeData as Post;
      if (post.units.length > 0) {
        const firstUnit = post.units[0];
        map.flyTo([firstUnit.lat, firstUnit.long], 16, { duration: 1.5 });
      }
    } else if (nodeType === 'station' && nodeData) {
      // Station selected: Fit bounds to show all posts
      const station = nodeData as Station;
      const bounds: [number, number][] = [];

      station.posts.forEach(post => {
        post.units.forEach(unit => {
          bounds.push([unit.lat, unit.long]);
        });
      });

      if (bounds.length > 0) {
        const latLngBounds = L.latLngBounds(bounds);
        map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 14 });
      }
    } else if (nodeType === 'region') {
      // Region/DAOP: Show entire region
      const allBounds: [number, number][] = [];

      dataTree.stations.forEach(station => {
        station.posts.forEach(post => {
          post.units.forEach(unit => {
            allBounds.push([unit.lat, unit.long]);
          });
        });
      });

      if (allBounds.length > 0) {
        const latLngBounds = L.latLngBounds(allBounds);
        map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [selectedNode, currentRole, dataTree, map]);

  // Emergency effect: pulse animation on map
  useEffect(() => {
    if (isEmergency) {
      map.getContainer().classList.add('emergency-pulse');
    } else {
      map.getContainer().classList.remove('emergency-pulse');
    }
  }, [isEmergency, map]);

  return null;
}

export default function MapView() {
  const { dataTree, selectedNode, selectStation, selectPost, selectUnit, isEmergency, cityStatus } = useDashboard();

  // Fix Leaflet icon on mount
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Collect all markers from hierarchy
  const markers = useMemo(() => {
    const result: {
      stations: { station: Station; lat: number; long: number }[];
      posts: { post: Post; station: Station; lat: number; long: number }[];
      units: { unit: Unit; post: Post; lat: number; long: number }[];
    } = { stations: [], posts: [], units: [] };

    if (!dataTree) return result;

    dataTree.stations.forEach(station => {
      // Calculate station center from its posts
      let stationLat = 0, stationLong = 0, count = 0;

      station.posts.forEach(post => {
        post.units.forEach(unit => {
          stationLat += unit.lat;
          stationLong += unit.long;
          count++;
          result.units.push({ unit, post, lat: unit.lat, long: unit.long });
        });

        // Post location from first unit
        if (post.units.length > 0) {
          result.posts.push({
            post,
            station,
            lat: post.units[0].lat,
            long: post.units[0].long,
          });
        }
      });

      if (count > 0) {
        result.stations.push({
          station,
          lat: stationLat / count,
          long: stationLong / count,
        });
      }
    });

    return result;
  }, [dataTree]);

  // Determine initial center
  const initialCenter = useMemo(() => {
    if (markers.stations.length > 0) {
      return [markers.stations[0].lat, markers.stations[0].long] as [number, number];
    }
    return DEFAULT_CENTER;
  }, [markers]);

  return (
    <>
      {/* Emergency CSS */}
      <style jsx global>{`
        .emergency-pulse {
          animation: emergencyPulse 1s infinite;
        }
        @keyframes emergencyPulse {
          0%, 100% { filter: none; }
          50% { filter: brightness(1.1) saturate(1.3); }
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(30, 41, 59, 0.95);
          color: white;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .leaflet-popup-tip {
          background: rgba(30, 41, 59, 0.95);
        }
        .leaflet-popup-close-button {
          color: white !important;
        }
      `}</style>

      <MapContainer
        center={initialCenter}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Dark Theme Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Map Controller for auto-zoom */}
        <MapController />

        {/* Station Markers (Blue) */}
        {markers.stations.map(({ station, lat, long }) => (
          <Marker
            key={`station-${station.id}`}
            position={[lat, long]}
            icon={stationIcon}
            eventHandlers={{
              click: () => selectStation(station),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[180px]">
                <div className="text-[#F6841F] text-xs font-bold mb-1">STATION</div>
                <div className="text-white font-bold text-sm">{station.name}</div>
                <div className="text-slate-400 text-xs mt-1">
                  Head: {station.head_officer}
                </div>
                <div className="text-slate-400 text-xs">
                  {station.posts.length} JPL Posts
                </div>
                <button
                  onClick={() => selectStation(station)}
                  className="mt-2 w-full bg-[#2D3588] hover:bg-blue-700 text-white text-xs py-1.5 rounded transition-colors"
                >
                  View Station
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Post/JPL Markers (Orange) */}
        {markers.posts.map(({ post, station, lat, long }) => (
          <Marker
            key={`post-${post.id}`}
            position={[lat, long]}
            icon={isEmergency ? alertIcon : postIcon}
            eventHandlers={{
              click: () => selectPost(post),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[180px]">
                <div className="text-[#2D3588] text-xs font-bold mb-1">JPL POST</div>
                <div className="text-white font-bold text-sm">{post.name}</div>
                <div className="text-slate-400 text-xs mt-1">
                  Parent: {station.name}
                </div>
                <div className="text-slate-400 text-xs font-mono">
                  📍 {post.geo_location}
                </div>
                <div className="flex gap-2 mt-2">
                  {post.units.map(unit => (
                    <div
                      key={unit.id}
                      className={`w-2 h-2 rounded-full ${
                        unit.status === 'ONLINE' ? 'bg-green-500' :
                        unit.status === 'WARNING' ? 'bg-orange-500 animate-pulse' :
                        'bg-red-500'
                      }`}
                      title={`${unit.name}: ${unit.status}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => selectPost(post)}
                  className="mt-2 w-full bg-[#F6841F] hover:bg-orange-600 text-white text-xs py-1.5 rounded transition-colors"
                >
                  View Cameras
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Unit/CCTV Markers (Green) - Only show when zoomed in or post selected */}
        {selectedNode?.type === 'post' && markers.units
          .filter(u => (selectedNode.data as Post)?.units.some(pu => pu.id === u.unit.id))
          .map(({ unit, post, lat, long }) => (
            <Marker
              key={`unit-${unit.id}`}
              position={[lat, long]}
              icon={unit.status === 'WARNING' || unit.status === 'OFFLINE' ? alertIcon : unitIcon}
              eventHandlers={{
                click: () => selectUnit(unit),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[160px]">
                  <div className="text-green-400 text-xs font-bold mb-1">CCTV UNIT</div>
                  <div className="text-white font-bold text-sm">{unit.name}</div>
                  <div className="text-slate-400 text-xs mt-1">
                    Type: {unit.type}
                  </div>
                  <div className={`text-xs mt-1 font-bold ${
                    unit.status === 'ONLINE' ? 'text-green-400' :
                    unit.status === 'WARNING' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    Status: {unit.status}
                  </div>
                  <button
                    onClick={() => selectUnit(unit)}
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded transition-colors"
                  >
                    View Feed
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* City Status Overlay */}
        {isEmergency && cityStatus && (
          <div className="absolute top-4 right-4 z-[1000] bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
            <div className="text-xs font-bold">⚠️ EMERGENCY</div>
            <div className="text-[10px]">
              Traffic: {cityStatus.traffic_light} | Rail: {cityStatus.rail_crossing}
            </div>
          </div>
        )}
      </MapContainer>
    </>
  );
}
