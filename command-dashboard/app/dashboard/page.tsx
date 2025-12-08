"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SidebarTree, { TreeNode } from './components/SidebarTree';
import {
  Wifi,
  Activity,
  Clock,
  MapPin,
  Maximize2,
  Video,
  List,
  Grid,
  MoreVertical,
  Radio
} from "lucide-react";

// Dynamic imports
const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900 animate-pulse" />
});

export default function DashboardPage() {
  // Default State: Select the first Post
  const [selectedNode, setSelectedNode] = useState<TreeNode>({
    id: 'post-peterongan',
    name: 'Pos Jaga Peterongan',
    type: 'post',
    children: [
      { id: 'cam-aeon-01', name: 'Aeon-01', type: 'unit', status: 'online' },
      { id: 'cam-aeon-02', name: 'Aeon-02', type: 'unit', status: 'online' },
      { id: 'cam-aeon-03', name: 'Aeon-03', type: 'unit', status: 'warning' },
    ]
  });

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-slate-100 font-sans">

      {/* LEFT: HIERARCHICAL SIDEBAR */}
      <div className="w-72 md:w-80 flex-shrink-0 shadow-2xl z-10">
        <SidebarTree
          selectedId={selectedNode.id}
          onSelect={setSelectedNode}
        />
      </div>

      {/* RIGHT: MAIN VIEW WORKSPACE */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {selectedNode.type === 'post' ? <Grid className="text-[#2D3588]" /> : <Video className="text-[#F6841F]" />}
              {selectedNode.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {selectedNode.type === 'post' ? 'Multi-Camera View' : 'Live Unit Telemetry & Control'}
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

        {/* DYNAMIC CONTENT AREA */}
        {selectedNode.type === 'post' ? (
          <PostGridView childrenNodes={selectedNode.children || []} />
        ) : (
          <UnitSingleView unit={selectedNode} />
        )}

      </div>
    </div>
  );
}

// --- SUB-VIEWS ---

function PostGridView({ childrenNodes }: { childrenNodes: TreeNode[] }) {
  if (childrenNodes.length === 0) {
    return <div className="text-slate-400 italic">No cameras assigned to this post.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {childrenNodes.map(node => (
        <div key={node.id} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
          {/* Header */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-[#2D3588] text-sm">
              <Video size={14} /> {node.name}
            </div>
            <div className={`w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>

          {/* Video Placeholder */}
          <div className="aspect-video bg-black relative">
            <img
              src="/images/perlintasan%20ilegal.png"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 rounded">LIVE</div>
          </div>

          {/* Footer Stats */}
          <div className="p-3 flex justify-between text-xs text-slate-500">
            <span>Latency: 45ms</span>
            <span>AI: ON</span>
          </div>
        </div>
      ))}

      {/* Add Placeholder Slots to fil grid */}
      {[...Array(Math.max(0, 4 - childrenNodes.length))].map((_, i) => (
        <div key={i} className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 aspect-video">
          <span className="text-sm">Empty Slot</span>
        </div>
      ))}
    </div>
  );
}

function UnitSingleView({ unit }: { unit: TreeNode }) {
  return (
    <div className="grid grid-cols-12 gap-6 h-[700px]">

      {/* MAIN VIDEO PLAYER */}
      <div className="col-span-12 lg:col-span-8 bg-black rounded-xl shadow-lg border border-slate-800 overflow-hidden relative flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded animate-pulse">
            LIVE FEED
          </div>
        </div>

        <div className="flex-1 relative">
          <img
            src="/images/perlintasan%20ilegal.png"
            className="w-full h-full object-cover opacity-90"
          />
          {/* HUD Overlay */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold">{unit.name}</h2>
                <p className="text-slate-300 text-sm font-mono">CAM-ID: {unit.id.toUpperCase()}</p>
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
            <span className="text-2xl font-black text-green-600">OPERATIONAL</span>
            <Activity className="text-green-500 animate-pulse" />
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

        {/* Map Widget */}
        <div className="flex-1 bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
            <span>Location</span>
            <MapPin size={14} />
          </div>
          <div className="flex-1 relative bg-slate-100">
            <MapWidget status={unit.status === 'warning' ? 'WARNING' : 'SAFE'} />
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
