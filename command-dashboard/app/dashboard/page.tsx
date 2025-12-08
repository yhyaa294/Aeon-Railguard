"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard, Post, Unit, Station } from '@/contexts/DashboardContext';
import SidebarTree from './components/SidebarTree';
import {
  Activity,
  MapPin,
  Video,
  Grid,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Maximize2,
  Radio
} from "lucide-react";

const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900 animate-pulse" />
});

export default function DashboardPage() {
  const {
    selectedNode,
    isLoading,
    isEmergency,
    cityStatus,
    getFilteredView
  } = useDashboard();

  const filteredData = useMemo(() => getFilteredView(), [getFilteredView]);

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-slate-100 font-sans">

      {/* LEFT: HIERARCHICAL SIDEBAR */}
      <div className="w-72 md:w-80 flex-shrink-0 shadow-2xl z-10">
        <SidebarTree />
      </div>

      {/* RIGHT: MAIN VIEW WORKSPACE */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">

        {/* Emergency Banner */}
        <AnimatePresence>
          {isEmergency && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-600 text-white px-6 py-4 rounded-xl mb-6 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="animate-pulse" size={24} />
                <div>
                  <div className="font-bold text-lg">EMERGENCY ALERT ACTIVE</div>
                  <div className="text-red-200 text-sm">
                    Traffic: {cityStatus?.traffic_light} | Siren: {cityStatus?.siren} | Rail: {cityStatus?.rail_crossing}
                  </div>
                </div>
              </div>
              <div className="text-xs bg-white/20 px-3 py-1 rounded">
                {cityStatus?.last_update}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {selectedNode?.type === 'post' ? (
                <Grid className="text-[#2D3588]" />
              ) : selectedNode?.type === 'unit' ? (
                <Video className="text-[#F6841F]" />
              ) : (
                <MapPin className="text-[#2D3588]" />
              )}
              {selectedNode?.name || 'Select a Node'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {selectedNode?.type === 'station' && 'Station Overview - All Posts'}
              {selectedNode?.type === 'post' && 'Multi-Camera View'}
              {selectedNode?.type === 'unit' && 'Live Unit Telemetry & Control'}
              {!selectedNode && 'Loading...'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono bg-white px-3 py-1.5 rounded border border-slate-200 text-slate-500">
              SERVER TIME: {new Date().toLocaleTimeString()}
            </div>
            <button className="bg-[#2D3588] text-white px-4 py-1.5 rounded text-sm font-bold shadow hover:bg-blue-900 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin text-[#2D3588]" size={32} />
          </div>
        ) : (
          /* DYNAMIC CONTENT AREA */
          <AnimatePresence mode="wait">
            {selectedNode?.type === 'station' && (
              <motion.div
                key="station-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StationGridView posts={filteredData.posts} />
              </motion.div>
            )}

            {selectedNode?.type === 'post' && (
              <motion.div
                key="post-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PostGridView units={filteredData.units} />
              </motion.div>
            )}

            {selectedNode?.type === 'unit' && (
              <motion.div
                key="unit-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UnitSingleView unit={selectedNode.data as Unit} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}

// --- STATION VIEW: Grid of Posts ---
function StationGridView({ posts }: { posts: Post[] }) {
  const { selectPost } = useDashboard();

  if (posts.length === 0) {
    return <div className="text-slate-400 italic">No posts in this station.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => {
        const onlineCount = post.units.filter(u => u.status === 'ONLINE').length;
        const totalCount = post.units.length;

        return (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectPost(post)}
            className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#2D3588] to-[#1a2055] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <MapPin size={14} /> {post.name}
                </div>
                <div className="text-xs bg-white/20 px-2 py-0.5 rounded">
                  {onlineCount}/{totalCount} Online
                </div>
              </div>
              <div className="text-xs text-blue-200 mt-1 font-mono">
                {post.geo_location}
              </div>
            </div>

            {/* Camera Grid Preview */}
            <div className="grid grid-cols-2 gap-1 p-2 bg-slate-50">
              {post.units.slice(0, 4).map(unit => (
                <div key={unit.id} className="aspect-video bg-slate-800 rounded relative overflow-hidden">
                  <img
                    src="/images/perlintasan%20ilegal.png"
                    className="w-full h-full object-cover opacity-70"
                    alt={unit.name}
                  />
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                    unit.status === 'ONLINE' ? 'bg-green-500' :
                    unit.status === 'WARNING' ? 'bg-orange-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] px-1 py-0.5 truncate">
                    {unit.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Click to expand</span>
              <Maximize2 size={12} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// --- POST VIEW: Grid of CCTV Units ---
function PostGridView({ units }: { units: Unit[] }) {
  const { selectUnit } = useDashboard();

  if (units.length === 0) {
    return <div className="text-slate-400 italic">No cameras assigned to this post.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {units.map(unit => (
        <motion.div
          key={unit.id}
          whileHover={{ scale: 1.02 }}
          onClick={() => selectUnit(unit)}
          className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow cursor-pointer"
        >
          {/* Header */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-[#2D3588] text-sm">
              <Video size={14} /> {unit.name}
            </div>
            <div className="flex items-center gap-2">
              {unit.status === 'ONLINE' ? (
                <Wifi size={12} className="text-green-500" />
              ) : (
                <WifiOff size={12} className="text-red-500" />
              )}
              <div className={`w-2 h-2 rounded-full ${
                unit.status === 'ONLINE' ? 'bg-green-500' :
                unit.status === 'WARNING' ? 'bg-orange-500 animate-pulse' : 'bg-red-500'
              }`} />
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="aspect-video bg-black relative">
            <img
              src="/images/perlintasan%20ilegal.png"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              alt={unit.name}
            />
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold animate-pulse">
              LIVE
            </div>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 rounded">
              {unit.type}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="p-3 flex justify-between text-xs text-slate-500">
            <span>Latency: 45ms</span>
            <span className="text-green-600 font-bold">AI: ON</span>
          </div>
        </motion.div>
      ))}

      {/* Empty Slots */}
      {[...Array(Math.max(0, 4 - units.length))].map((_, i) => (
        <div key={`empty-${i}`} className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 aspect-video">
          <span className="text-sm">Empty Slot</span>
        </div>
      ))}
    </div>
  );
}

// --- UNIT VIEW: Single Camera Detail ---
function UnitSingleView({ unit }: { unit: Unit }) {
  const { cityStatus } = useDashboard();

  return (
    <div className="grid grid-cols-12 gap-6 h-[700px]">

      {/* MAIN VIDEO PLAYER */}
      <div className="col-span-12 lg:col-span-8 bg-black rounded-xl shadow-lg border border-slate-800 overflow-hidden relative flex flex-col">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded animate-pulse">
            LIVE FEED
          </div>
          <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-1">
            <Radio size={10} /> AI ACTIVE
          </div>
        </div>

        <div className="flex-1 relative">
          <img
            src="/images/perlintasan%20ilegal.png"
            className="w-full h-full object-cover opacity-90"
            alt={unit.name}
          />
          {/* HUD Overlay */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold">{unit.name}</h2>
                <p className="text-slate-300 text-sm font-mono">CAM-ID: {unit.id.toUpperCase()}</p>
                <p className="text-slate-400 text-xs mt-1">
                  Location: {unit.lat.toFixed(4)}, {unit.long.toFixed(4)}
                </p>
              </div>
              <div className="flex gap-4 font-mono text-sm text-[#F6841F]">
                <span>FPS: 30</span>
                <span>BITRATE: 4096kbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: CONTROLS & MAP */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">

        {/* Status Card */}
        <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Unit Status</div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-black ${
              unit.status === 'ONLINE' ? 'text-green-600' :
              unit.status === 'WARNING' ? 'text-orange-500' : 'text-red-500'
            }`}>
              {unit.status}
            </span>
            <Activity className={`${
              unit.status === 'ONLINE' ? 'text-green-500' : 'text-red-500'
            } animate-pulse`} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-2 rounded">
              <div className="text-[10px] text-slate-400">UPTIME</div>
              <div className="font-mono font-bold">24d 10h</div>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <div className="text-[10px] text-slate-400">CONN</div>
              <div className="font-mono font-bold text-green-600">STABLE</div>
            </div>
          </div>
        </div>

        {/* City Status Card */}
        {cityStatus && (
          <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase mb-3">Smart City Status</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  cityStatus.traffic_light === 'RED_LOCK' ? 'bg-red-500' :
                  cityStatus.traffic_light === 'GREEN_WAVE' ? 'bg-green-500' : 'bg-slate-300'
                }`} />
                <span>Traffic: {cityStatus.traffic_light}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  cityStatus.rail_crossing === 'CLOSED' ? 'bg-red-500' :
                  cityStatus.rail_crossing === 'CLOSING' ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <span>Rail: {cityStatus.rail_crossing}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  cityStatus.ambulance === 'DISPATCHED' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'
                }`} />
                <span>Ambulance: {cityStatus.ambulance}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  cityStatus.police === 'DISPATCHED' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
                }`} />
                <span>Police: {cityStatus.police}</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Widget */}
        <div className="flex-1 bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
            <span>Location</span>
            <MapPin size={14} />
          </div>
          <div className="flex-1 relative bg-slate-100">
            <MapWidget status={unit.status === 'WARNING' ? 'WARNING' : 'SAFE'} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#2D3588] text-white p-4 rounded-xl shadow-lg">
          <div className="text-xs opacity-70 mb-3 font-bold uppercase">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/10 hover:bg-white/20 py-2 rounded text-xs font-bold transition-colors">
              Reboot Unit
            </button>
            <button className="bg-[#F6841F] hover:bg-orange-600 py-2 rounded text-xs font-bold transition-colors">
              Trigger Alarm
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
