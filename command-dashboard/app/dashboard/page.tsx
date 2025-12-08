"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard, Post, Unit, Station, Region } from '@/contexts/DashboardContext';
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
  Radio,
  Thermometer,
  Cloud,
  Layers,
  Server
} from "lucide-react";

// Dynamically import MapWidget to avoid SSR issues with Leaflet
const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />
});

export default function DashboardPage() {
  const {
    selectedNode,
    dataTree,
    isLoading,
    isEmergency,
    cityStatus,
    getFilteredView,
    selectPost,
    selectUnit
  } = useDashboard();

  // Helper to ensure we have data to display
  const filteredData = useMemo(() => getFilteredView(), [getFilteredView]);

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-slate-50 font-sans text-slate-800">

      {/* LEFT: HIERARCHICAL SIDEBAR */}
      <div className="w-72 md:w-80 flex-shrink-0 bg-white border-r border-slate-200 z-10 flex flex-col">
        <SidebarTree />
      </div>

      {/* RIGHT: MAIN VIEW WORKSPACE */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
        
        {/* Background Grid Pattern for Enterprise Feel */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#2D3588 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Emergency Banner */}
        <AnimatePresence>
          {isEmergency && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="bg-red-600 text-white rounded-xl shadow-xl overflow-hidden relative z-20"
            >
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-full animate-pulse">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg tracking-wide">EMERGENCY PROTOCOL ACTIVE</div>
                    <div className="text-red-100 text-sm font-medium">
                      Traffic: {cityStatus?.traffic_light} | Rail: {cityStatus?.rail_crossing} | Units Dispatched
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono bg-white/20 px-3 py-1 rounded inline-block">
                    T-MINUS: 00:00:00
                  </div>
                </div>
              </div>
              <div className="h-1 bg-white/30 w-full overflow-hidden">
                 <div className="h-full bg-white w-1/3 animate-progress-indeterminate"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Header */}
        <header className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {selectedNode?.type === 'region' && <Layers size={12} />}
              {selectedNode?.type === 'station' && <Grid size={12} />}
              {selectedNode?.type === 'post' && <Video size={12} />}
              {selectedNode?.type === 'unit' && <Radio size={12} />}
              <span>{selectedNode?.type || 'SYSTEM'} LEVEL VIEW</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              {selectedNode?.name || 'Daop 7 Overview'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
               <Cloud size={16} className="text-blue-500" />
               <span className="font-bold">Sunny 32°C</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
               <Server size={16} className="text-green-500" />
               <span className="font-bold text-green-700">System Normal</span>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <RefreshCw className="animate-spin text-[#2D3588]" size={48} />
            <div className="text-slate-400 font-medium">Synchronizing Data...</div>
          </div>
        ) : (
          /* DYNAMIC CONTENT SWITCHER */
          <AnimatePresence mode="wait">
            
            {/* SCENARIO A: STATION SELECTED (or no selection default) */}
            {(selectedNode?.type === 'station' || (!selectedNode && dataTree)) && (
              <motion.div
                key="station-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StationOverview 
                  station={selectedNode?.data as Station || dataTree?.stations[0]} 
                  onSelectPost={selectPost}
                />
              </motion.div>
            )}

            {/* SCENARIO B: POST SELECTED */}
            {selectedNode?.type === 'post' && (
              <motion.div
                key="post-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PostMonitor 
                  post={selectedNode.data as Post} 
                  onSelectUnit={selectUnit} 
                />
              </motion.div>
            )}

            {/* SCENARIO C: REGION SELECTED */}
            {selectedNode?.type === 'region' && (
              <motion.div
                key="region-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RegionMap region={selectedNode.data as Region} />
              </motion.div>
            )}

            {/* SCENARIO D: UNIT SELECTED */}
            {selectedNode?.type === 'unit' && (
              <motion.div
                key="unit-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

// SCENARIO A: STATION OVERVIEW (Grid of Posts)
function StationOverview({ station, onSelectPost }: { station: Station | undefined, onSelectPost: (post: Post) => void }) {
  if (!station) return <div className="p-8 text-center text-slate-400">No station data available.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-700">Active Posts ({station.posts.length})</h2>
        <div className="text-sm text-slate-500">Head Officer: <span className="font-semibold">{station.head_officer}</span></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {station.posts.map(post => {
          const activeUnits = post.units.filter(u => u.status === 'ONLINE').length;
          const hasWarning = post.units.some(u => u.status === 'WARNING');
          
          return (
            <motion.div
              key={post.id}
              whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              onClick={() => onSelectPost(post)}
              className={`bg-white rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                hasWarning ? 'border-orange-200' : 'border-slate-100'
              }`}
            >
              {/* Card Header */}
              <div className={`px-5 py-4 border-b ${hasWarning ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{post.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">{post.geo_location}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    hasWarning ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'
                  }`}>
                    {hasWarning ? 'WARNING' : 'SECURE'}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-slate-400 font-bold uppercase">CCTV Active</div>
                    <div className="text-xl font-black text-[#2D3588]">{activeUnits}/{post.units.length}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                     <div className="text-xs text-slate-400 font-bold uppercase">Latency</div>
                     <div className="text-xl font-black text-slate-700">24ms</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-blue-600 font-bold hover:underline">
                  <Maximize2 size={12} /> View Detailed Monitoring
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// SCENARIO B: POST MONITOR (Grid of CCTV Feeds)
function PostMonitor({ post, onSelectUnit }: { post: Post, onSelectUnit: (unit: Unit) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-lg font-bold text-slate-700">Live Feeds</h2>
         <div className="flex gap-2">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600">
               Total Units: {post.units.length}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {post.units.map(unit => (
          <div 
            key={unit.id} 
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group cursor-pointer"
            onClick={() => onSelectUnit(unit)}
          >
            {/* Video Feed Placeholder */}
            <div className="relative aspect-video bg-black">
              <img 
                src="/images/perlintasan%20ilegal.png" 
                alt="Feed" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
              />
              
              {/* Overlays */}
              <div className="absolute top-3 left-3 flex gap-2">
                 <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
                 <span className="bg-black/50 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                   {unit.id}
                 </span>
              </div>

              <div className="absolute bottom-3 right-3">
                 <div className={`w-3 h-3 rounded-full border-2 border-white ${
                    unit.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'
                 }`}></div>
              </div>
            </div>

            {/* Meta */}
            <div className="p-4 flex justify-between items-center">
               <div>
                  <div className="font-bold text-slate-800 text-sm">{unit.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">AI Detection Active</div>
               </div>
               <div className="bg-slate-100 p-2 rounded-full text-slate-500 group-hover:bg-[#2D3588] group-hover:text-white transition-colors">
                  <Maximize2 size={16} />
               </div>
            </div>
          </div>
        ))}
        
        {/* Add Camera Slot */}
        <div className="aspect-video rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-[#2D3588] hover:text-[#2D3588] transition-colors cursor-pointer bg-slate-50">
           <div className="bg-white p-3 rounded-full shadow-sm mb-2">
             <Video size={24} />
           </div>
           <span className="text-sm font-bold">Connect New Stream</span>
        </div>
      </div>
    </div>
  );
}

// SCENARIO C: REGION MAP
function RegionMap({ region }: { region: Region }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[600px] flex flex-col">
       <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-800">Operational Map: {region.name}</h2>
            <p className="text-xs text-slate-500">Live telemetry from {region.stations.length} stations</p>
          </div>
          <div className="flex gap-2 text-xs">
             <div className="flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500"></span> Normal
             </div>
             <div className="flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-orange-500"></span> Warning
             </div>
             <div className="flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
             </div>
          </div>
       </div>
       
       <div className="flex-1 relative bg-slate-100">
          <MapWidget status="SAFE" />
          
          {/* Overlay Stats */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 w-64">
             <div className="text-xs font-bold text-slate-400 uppercase mb-2">Region Statistics</div>
             <div className="space-y-2">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-600">Active Trains</span>
                   <span className="font-bold text-[#2D3588]">14</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-600">Illegal Crossings</span>
                   <span className="font-bold text-orange-600">8</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-600">Avg. Speed</span>
                   <span className="font-bold text-slate-800">84 km/h</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

// SCENARIO D: SINGLE UNIT (Reuse from previous, simplified)
function UnitSingleView({ unit }: { unit: Unit }) {
  return (
    <div className="grid grid-cols-12 gap-6 h-[600px]">
      {/* Large Player */}
      <div className="col-span-8 bg-black rounded-xl overflow-hidden relative shadow-lg">
         <img src="/images/perlintasan%20ilegal.png" className="w-full h-full object-cover opacity-90" alt={unit.name} />
         <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">LIVE FEED</div>
      </div>
      
      {/* Controls */}
      <div className="col-span-4 flex flex-col gap-4">
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Radio size={16} className="text-[#2D3588]" /> Telemetry
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">Status</span>
                  <span className={`font-bold ${unit.status === 'ONLINE' ? 'text-green-600' : 'text-red-500'}`}>{unit.status}</span>
               </div>
               <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">Coordinates</span>
                  <span className="font-mono text-sm">{unit.lat}, {unit.long}</span>
               </div>
               <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">Model</span>
                  <span className="font-mono text-sm">Hikvision DarkFighter</span>
               </div>
            </div>
         </div>
         
         <div className="bg-[#2D3588] text-white p-5 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4">Remote Actions</h3>
            <div className="grid grid-cols-2 gap-3">
               <button className="bg-white/10 hover:bg-white/20 py-2 rounded text-sm font-semibold transition">Reboot</button>
               <button className="bg-white/10 hover:bg-white/20 py-2 rounded text-sm font-semibold transition">Wiper</button>
               <button className="bg-red-500 hover:bg-red-600 py-2 rounded text-sm font-semibold transition col-span-2">Trigger Alarm</button>
            </div>
         </div>
      </div>
    </div>
  );
}

