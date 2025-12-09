import React from 'react';

interface FeaturePillProps {
    icon: React.ReactNode;
    text: string;
}

export default function FeaturePill({ icon, text }: FeaturePillProps) {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-slate-100 text-sm font-medium text-slate-700">
            <span className="text-[#2D3588]">{icon}</span>
            {text}
        </div>
    );
}
