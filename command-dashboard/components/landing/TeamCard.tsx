import React from 'react';

interface TeamCardProps {
    name: string;
    role: string;
    tagline: string;
    color: string;
}

export default function TeamCard({ name, role, tagline, color }: TeamCardProps) {
    const colorClasses: Record<string, string> = {
        blue: 'from-blue-500 to-blue-600',
        pink: 'from-pink-500 to-rose-500',
        purple: 'from-purple-500 to-violet-600',
        orange: 'from-orange-500 to-amber-500',
    };
    const gradient = colorClasses[color] || colorClasses.blue;

    return (
        <div className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-black group-hover:scale-110 transition-transform shadow-lg`}>
                {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{tagline}</div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">{name}</h4>
            <p className="text-sm text-slate-500">{role}</p>
        </div>
    );
}
