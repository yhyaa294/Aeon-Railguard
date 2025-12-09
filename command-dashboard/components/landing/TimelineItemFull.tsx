import React from 'react';

interface TimelineItemFullProps {
    year: string;
    status: string;
    statusColor: string;
    title: string;
    description: string;
    isLeft: boolean;
    icon: React.ReactNode;
    highlights: string[];
    isBig?: boolean;
}

export default function TimelineItemFull({
    year,
    status,
    statusColor,
    title,
    description,
    isLeft,
    icon,
    highlights,
    isBig = false
}: TimelineItemFullProps) {
    const statusColors: Record<string, string> = {
        green: "bg-green-500",
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        orange: "bg-orange-500",
        red: "bg-red-500",
    };
    const badgeColors: Record<string, string> = {
        green: "bg-green-500/20 text-green-400 border-green-500/30",
        blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        red: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    const dotColor = statusColors[statusColor] || statusColors.blue;
    const badgeColor = badgeColors[statusColor] || badgeColors.blue;

    return (
        <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-12 ${isBig ? 'md:scale-105' : ''}`}>
            {isLeft ? (
                <>
                    {/* Left Content */}
                    <div className="md:w-1/2 md:text-right md:pr-16 pl-20 md:pl-0">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 ${badgeColor} border text-xs font-bold rounded-full mb-3`}>
                            {status}
                        </div>
                        <div className="text-5xl font-black text-white/20 mb-3 font-mono">{year}</div>
                        <h3 className={`font-bold text-white mb-3 ${isBig ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">{description}</p>
                        <div className="flex flex-wrap gap-2 md:justify-end">
                            {highlights.map((h, i) => (
                                <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md">{h}</span>
                            ))}
                        </div>
                    </div>
                    {/* Center Dot */}
                    <div className={`absolute left-8 md:left-1/2 w-12 h-12 ${dotColor} rounded-full border-4 border-slate-900 shadow-xl transform md:-translate-x-1/2 flex items-center justify-center text-white`}>
                        {icon}
                    </div>
                    {/* Right Placeholder */}
                    <div className="md:w-1/2 md:pl-16" />
                </>
            ) : (
                <>
                    {/* Left Placeholder */}
                    <div className="md:w-1/2 md:pr-16 md:order-1 order-2" />
                    {/* Center Dot */}
                    <div className={`absolute left-8 md:left-1/2 w-12 h-12 ${dotColor} rounded-full border-4 border-slate-900 shadow-xl transform md:-translate-x-1/2 flex items-center justify-center text-white`}>
                        {icon}
                    </div>
                    {/* Right Content */}
                    <div className="md:w-1/2 md:pl-16 md:order-2 order-1 pl-20 md:pl-16">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 ${badgeColor} border text-xs font-bold rounded-full mb-3`}>
                            {status}
                        </div>
                        <div className="text-5xl font-black text-white/20 mb-3 font-mono">{year}</div>
                        <h3 className={`font-bold text-white mb-3 ${isBig ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">{description}</p>
                        <div className="flex flex-wrap gap-2">
                            {highlights.map((h, i) => (
                                <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md">{h}</span>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
