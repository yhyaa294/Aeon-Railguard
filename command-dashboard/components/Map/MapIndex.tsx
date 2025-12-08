'use client';

import dynamic from 'next/dynamic';
import { RefreshCw } from 'lucide-react';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="animate-spin text-blue-400 mx-auto mb-2" size={32} />
        <span className="text-slate-400 text-sm">Loading Map...</span>
      </div>
    </div>
  ),
});

interface MapIndexProps {
  className?: string;
}

export default function MapIndex({ className }: MapIndexProps) {
  return (
    <div className={`h-full w-full ${className || ''}`}>
      <MapView />
    </div>
  );
}
