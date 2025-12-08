'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { useDashboard, Station, Post, Unit, UserRole } from '@/contexts/DashboardContext';

// --- SIDEBAR ITEM COMPONENT (Recursive Helper) ---
interface SidebarItemProps {
  id: string;
  name: string;
  type: 'station' | 'post' | 'unit';
  icon: React.ReactNode;
  isSelected: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
  depth?: number;
  badge?: string;
  statusDot?: 'online' | 'warning' | 'offline';
  onClick: () => void;
  onToggle?: () => void;
  children?: React.ReactNode;
}

function SidebarItem({
  name,
  icon,
  isSelected,
  isExpandable = false,
  isExpanded = false,
  depth = 0,
  badge,
  statusDot,
  onClick,
  onToggle,
  children,
}: SidebarItemProps) {
  const paddingLeft = 16 + depth * 16;

  const getStatusColor = (status?: 'online' | 'warning' | 'offline') => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'warning': return 'bg-orange-500 animate-pulse';
      case 'offline': return 'bg-slate-600';
      default: return '';
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          flex items-center gap-2 py-3 px-4 cursor-pointer transition-all duration-200 border-l-[3px]
          ${isSelected
            ? 'bg-orange-500/20 border-orange-500 text-white font-medium'
            : 'border-transparent hover:bg-white/5 text-slate-300 hover:text-white'}
        `}
        style={{ paddingLeft }}
        onClick={() => {
          if (isExpandable && onToggle) onToggle();
          onClick();
        }}
      >
        {isExpandable && (
          <div className="text-slate-400 transition-transform">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
        <span className="text-lg">{icon}</span>
        <span className="text-sm truncate flex-1">{name}</span>
        {badge && (
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
            {badge}
          </span>
        )}
        {statusDot && (
          <div className={`w-2 h-2 rounded-full ${getStatusColor(statusDot)}`} />
        )}
      </motion.div>

      <AnimatePresence>
        {isExpanded && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-[#1a2055]/50"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
    selectedNode,
    selectStation,
    selectPost,
    selectUnit,
    isLoading,
    isEmergency,
    refreshData,
  } = useDashboard();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const getUnitStatus = (status: string): 'online' | 'warning' | 'offline' => {
    switch (status?.toUpperCase()) {
      case 'ONLINE': return 'online';
      case 'WARNING': return 'warning';
      default: return 'offline';
    }
  };

  // --- RENDER: JPL ROLE (Single Post View) ---
  const renderJplView = () => {
    if (!dataTree?.stations?.[0]?.posts?.[0]) {
      return <div className="p-4 text-slate-400 text-sm">No post assigned</div>;
    }

    const post = dataTree.stations[0].posts[0];
    const onlineUnits = post.units.filter(u => u.status === 'ONLINE').length;

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

        <div className="px-4 py-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">
            Cameras ({onlineUnits}/{post.units.length} Online)
          </div>
          {post.units.map((unit: Unit) => (
            <SidebarItem
              key={unit.id}
              id={unit.id}
              name={unit.name}
              type="unit"
              icon="📹"
              isSelected={selectedNode?.id === unit.id}
              statusDot={getUnitStatus(unit.status)}
              onClick={() => selectUnit(unit)}
            />
          ))}
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

        {/* Posts List */}
        <div className="px-2">
          <div className="px-2 text-[10px] uppercase tracking-wider text-slate-400 mb-2">
            Patrol Posts
          </div>
          {station.posts.map((post: Post) => {
            const onlineUnits = post.units.filter(u => u.status === 'ONLINE').length;
            const isExpanded = expandedIds.has(post.id);

            return (
              <SidebarItem
                key={post.id}
                id={post.id}
                name={post.name}
                type="post"
                icon="📍"
                isSelected={selectedNode?.id === post.id}
                isExpandable={post.units.length > 0}
                isExpanded={isExpanded}
                badge={`${onlineUnits}/${post.units.length}`}
                onClick={() => selectPost(post)}
                onToggle={() => toggleExpand(post.id)}
              >
                {post.units.map((unit: Unit) => (
                  <SidebarItem
                    key={unit.id}
                    id={unit.id}
                    name={unit.name}
                    type="unit"
                    icon="📹"
                    depth={1}
                    isSelected={selectedNode?.id === unit.id}
                    statusDot={getUnitStatus(unit.status)}
                    onClick={() => selectUnit(unit)}
                  />
                ))}
              </SidebarItem>
            );
          })}
        </div>
      </div>
    );
  };

  // --- RENDER: DAOP ROLE (Full Accordion Tree View) ---
  const renderDaopView = () => {
    if (!dataTree?.stations) {
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

        {/* Stations Accordion */}
        <div className="px-2">
          <div className="px-2 text-[10px] uppercase tracking-wider text-slate-400 mb-2">
            Stations
          </div>
          {dataTree.stations.map((station: Station) => {
            const isStationExpanded = expandedIds.has(station.id);
            const totalPosts = station.posts.length;

            return (
              <SidebarItem
                key={station.id}
                id={station.id}
                name={station.name}
                type="station"
                icon="🚉"
                isSelected={selectedNode?.id === station.id}
                isExpandable
                isExpanded={isStationExpanded}
                badge={`${totalPosts} JPL`}
                onClick={() => selectStation(station)}
                onToggle={() => toggleExpand(station.id)}
              >
                {station.posts.map((post: Post) => {
                  const isPostExpanded = expandedIds.has(post.id);
                  const onlineUnits = post.units.filter(u => u.status === 'ONLINE').length;

                  return (
                    <SidebarItem
                      key={post.id}
                      id={post.id}
                      name={post.name}
                      type="post"
                      icon="📍"
                      depth={1}
                      isSelected={selectedNode?.id === post.id}
                      isExpandable={post.units.length > 0}
                      isExpanded={isPostExpanded}
                      badge={`${onlineUnits}/${post.units.length}`}
                      onClick={() => selectPost(post)}
                      onToggle={() => toggleExpand(post.id)}
                    >
                      {post.units.map((unit: Unit) => (
                        <SidebarItem
                          key={unit.id}
                          id={unit.id}
                          name={unit.name}
                          type="unit"
                          icon="📹"
                          depth={2}
                          isSelected={selectedNode?.id === unit.id}
                          statusDot={getUnitStatus(unit.status)}
                          onClick={() => selectUnit(unit)}
                        />
                      ))}
                    </SidebarItem>
                  );
                })}
              </SidebarItem>
            );
          })}
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
    <aside className="h-full w-72 bg-[#1e2563] text-white flex flex-col shadow-xl">
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
                className="absolute bottom-full left-0 right-0 mb-2 bg-[#2D3588] rounded-lg shadow-xl border border-white/10 overflow-hidden"
              >
                {(['jpl', 'station', 'daop'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setRoleDropdownOpen(false);
                      setExpandedIds(new Set());
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
    </aside>
  );
}
