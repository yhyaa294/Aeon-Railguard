'use client';

interface StatusBadgeProps {
    status: 'AMAN' | 'WASPADA' | 'BAHAYA';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = {
        AMAN: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-300',
            label: 'AMAN',
            icon: '✓'
        },
        WASPADA: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-300',
            label: 'WASPADA',
            icon: '⚠'
        },
        BAHAYA: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-300',
            label: 'BAHAYA',
            icon: '🚨'
        }
    };

    const current = config[status];

    return (
        <div className={`${current.bg} ${current.border} border-2 rounded-xl p-6 text-center`}>
            <div className="text-5xl mb-2">{current.icon}</div>
            <h3 className={`text-3xl font-bold ${current.text}`}>{current.label}</h3>
            <p className="text-sm text-gray-600 mt-2">Status Sistem Saat Ini</p>
        </div>
    );
}
