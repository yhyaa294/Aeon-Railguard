"use client";
import { Camera, Maximize } from "lucide-react";

export default function LiveFeed() {
    return (
        <div className="relative h-full w-full bg-black rounded-lg overflow-hidden border border-slate-700 group">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-red-500 font-mono text-xs animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    LIVE CAM 01
                </div>
                <Maximize className="text-white/50 w-4 h-4 cursor-pointer hover:text-white" />
            </div>

            {/* Video Placeholder (In real app, this would be an img tag with MJPEG stream or WebRTC) */}
            <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-2 opacity-20" />
                    <p className="font-mono text-sm">SIGNAL ACQUIRED</p>
                    <p className="text-xs opacity-50">View from 'The Eye'</p>
                    {/* Note: To show the actual detector output, we would need to stream the frame from Python. 
              For MVP, the Python script shows its own window. This dashboard shows the *status* primarily. 
              If we want the video here, we'd need a video server. 
              For now, we can show a cool animation or static 'NO SIGNAL' if no MJPEG server.
          */}
                </div>
            </div>

            {/* Overlay Data */}
            <div className="absolute bottom-4 left-4 font-mono text-xs text-green-500">
                <div>LAT: -6.2088 N</div>
                <div>LON: 106.8456 E</div>
            </div>
        </div>
    );
}
