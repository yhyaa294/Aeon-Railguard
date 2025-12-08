"use client";

import { useState } from "react";
import { Sliders, Eye, Zap, Save, RefreshCw } from "lucide-react";

export default function AIConfigPage() {
  const [confidence, setConfidence] = useState(85);
  const [brakingDist, setBrakingDist] = useState(1.5);
  const [thermal, setThermal] = useState(true);
  const [lowLight, setLowLight] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">AI Sensor Configuration</h1>
          <p className="text-slate-400 text-sm">Fine-tune detection parameters and sensor calibration.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* THRESHOLDS CARD */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-950/50 rounded-lg border border-cyan-500/20">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-bold text-slate-100">Detection Thresholds</h3>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-mono text-slate-400">MIN CONFIDENCE SCORE</label>
                <span className="text-cyan-400 font-mono font-bold">{confidence}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={confidence} 
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-slate-500 mt-2">Lower values increase sensitivity but may cause false positives.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-mono text-slate-400">BRAKING TRIGGER DISTANCE</label>
                <span className="text-cyan-400 font-mono font-bold">{brakingDist} km</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5.0" 
                step="0.1"
                value={brakingDist} 
                onChange={(e) => setBrakingDist(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-slate-500 mt-2">Distance from crossing to trigger emergency locomotive braking.</p>
            </div>
          </div>
        </div>

        {/* SENSOR MODES CARD */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-950/50 rounded-lg border border-purple-500/20">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-slate-100">Visual Enhancement</h3>
          </div>

          <div className="space-y-4">
            <Toggle 
              label="Thermal Vision Layer" 
              desc="Overlay heat-signature map on video feed."
              active={thermal} 
              onToggle={() => setThermal(!thermal)} 
            />
            <div className="w-full h-px bg-slate-800/50" />
            <Toggle 
              label="Low-Light Enhancement (CLAHE)" 
              desc="Boost contrast in night-time conditions."
              active={lowLight} 
              onToggle={() => setLowLight(!lowLight)} 
            />
          </div>

          <div className="mt-8 p-4 bg-yellow-950/10 border border-yellow-500/10 rounded-lg">
             <div className="flex items-start gap-3">
               <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
               <div>
                 <h4 className="text-sm font-bold text-yellow-500">Power Consumption Warning</h4>
                 <p className="text-xs text-yellow-500/70 mt-1">Enabling all enhancement layers may increase edge device latency by 15-20ms.</p>
               </div>
             </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-6">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-lg font-bold tracking-wide transition-all"
        >
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <Save size={18} /> SAVE CONFIGURATION
            </>
          )}
        </button>
      </div>

    </div>
  );
}

function Toggle({ label, desc, active, onToggle }: { label: string, desc: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-200">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-cyan-600' : 'bg-slate-700'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
