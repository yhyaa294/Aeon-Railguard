'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RefreshCw, Shield, AlertTriangle, Zap } from 'lucide-react';
import { useDashboard, UserRole } from '@/contexts/DashboardContext';
import SidebarTree, {
  SidebarTreeRoot,
  convertStationToTree,
  convertPostToTree,
} from './SidebarTree';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// --- ROLE ICONS ---
const ROLE_ICONS = {
  jpl: '👮‍♂️',
  station: '🚉',
  daop: '🏢',
} as const;

const ROLE_LABELS = {
  jpl: 'Juru Penilik Lintasan',
  station: 'Station Operator',
  daop: 'DAOP Administrator',
} as const;

// --- MAIN SIDEBAR COMPONENT ---
export default function Sidebar() {
  const {
    currentRole,
    setCurrentRole,
    dataTree,
    isLoading,
    isEmergency,
    refreshData,
    triggerEmergency,
  } = useDashboard();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [demoModeActive, setDemoModeActive] = useState(false);
  const [demoTriggering, setDemoTriggering] = useState(false);

  // Hidden Demo God Mode trigger
  const handleDemoTrigger = useCallback(async () => {
    if (demoTriggering || demoModeActive) return;
    
    setDemoTriggering(true);
    try {
      const response = await fetch(`${API_BASE}/api/demo/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setDemoModeActive(true);
        triggerEmergency();
        
        // Auto-reset UI state after 30 seconds
        setTimeout(() => {
          setDemoModeActive(false);
        }, 30000);
      }
    } catch (error) {
      console.error('[DEMO] Trigger failed:', error);
    } finally {
      setDemoTriggering(false);
    }
  }, [demoTriggering, demoModeActive, triggerEmergency]);

  // --- RENDER: JPL ROLE (Single Post View) ---
  const renderJplView = () => {
    if (!dataTree?.stations?.[0]?.posts?.[0]) {
      return <div className="p-4 text-slate-400 text-sm">No post assigned</div>;
    }

    const post = dataTree.stations[0].posts[0];
    const treeNode = convertPostToTree(post);

    return (
      <div className="py-2">
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ROLE_ICONS.jpl}</span>
            <div>
              <h3 className="font-bold text-white">{post.name}</h3>
              <p className="text-xs text-slate-400">{post.geo_location || 'Location N/A'}</p>
            </div>
          </div>
        </div>
        <div className="px-2 py-2">
          <SidebarTree node={treeNode} level={0} />
        </div>
      </div>
    );
  };

  // --- RENDER: STATION ROLE (Station + Posts View) ---
  const renderStationView = () => {
    if (!dataTree?.stations?.[0]) {
      return <div className="p-4 text-slate-400 text-sm">No station data</div>;
    }

    const station = dataTree.stations[0];
    const treeNode = convertStationToTree(station);

    return (
      <div className="py-2">
        {/* Station Header */}
        <div className="px-4 py-3 border-b border-white/10 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ROLE_ICONS.station}</span>
            <div>
              <h3 className="font-bold text-white">{station.name}</h3>
              <p className="text-xs text-slate-400">
                {station.head_officer || 'Officer: N/A'} • {station.posts.length} Posts
              </p>
            </div>
          </div>
        </div>
        {/* Recursive Tree */}
        <div className="px-2">
          <SidebarTree node={treeNode} level={0} />
        </div>
      </div>
    );
  };

  // --- RENDER: DAOP ROLE (Full Recursive Tree View) ---
  const renderDaopView = () => {
    if (!dataTree) {
      return <div className="p-4 text-slate-400 text-sm">No regional data</div>;
    }

    return (
      <div className="py-2">
        {/* Region Header */}
        <div className="px-4 py-3 border-b border-white/10 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ROLE_ICONS.daop}</span>
            <div>
              <h3 className="font-bold text-white">{dataTree.name}</h3>
              <p className="text-xs text-slate-400">
                Code: {dataTree.code} • {dataTree.stations.length} Stations
              </p>
            </div>
          </div>
        </div>
        {/* Full Recursive Tree from Root */}
        <div className="px-2">
          <SidebarTreeRoot />
        </div>
      </div>
    );
  };

  // --- ROLE-BASED CONTENT RENDER ---
  const renderContent = () => {
    switch (currentRole) {
      case 'jpl':
        return renderJplView();
      case 'station':
        return renderStationView();
      case 'daop':
        return renderDaopView();
      default:
        return null;
    }
  };

  return (
    <aside className={`h-full w-72 bg-[#1e2563] text-white flex flex-col shadow-xl transition-all duration-300 ${
      demoModeActive ? 'ring-4 ring-red-500 animate-pulse' : ''
    }`}>
      {/* Demo Mode Active Banner */}
      <AnimatePresence>
        {demoModeActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 px-4 py-2 flex items-center justify-center gap-2"
          >
            <Zap size={14} className="animate-bounce" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Demo God Mode Active</span>
            <Zap size={14} className="animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#2D3588]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h1 className="font-bold text-base">Aeon Railguard</h1>
              <p className="text-[10px] text-blue-200">Command Dashboard</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Emergency Banner */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-600 px-4 py-2 flex items-center gap-2"
          >
            <AlertTriangle size={16} className="animate-pulse" />
            <span className="text-xs font-bold uppercase">Emergency Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Badge */}
      <div className="px-4 py-3 bg-[#252b75] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">{ROLE_ICONS[currentRole]}</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-white uppercase">{currentRole}</div>
            <div className="text-[10px] text-slate-400">{ROLE_LABELS[currentRole]}</div>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw size={24} className="animate-spin text-blue-300 mb-3" />
            <span className="text-sm text-slate-400">Loading hierarchy...</span>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Role Switcher (Demo) */}
      <div className="p-4 border-t border-white/10 bg-[#1a1f4a]">
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{ROLE_ICONS[currentRole]}</span>
              <span className="text-sm font-medium">Switch Role</span>
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {roleDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-[#2D3588] rounded-lg shadow-xl border border-white/10 overflow-hidden z-50"
              >
                {(['jpl', 'station', 'daop'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      currentRole === role
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{ROLE_ICONS[role]}</span>
                    <div>
                      <div className="text-sm font-medium uppercase">{role}</div>
                      <div className="text-[10px] text-slate-400">{ROLE_LABELS[role]}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hidden Demo God Mode Trigger - Triple click on version text */}
      <div className="px-4 py-2 border-t border-white/5 bg-[#151a3d]">
        <button
          onClick={handleDemoTrigger}
          disabled={demoTriggering || demoModeActive}
          className={`w-full text-center text-[10px] transition-all duration-300 ${
            demoModeActive 
              ? 'text-red-400 font-bold animate-pulse' 
              : demoTriggering
                ? 'text-orange-400'
                : 'text-slate-600 hover:text-slate-400'
          }`}
          title="System Version"
        >
          {demoModeActive ? '⚡ DEMO ACTIVE ⚡' : demoTriggering ? 'Triggering...' : 'v1.0.0'}
        </button>
      </div>
    </aside>
  );
}
