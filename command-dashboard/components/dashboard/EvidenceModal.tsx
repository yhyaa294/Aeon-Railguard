'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LogEntry {
    time: string;
    message: string;
    type: 'info' | 'warning' | 'danger' | 'success';
}

interface EvidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: LogEntry | null;
}

const typeLabels = {
    info: { label: 'Informasi', color: 'text-blue-600 bg-blue-100' },
    warning: { label: 'Peringatan', color: 'text-amber-600 bg-amber-100' },
    danger: { label: 'Bahaya', color: 'text-red-600 bg-red-100' },
    success: { label: 'Sukses', color: 'text-emerald-600 bg-emerald-100' },
};

export default function EvidenceModal({ isOpen, onClose, data }: EvidenceModalProps) {
    if (!data) return null;

    const typeInfo = typeLabels[data.type] || typeLabels.info;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#2D2A70] text-white px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <span>📷</span> Bukti Deteksi
                                    </h2>
                                    <p className="text-sm text-white/70 font-mono">{data.time}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Image */}
                            <div className="relative aspect-video bg-slate-900">
                                <Image
                                    src="/images/feed-street.jpg"
                                    alt="Evidence Snapshot"
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/dashboard.png';
                                    }}
                                />
                                {/* Overlay info */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                            SNAPSHOT
                                        </span>
                                        <span className="text-white/80 text-sm font-mono">{data.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6 space-y-4">
                                {/* Type Badge */}
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500 text-sm">Tipe:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${typeInfo.color}`}>
                                        {typeInfo.label}
                                    </span>
                                </div>

                                {/* Message */}
                                <div>
                                    <span className="text-slate-500 text-sm block mb-1">Pesan Log:</span>
                                    <p className="text-[#2D2A70] font-medium bg-slate-50 p-3 rounded-lg border">
                                        {data.message}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                                    >
                                        Tutup
                                    </button>
                                    <button className="flex-1 px-4 py-3 bg-[#DA5525] hover:bg-[#c44a1f] text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                                        <span>📥</span> Download Bukti
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
