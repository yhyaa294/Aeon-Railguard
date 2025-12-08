'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  Video,
  ChevronRight,
  ChevronDown,
  Server,
  Building2,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Shield
} from 'lucide-react';
import { useDashboard, Station, Post, Unit, UserRole } from '@/contexts/DashboardContext';

export default function SidebarTree() {
  const {
    currentRole,
    setCurrentRole,
    dataTree,
    selectedNode,
    selectStation,
    selectPost,
    selectUnit,
    isLoading,
    isEmergency,
    refreshData,
    cityStatus
  } = useDashboard();

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Auto-expand based on data
  useEffect(() => {
    if (dataTree) {
      const ids: string[] = [];
      dataTree.stations.forEach(s => {
        ids.push(s.id);
        s.posts.forEach(p => ids.push(p.id));
      });
      setExpandedIds(ids);
    }
  }, [dataTree]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ONLINE': return 'bg-emerald-500';
      case 'WARNING': return 'bg-orange-500 animate-pulse';
      case 'OFFLINE': return 'bg-slate-600';
      default: return 'bg-slate-400';
    }
  };

  const renderUnit = (unit: Unit) => {
    const isSelected = selectedNode?.id === unit.id;

    return (
      <motion.div
        key={unit.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={`
          flex items-center gap-2 py-2.5 px-4 pl-14 cursor-pointer transition-all border-l-[3px]
          ${isSelected
            ? 'bg-[#1a2055] border-[#F6841F] text-white'
            : 'border-transparent hover:bg-white/5 text-slate-300'}
        `}
        onClick={() => selectUnit(unit)}
      >
        <Video size={14} className={unit.status === 'ONLINE' ? 'text-emerald-400' : 'text-slate-500'} />
        <span className="text-sm truncate flex-1">{unit.name}</span>
        <div className={`w-2 h-2 rounded-full ${getStatusColor(unit.status)}`} />
      </motion.div>
    );
  };

  const renderPost = (post: Post) => {
    const isExpanded = expandedIds.includes(post.id);
    const isSelected = selectedNode?.id === post.id;
    const onlineCount = post.units.filter(u => u.status === 'ONLINE').length;

    return (
      <div key={post.id}>
        <motion.div
          className={`
            flex items-center gap-2 py-3 px-4 pl-10 cursor-pointer transition-all border-l-[3px]
            ${isSelected
              ? 'bg-[#1a2055] border-[#F6841F] text-white'
              : 'border-transparent hover:bg-white/5 text-slate-300'}
          `}
          onClick={() => {
            toggleExpand(post.id);
            selectPost(post);
          }}
        >
          <div className="text-slate-400">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          <MapPin size={14} className="text-blue-300" />
          <span className="text-sm font-medium truncate flex-1">{post.name}</span>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
            {onlineCount}/{post.units.length}
          </span>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#1a1f3c] overflow-hidden"
            >
              {post.units.map(unit => renderUnit(unit))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderStation = (station: Station) => {
    const isExpanded = expandedIds.includes(station.id);
    const isSelected = selectedNode?.id === station.id;
    const totalUnits = station.posts.reduce((acc, p) => acc + p.units.length, 0);

    return (
      <div key={station.id}>
        <motion.div
          className={`
            flex items-center gap-2 py-3 px-4 cursor-pointer transition-all border-l-[3px]
            ${isSelected
              ? 'bg-[#1a2055] border-[#F6841F] text-white'
              : 'border-transparent hover:bg-white/5 text-slate-300'}
          `}
          onClick={() => {
            toggleExpand(station.id);
            selectStation(station);
          }}
        >
          <div className="text-slate-400">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          <Building2 size={16} className="text-[#F6841F]" />
          <span className="text-sm font-bold truncate flex-1">{station.name}</span>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
            {station.posts.length} JPL
          </span>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#252b75] overflow-hidden"
            >
              {station.posts.map(post => renderPost(post))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-full bg-[#2D3588] text-white flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <Server className="w-5 h-5 text-[#F6841F]" />
          </div>
          <div>
            <h2 className="font-bold text-base leading-none">Aeon VMS</h2>
            <span className="text-[10px] text-blue-200">Hierarchy Explorer</span>
          </div>
          <button
            onClick={refreshData}
            className="ml-auto p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          {(['jpl', 'station', 'daop'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${
                currentRole === role
                  ? 'bg-[#F6841F] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-600 px-4 py-2 flex items-center gap-2"
          >
            <AlertTriangle size={16} className="animate-pulse" />
            <span className="text-xs font-bold">EMERGENCY ACTIVE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-4 mb-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-2">
          <Shield size={10} />
          {dataTree?.name || 'Loading...'}
        </div>

        {isLoading ? (
          <div className="px-4 py-8 text-center">
            <RefreshCw size={24} className="animate-spin mx-auto text-blue-300 mb-2" />
            <span className="text-xs text-slate-400">Loading hierarchy...</span>
          </div>
        ) : (
          dataTree?.stations.map(station => renderStation(station))
        )}
      </div>

      {/* City Status Footer */}
      <div className="p-3 border-t border-white/10 bg-[#252b75]">
        <div className="grid grid-cols-3 gap-2 text-[9px]">
          <div className="text-center">
            <div className={`w-2 h-2 mx-auto mb-1 rounded-full ${
              cityStatus?.traffic_light === 'RED_LOCK' ? 'bg-red-500' :
              cityStatus?.traffic_light === 'GREEN_WAVE' ? 'bg-green-500' : 'bg-slate-400'
            }`} />
            <span className="text-slate-400">Traffic</span>
          </div>
          <div className="text-center">
            <div className={`w-2 h-2 mx-auto mb-1 rounded-full ${
              cityStatus?.siren === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
              cityStatus?.siren === 'WARNING' ? 'bg-orange-500' : 'bg-green-500'
            }`} />
            <span className="text-slate-400">Siren</span>
          </div>
          <div className="text-center">
            <div className={`w-2 h-2 mx-auto mb-1 rounded-full ${
              cityStatus?.rail_crossing === 'CLOSED' ? 'bg-red-500' :
              cityStatus?.rail_crossing === 'CLOSING' ? 'bg-orange-500' : 'bg-green-500'
            }`} />
            <span className="text-slate-400">Rail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
