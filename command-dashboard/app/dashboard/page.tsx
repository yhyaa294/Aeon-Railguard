'use client';

import StatusBadge from '@/components/dashboard/StatusBadge';
import LogList from '@/components/dashboard/LogList';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* LEFT: Video Player (70%) */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-md p-4 h-full">
          <h3 className="text-lg font-bold text-[#2D2A70] mb-4">Live Feed - Kamera Utama</h3>
          <div className="relative bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
            {/* Placeholder sampai video stream ready */}
            <div className="text-center">
              <div className="text-6xl mb-4">📹</div>
              <p className="text-gray-600 font-medium">Video Stream</p>
              <p className="text-sm text-gray-500">Camera Feed akan tampil di sini</p>
            </div>
            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              REC
            </div>
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              13:25:43
            </div>
          </div>

          {/* Video Controls (Optional) */}
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-[#2D2A70] text-white rounded-lg hover:bg-[#1a1850] transition text-sm font-medium">
              📷 Ambil Screenshot
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
              🔍 Zoom In
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Status + Logs (30%) */}
      <div className="lg:col-span-1 space-y-6">
        {/* Status Badge */}
        <StatusBadge status="AMAN" />

        {/* Log List */}
        <LogList />
      </div>
    </div>
  );
}
