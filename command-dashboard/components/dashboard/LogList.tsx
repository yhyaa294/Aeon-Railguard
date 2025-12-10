'use client';

interface LogEntry {
    time: string;
    message: string;
    severity: 'info' | 'warning' | 'danger';
}

const dummyLogs: LogEntry[] = [
    { time: '13:24:15', message: 'Sistem monitoring aktif', severity: 'info' },
    { time: '13:22:42', message: 'Deteksi objek di kamera 2', severity: 'warning' },
    { time: '13:20:11', message: 'Koneksi kamera 4 restored', severity: 'info' },
    { time: '13:18:05', message: 'Peringatan: Objek mendekati rel', severity: 'danger' },
    { time: '13:15:33', message: 'Sistem normal', severity: 'info' },
    { time: '13:12:47', message: 'Deteksi kendaraan di zona merah', severity: 'warning' },
    { time: '13:10:02', message: 'AI engine berjalan optimal', severity: 'info' },
];

export default function LogList() {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 h-full">
            <h3 className="text-lg font-bold text-[#2D2A70] mb-4 border-b pb-2">Log Deteksi Real-time</h3>
            <div className="space-y-2 overflow-y-auto max-h-[500px]">
                {dummyLogs.map((log, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${log.severity === 'danger'
                                ? 'bg-red-50 border-red-500'
                                : log.severity === 'warning'
                                    ? 'bg-yellow-50 border-yellow-500'
                                    : 'bg-gray-50 border-gray-300'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{log.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                            </div>
                            {log.severity === 'danger' && <span className="text-red-500 text-xl">🚨</span>}
                            {log.severity === 'warning' && <span className="text-yellow-500 text-xl">⚠️</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
