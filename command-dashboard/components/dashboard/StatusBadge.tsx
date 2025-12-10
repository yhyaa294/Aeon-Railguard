'use client';

import { motion } from 'framer-motion';

type StatusType = 'SAFE' | 'WARNING' | 'DANGER';

interface StatusBadgeProps {
    status: StatusType;
}

const statusConfig = {
    SAFE: {
        bg: 'bg-gradient-to-r from-emerald-500 to-green-600',
        text: 'AMAN TERKENDALI',
        icon: '✓',
        shadow: 'shadow-emerald-500/50',
        animate: false,
    },
    WARNING: {
        bg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
        text: 'WASPADA AKTIVITAS',
        icon: '⚠',
        shadow: 'shadow-amber-500/50',
        animate: false,
    },
    DANGER: {
        bg: 'bg-gradient-to-r from-red-500 to-rose-600',
        text: 'BAHAYA - STOP KERETA!',
        icon: '🚨',
        shadow: 'shadow-red-500/50',
        animate: true,
    },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
        relative overflow-hidden rounded-2xl p-6 
        ${config.bg} ${config.shadow} shadow-xl
        ${config.animate ? 'animate-pulse' : ''}
      `}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white">
                <div className="text-5xl mb-3">{config.icon}</div>
                <h2 className="text-2xl font-black tracking-wider uppercase">
                    {config.text}
                </h2>
                <p className="text-sm mt-2 opacity-80 font-medium">
                    Status Sistem Real-time
                </p>
            </div>

            {/* Danger Flashing Overlay */}
            {config.animate && (
                <motion.div
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute inset-0 bg-white rounded-2xl"
                />
            )}
        </motion.div>
    );
}
