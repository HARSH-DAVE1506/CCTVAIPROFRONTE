import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Camera } from '../../../types';
import { useEmberlyStore } from '../../../store';
import { CCTVPlayer } from '../../CCTVPlayer';
import { MODELS } from '../../../data';
import { 
  X, 
  VideoCamera, 
  Pulse, 
  ShieldCheck, 
  MapPin, 
  Cpu, 
  Cube, 
  Check, 
  ArrowsClockwise, 
  Copy, 
  Trash, 
  SlidersHorizontal,
  Warning,
  CheckCircle,
  Play
} from '@phosphor-icons/react';

interface CameraDetailModalProps {
  camera: Camera | null;
  onClose: () => void;
}

export const CameraDetailModal: React.FC<CameraDetailModalProps> = ({ camera, onClose }) => {
  const { updateCamera, deleteCamera } = useEmberlyStore();
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'MODELS' | 'SETTINGS'>('TELEMETRY');
  const [copiedStream, setCopiedStream] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  if (!camera) return null;

  const handleCopyStream = () => {
    navigator.clipboard.writeText(camera.streamUrl || `rtsp://${camera.ipAddress || '10.240.12.23'}:554/live/main`);
    setCopiedStream(true);
    setTimeout(() => setCopiedStream(false), 2000);
  };

  const handleToggleModel = (modelName: string) => {
    const exists = camera.aiModels.includes(modelName);
    const newModels = exists
      ? camera.aiModels.filter(m => m !== modelName)
      : [...camera.aiModels, modelName];
    updateCamera(camera.id, { aiModels: newModels });
  };

  const handleToggleStatus = () => {
    const nextStatus = camera.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    updateCamera(camera.id, { 
      status: nextStatus, 
      health: nextStatus === 'ONLINE' ? 98 : 0,
      lastSeen: nextStatus === 'ONLINE' ? 'Live Now (30 FPS)' : 'Manually Disconnected'
    });
  };

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      updateCamera(camera.id, { health: 99, lastSeen: 'Verified (28ms RTT)' });
    }, 1000);
  };

  const handleDelete = () => {
    deleteCamera(camera.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e1017] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
              camera.status === 'ONLINE' ? "bg-green-500/10 border-green-500/20 text-green-400" :
              camera.status === 'DEGRADED' ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
              "bg-red-500/10 border-red-500/20 text-red-400"
            )}>
              <VideoCamera size={24} weight="fill" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white tracking-wide">{camera.name || camera.id}</h3>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono tracking-wider",
                  camera.status === 'ONLINE' ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                  camera.status === 'DEGRADED' ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                  "bg-red-500/20 text-red-400 border border-red-500/30"
                )}>
                  {camera.status} · {camera.health}% HEALTH
                </span>
              </div>
              <p className="text-xs text-white/40 font-mono mt-0.5">
                {camera.id} · {camera.location} · {camera.group || 'Public Surveillance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePing}
              disabled={isPinging}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white/70 hover:text-white border border-white/5 transition-all"
            >
              <Pulse size={14} className={cn(isPinging && "animate-spin text-orange-500")} />
              {isPinging ? 'Pinging Node...' : 'Ping Diagnostic'}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors border border-white/5"
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-black/40 border-b border-white/5 flex items-center gap-4 text-xs font-bold">
          {[
            { id: 'TELEMETRY', label: 'Stream Feed & Telemetry' },
            { id: 'MODELS', label: `Active AI Deployments (${camera.aiModels.length})` },
            { id: 'SETTINGS', label: 'Hardware & Configuration' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-2 px-3 rounded-lg transition-all",
                activeTab === tab.id
                  ? "bg-orange-600/20 text-orange-400 border border-orange-500/30"
                  : "text-white/40 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: TELEMETRY & FEED */}
          {activeTab === 'TELEMETRY' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-7 space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 group shadow-2xl">
                  <CCTVPlayer cameraId={camera.id} streamUrl={camera.streamUrl} className="w-full h-full" />
                  
                  {/* HUD Overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-green-500 text-[8px] font-bold text-white uppercase">
                          {camera.status}
                        </span>
                        <span className="text-xs font-bold text-white">{camera.id}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/70 bg-black/60 px-2 py-0.5 rounded">
                        {camera.fps || 30} FPS · {camera.bitrate || '8.4 Mbps'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-white/60 bg-black/60 px-3 py-1.5 rounded-xl border border-white/5">
                      <span>{camera.resolution}</span>
                      <span>CODEC: {camera.codec || 'H.265'}</span>
                      <span>LATENCY: {camera.latency || '38 ms'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-500" weight="fill" />
                    <span className="text-xs text-white/80 font-semibold">{camera.location}</span>
                  </div>
                  <span className="text-xs font-mono text-white/40">
                    {camera.coordinates?.lat?.toFixed(4)}, {camera.coordinates?.lng?.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-[#13151f] border border-white/5 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                    RTSP Ingestion Endpoint
                  </span>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-orange-400 break-all flex items-center justify-between gap-2">
                    <span className="truncate">{camera.streamUrl || `rtsp://${camera.ipAddress || '10.240.12.23'}:554/live/main`}</span>
                    <button
                      onClick={handleCopyStream}
                      className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white shrink-0"
                    >
                      {copiedStream ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#13151f] border border-white/5 space-y-2.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                    Stream Health Telemetry
                  </span>
                  
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Protocol Ingestion:</span>
                    <span className="text-white font-mono">{camera.protocol || 'RTSP'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Form Factor:</span>
                    <span className="text-white font-semibold">{camera.formFactor || 'PTZ'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Compute Pipeline:</span>
                    <span className="text-orange-400 font-semibold">{camera.computeTarget || 'EDGE_GATEWAY'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Hardware Vendor:</span>
                    <span className="text-white">{camera.vendor || 'Axis Communications'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleToggleStatus}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-xs font-bold transition-all border",
                      camera.status === 'ONLINE'
                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                    )}
                  >
                    {camera.status === 'ONLINE' ? 'Suspend Camera Stream' : 'Reconnect Camera Stream'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI MODELS BINDING */}
          {activeTab === 'MODELS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Attached AI Intelligence Capabilities</h4>
                  <p className="text-xs text-white/40">
                    Enable or disable centrally approved inference models executing on this video stream.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-xs font-bold font-mono">
                  {camera.aiModels.length} Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {MODELS.map((model) => {
                  const isAttached = camera.aiModels.includes(model.name);
                  return (
                    <div
                      key={model.id}
                      onClick={() => handleToggleModel(model.name)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between",
                        isAttached
                          ? "bg-orange-600/10 border-orange-500"
                          : "bg-[#13151f] border-white/5 opacity-60 hover:opacity-90"
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center",
                              isAttached ? "bg-orange-600 text-white" : "bg-white/5 text-white/30"
                            )}>
                              <Cube size={16} weight="fill" />
                            </div>
                            <span className="text-xs font-bold text-white">{model.name}</span>
                          </div>
                          <div className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center border",
                            isAttached ? "bg-orange-600 border-orange-500 text-white" : "border-white/20"
                          )}>
                            {isAttached && <Check size={10} weight="bold" />}
                          </div>
                        </div>
                        <p className="text-[10px] text-white/50 line-clamp-2">{model.description}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-white/40">
                        <span>Latency: {model.latency}</span>
                        <span className="text-green-400">Score: {model.accuracy}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CONFIGURATION & REMOVAL */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#13151f] border border-white/5 space-y-4">
                <h4 className="text-sm font-bold text-white">Stream Configuration</h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1 font-bold uppercase">IP Address</label>
                    <input
                      type="text"
                      value={camera.ipAddress || '10.240.12.23'}
                      onChange={(e) => updateCamera(camera.id, { ipAddress: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 block mb-1 font-bold uppercase">RTSP Port</label>
                    <input
                      type="number"
                      value={camera.port || 554}
                      onChange={(e) => updateCamera(camera.id, { port: parseInt(e.target.value) || 554 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-red-400">Decommission Camera</h4>
                  <p className="text-[11px] text-white/40">
                    Remove this camera stream from the department's surveillance inventory and release allocated AI inference instances.
                  </p>
                </div>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors"
                >
                  <Trash size={16} />
                  Decommission Node
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
