'use client';

import { motion } from 'framer-motion';

interface LogEntry {
    time: string;
    message: string;
    type: 'info' | 'warning' | 'danger' | 'success';
}

interface LogListProps {
    logs: LogEntry[];
}

const typeStyles = {
    info: {
        bg: 'bg-blue-50',
        border: 'border-l-blue-500',
        text: 'text-blue-700',
        icon: 'ℹ️',
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-l-amber-500',
        text: 'text-amber-700',
        icon: '⚠️',
    },
    danger: {
        bg: 'bg-red-50',
        border: 'border-l-red-500',
        text: 'text-red-700',
        icon: '🚨',
    },
    success: {
        bg: 'bg-emerald-50',
        border: 'border-l-emerald-500',
        text: 'text-emerald-700',
        icon: '✓',
    },
};

export default function LogList({ logs }: LogListProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-[#2D2A70] text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <span>📋</span> LOG AKTIVITAS
                </h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {logs.length} entries
                </span>
            </div>

            {/* Log List - Scrollable */}
            <div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-2">
                {logs.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                        <p className="text-sm">Belum ada aktivitas tercatat</p>
                    </div>
                ) : (
                    logs.map((log, index) => {
                        const style = typeStyles[log.type] || typeStyles.info;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`
                  ${style.bg} ${style.border} border-l-4 
                  rounded-r-lg p-3 hover:shadow-md transition-shadow
                `}
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-sm">{style.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${style.text} truncate`}>
                                            {log.message}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 font-mono">
                                            {log.time}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-4 py-2 border-t text-xs text-slate-500 text-center">
                Auto-refresh setiap 1 detik
            </div>
        </div>
    );
}
