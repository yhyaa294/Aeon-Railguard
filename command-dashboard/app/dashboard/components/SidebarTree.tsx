'use client';

import { useState } from 'react';
import {
    Folder,
    Video,
    ChevronRight,
    ChevronDown,
    Server,
    ShieldAlert,
    MapPin
} from 'lucide-react';

export type NodeType = 'post' | 'unit';

export interface TreeNode {
    id: string;
    name: string;
    type: NodeType;
    status?: 'online' | 'offline' | 'warning';
    children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
    {
        id: 'post-peterongan',
        name: 'Pos Jaga Peterongan',
        type: 'post',
        children: [
            { id: 'cam-aeon-01', name: 'Aeon-01', type: 'unit', status: 'online' },
            { id: 'cam-aeon-02', name: 'Aeon-02', type: 'unit', status: 'online' },
            { id: 'cam-aeon-03', name: 'Aeon-03', type: 'unit', status: 'warning' },
        ]
    },
    {
        id: 'post-jombang',
        name: 'Pos Jombang Kota',
        type: 'post',
        children: [
            { id: 'cam-jkt-01', name: 'Aeon-JKT-01', type: 'unit', status: 'online' },
            { id: 'cam-jkt-02', name: 'Aeon-JKT-02', type: 'unit', status: 'offline' },
            { id: 'cam-aeon-07', name: 'Aeon-07 (Cross-Jurisdiction)', type: 'unit', status: 'online' },
        ]
    }
];

interface SidebarTreeProps {
    onSelect: (node: TreeNode) => void;
    selectedId: string;
}

export default function SidebarTree({ onSelect, selectedId }: SidebarTreeProps) {
    // Auto-expand all for this demo
    const [expandedIds, setExpandedIds] = useState<string[]>(['post-peterongan', 'post-jombang']);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const renderNode = (node: TreeNode, level: number = 0) => {
        const isExpanded = expandedIds.includes(node.id);
        const isSelected = selectedId === node.id;
        const hasChildren = node.children && node.children.length > 0;

        // Indent based on level
        const paddingLeft = `${level * 16 + 16}px`;

        return (
            <div key={node.id}>
                <div
                    className={`
            flex items-center gap-2 py-3 px-4 cursor-pointer transition-all border-l-[3px]
            ${isSelected
                            ? 'bg-[#1a2055] border-[#F6841F] text-white'
                            : 'border-transparent hover:bg-white/5 text-slate-300'}
          `}
                    style={{ paddingLeft }}
                    onClick={() => {
                        if (hasChildren) toggleExpand(node.id);
                        onSelect(node);
                    }}
                >
                    {/* Icon Logic */}
                    <div className="text-slate-400">
                        {node.type === 'post' ? (
                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        ) : (
                            <div className="w-3.5" /> // Spacer
                        )}
                    </div>

                    <div className={`
            ${node.type === 'post' ? 'text-blue-300' :
                            node.status === 'warning' ? 'text-orange-400' :
                                node.status === 'offline' ? 'text-slate-500' : 'text-emerald-400'}
          `}>
                        {node.type === 'post' ? <Folder size={16} /> : <Video size={16} />}
                    </div>

                    <span className={`text-sm font-medium truncat ${isSelected ? 'text-white' : ''}`}>
                        {node.name}
                    </span>

                    {/* Status Indicator for Units */}
                    {node.type === 'unit' && (
                        <div className={`ml-auto w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-emerald-500' :
                                node.status === 'warning' ? 'bg-orange-500 animate-pulse' :
                                    'bg-slate-600'
                            }`} />
                    )}
                </div>

                {/* Recursive Children */}
                {hasChildren && isExpanded && (
                    <div className="bg-[#1a1f3c]">
                        {node.children!.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full bg-[#2D3588] text-white flex flex-col">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <Server className="w-6 h-6 text-[#F6841F]" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-none">Aeon VMS</h2>
                        <span className="text-xs text-blue-200">Enterprise Edition</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10">
                <div className="px-4 mb-2 text-xs font-bold text-blue-300 uppercase tracking-widest">
                    Site Explorer
                </div>
                {TREE_DATA.map(node => renderNode(node))}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#252b75]">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-blue-200">SYSTEM: ONLINE</span>
                </div>
            </div>
        </div>
    );
}
