'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Building2,
  MapPin,
  Cctv,
  Layers,
} from 'lucide-react';
import { useDashboard, Region, Station, Post, Unit, SelectedNodeType } from '@/contexts/DashboardContext';

// --- TYPE DEFINITIONS ---

type NodeType = 'region' | 'station' | 'post' | 'unit';

interface TreeNode {
  id: string;
  name: string;
  nodeType: NodeType;
  children?: TreeNode[];
  status?: string;
  metadata?: {
    code?: string;
    head_officer?: string;
    geo_location?: string;
    unitType?: string;
    lat?: number;
    long?: number;
  };
  originalData: Region | Station | Post | Unit;
}

interface SidebarTreeProps {
  node: TreeNode;
  level?: number;
}

// --- HELPER: Convert Hierarchy to TreeNode ---

export function convertRegionToTree(region: Region): TreeNode {
  return {
    id: region.id,
    name: region.name,
    nodeType: 'region',
    metadata: { code: region.code },
    originalData: region,
    children: region.stations.map(station => convertStationToTree(station)),
  };
}

export function convertStationToTree(station: Station): TreeNode {
  return {
    id: station.id,
    name: station.name,
    nodeType: 'station',
    metadata: { head_officer: station.head_officer },
    originalData: station,
    children: station.posts.map(post => convertPostToTree(post)),
  };
}

export function convertPostToTree(post: Post): TreeNode {
  return {
    id: post.id,
    name: post.name,
    nodeType: 'post',
    metadata: { geo_location: post.geo_location },
    originalData: post,
    children: post.units.map(unit => convertUnitToTree(unit)),
  };
}

export function convertUnitToTree(unit: Unit): TreeNode {
  return {
    id: unit.id,
    name: unit.name,
    nodeType: 'unit',
    status: unit.status,
    metadata: {
      unitType: unit.type,
      lat: unit.lat,
      long: unit.long,
    },
    originalData: unit,
    children: undefined,
  };
}

// --- ICON MAPPING ---

const NODE_ICONS: Record<NodeType, React.ReactNode> = {
  region: <Layers size={16} className="text-purple-400" />,
  station: <Building2 size={16} className="text-orange-400" />,
  post: <MapPin size={16} className="text-blue-400" />,
  unit: <Cctv size={14} className="text-emerald-400" />,
};

// --- STATUS COLOR HELPER ---

function getStatusIndicator(status?: string): React.ReactNode {
  if (!status) return null;
  
  const colorClass = (() => {
    switch (status.toUpperCase()) {
      case 'ONLINE': return 'bg-emerald-500';
      case 'WARNING': return 'bg-orange-500 animate-pulse';
      case 'OFFLINE': return 'bg-slate-600';
      default: return 'bg-slate-400';
    }
  })();

  return <div className={`w-2 h-2 rounded-full ${colorClass}`} />;
}

// --- RECURSIVE TREE COMPONENT ---

export default function SidebarTree({ node, level = 0 }: SidebarTreeProps) {
  const { selectedNode, selectNode } = useDashboard();
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first 2 levels

  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;
  const isSelected = selectedNode?.id === node.id;

  // Dynamic padding based on level (4 = 1rem = 16px per level)
  const paddingLeft = 12 + level * 16;

  const handleToggle = useCallback(() => {
    if (hasChildren) {
      setIsOpen(prev => !prev);
    }
  }, [hasChildren]);

  const handleSelect = useCallback(() => {
    selectNode(node.id, node.nodeType as SelectedNodeType);
  }, [node.id, node.nodeType, selectNode]);

  const handleClick = useCallback(() => {
    handleSelect();
    if (hasChildren) {
      handleToggle();
    }
  }, [handleSelect, handleToggle, hasChildren]);

  // Get child count badge
  const getChildBadge = (): string | null => {
    if (!node.children || node.children.length === 0) return null;
    
    switch (node.nodeType) {
      case 'region':
        return `${node.children.length} Stations`;
      case 'station':
        return `${node.children.length} Posts`;
      case 'post':
        const onlineCount = node.children.filter(
          c => (c.originalData as Unit).status === 'ONLINE'
        ).length;
        return `${onlineCount}/${node.children.length}`;
      default:
        return null;
    }
  };

  const badge = getChildBadge();

  return (
    <div className="select-none">
      {/* Node Row */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, delay: level * 0.02 }}
        className={`
          flex items-center gap-2 py-2.5 cursor-pointer transition-all duration-150
          border-l-[3px] group
          ${isSelected
            ? 'bg-orange-500/20 border-orange-500 text-white'
            : 'border-transparent hover:bg-white/5 text-slate-300 hover:text-white'}
        `}
        style={{ paddingLeft, paddingRight: 12 }}
        onClick={handleClick}
      >
        {/* Expand/Collapse Chevron */}
        {hasChildren ? (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="text-slate-400 group-hover:text-slate-200"
          >
            <ChevronRight size={14} />
          </motion.div>
        ) : (
          <div className="w-[14px]" /> // Spacer for alignment
        )}

        {/* Node Icon */}
        {NODE_ICONS[node.nodeType]}

        {/* Node Name */}
        <span className={`text-sm truncate flex-1 ${isLeaf ? '' : 'font-medium'}`}>
          {node.name}
        </span>

        {/* Badge */}
        {badge && (
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-400 group-hover:text-slate-200">
            {badge}
          </span>
        )}

        {/* Status Indicator (for units) */}
        {node.nodeType === 'unit' && getStatusIndicator(node.status)}
      </motion.div>

      {/* Children (Recursive) */}
      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-[#1a2055]/30">
              {node.children!.map(child => (
                <SidebarTree key={child.id} node={child} level={level + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- STANDALONE TREE WRAPPER (for easy integration) ---

interface SidebarTreeRootProps {
  className?: string;
}

export function SidebarTreeRoot({ className = '' }: SidebarTreeRootProps) {
  const { dataTree, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (!dataTree) {
    return (
      <div className={`p-4 text-center text-slate-400 text-sm ${className}`}>
        No data available
      </div>
    );
  }

  const treeData = convertRegionToTree(dataTree);

  return (
    <div className={className}>
      <SidebarTree node={treeData} level={0} />
    </div>
  );
}
