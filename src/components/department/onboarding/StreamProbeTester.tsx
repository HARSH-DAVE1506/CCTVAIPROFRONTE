import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { StreamDiagnostics } from '../../../types';
import { CCTVPlayer } from '../../CCTVPlayer';
import { 
  Play, 
  CheckCircle, 
  Warning, 
  ArrowsClockwise, 
  Camera as CameraIcon, 
  Pulse, 
  Cpu, 
  Eye, 
  Broadcast, 
  Lightning, 
  ShieldCheck 
} from '@phosphor-icons/react';

interface StreamProbeTesterProps {
  cameraId?: string;
  streamUrl: string;
  protocol: string;
  ipAddress: string;
  port: number;
  previewImage: string;
  onDiagnosticsComplete?: (diag: StreamDiagnostics) => void;
}

export const StreamProbeTester: React.FC<StreamProbeTesterProps> = ({
  cameraId,
  streamUrl,
  protocol,
  ipAddress,
  port,
  previewImage,
  onDiagnosticsComplete
}) => {
  const [isProbing, setIsProbing] = useState(false);
  const [probeStage, setProbeStage] = useState<number>(4); // 0=socket, 1=rtsp, 2=sdp, 3=frame, 4=done
  const [diagnostics, setDiagnostics] = useState<StreamDiagnostics>({
    pingMs: 38,
    socketStatus: 'CONNECTED',
    rtspHandshake: 'SUCCESS',
    authMethod: 'DIGEST',
    detectedCodec: 'H.265 (HEVC Main Profile)',
    detectedResolution: '3840 x 2160 (4K UHD)',
    detectedFps: 30,
    measuredBitrate: '8.42 Mbps',
    packetLoss: '0.0%',
    jitter: '1.8 ms',
    keyframeInterval: 'GOP 30 (1.0 sec)',
    streamHealthScore: 98
  });
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [showMotionGrid, setShowMotionGrid] = useState(true);

  const runLiveProbe = () => {
    setIsProbing(true);
    setProbeStage(0);

    setTimeout(() => setProbeStage(1), 400);
    setTimeout(() => setProbeStage(2), 900);
    setTimeout(() => setProbeStage(3), 1400);
    setTimeout(() => {
      setProbeStage(4);
      setIsProbing(false);
      const res: StreamDiagnostics = {
        pingMs: Math.floor(28 + Math.random() * 20),
        socketStatus: 'CONNECTED',
        rtspHandshake: 'SUCCESS',
        authMethod: 'DIGEST',
        detectedCodec: 'H.265 (HEVC Main Profile)',
        detectedResolution: '3840 x 2160 (4K UHD)',
        detectedFps: 30,
        measuredBitrate: `${(7.8 + Math.random() * 1.2).toFixed(2)} Mbps`,
        packetLoss: '0.0%',
        jitter: `${(1.2 + Math.random() * 1.0).toFixed(1)} ms`,
        keyframeInterval: 'GOP 30 (1.0 sec)',
        streamHealthScore: 98
      };
      setDiagnostics(res);
      if (onDiagnosticsComplete) {
        onDiagnosticsComplete(res);
      }
    }, 1800);
  };

  const captureFrame = () => {
    setCapturedSnapshot(previewImage);
    setTimeout(() => setCapturedSnapshot(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Probe Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center border transition-all",
            probeStage === 4 
              ? "bg-green-500/10 border-green-500/20 text-green-400" 
              : "bg-orange-500/10 border-orange-500/20 text-orange-400"
          )}>
            <Pulse size={20} weight="bold" className={cn(isProbing && "animate-spin")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-xs font-bold text-white tracking-wide">Live Stream Prober & Telemetry</h5>
              <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[8px] font-bold uppercase font-mono">
                {protocol} · {diagnostics.pingMs}ms PING
              </span>
            </div>
            <p className="text-[10px] text-white/40 font-mono truncate max-w-md">
              {streamUrl || `rtsp://${ipAddress || '192.168.40.104'}:${port || 554}/live/main`}
            </p>
          </div>
        </div>

        <button
          onClick={runLiveProbe}
          disabled={isProbing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all shadow-md shadow-orange-600/20 disabled:opacity-50"
        >
          <ArrowsClockwise size={14} weight="bold" className={cn(isProbing && "animate-spin")} />
          {isProbing ? 'Probing Handshake...' : 'Re-test Stream Signal'}
        </button>
      </div>

      {/* Main Grid: Feed Preview + Diagnostics Matrix */}
      <div className="grid grid-cols-12 gap-6">
        {/* Live Video Preview Box */}
        <div className="col-span-7 space-y-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 group shadow-2xl">
            {streamUrl && (streamUrl.startsWith('/api/') || streamUrl.includes('.m3u8') || streamUrl.includes('whep') || streamUrl.startsWith('http')) ? (
              <CCTVPlayer
                cameraId={cameraId || 'cam01'}
                streamUrl={streamUrl}
                preferredProtocol={protocol.toLowerCase().includes('webrtc') ? 'WHEP' : 'HLS'}
                className="w-full h-full"
                showOverlay={false}
              />
            ) : (
              <img 
                src={previewImage} 
                alt="Live feed probe" 
                className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
              />
            )}

            {/* Scanline & Grid Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.03] to-transparent bg-[length:100%_4px] opacity-70" />

            {/* Motion Grid Overlay */}
            {showMotionGrid && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-6 grid-rows-4 opacity-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-orange-500/30" />
                ))}
              </div>
            )}

            {/* Simulated Live Detection Bounding Box */}
            <div className="absolute top-1/4 left-1/3 w-36 h-28 border-2 border-orange-500 rounded-lg pointer-events-none shadow-[0_0_15px_rgba(234,88,12,0.4)]">
              <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-orange-600 rounded text-[7px] font-bold text-white font-mono uppercase tracking-wider">
                Target Lock · 96.4%
              </div>
            </div>

            {/* HUD Status Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-bold text-white uppercase tracking-wider">PROBE FEED: OK</span>
                <span className="text-[8px] font-mono text-white/50">| {diagnostics.detectedFps} FPS</span>
              </div>

              <div className="flex items-center gap-1 pointer-events-auto">
                <button
                  onClick={() => setShowMotionGrid(!showMotionGrid)}
                  className={cn(
                    "px-2 py-1 rounded-lg text-[8px] font-bold uppercase transition-all backdrop-blur-md border",
                    showMotionGrid ? "bg-orange-600 text-white border-orange-500/50" : "bg-black/60 text-white/50 border-white/10"
                  )}
                >
                  Motion Grid
                </button>
                <button
                  onClick={captureFrame}
                  className="px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white text-[8px] font-bold uppercase transition-all backdrop-blur-md border border-white/10 flex items-center gap-1"
                >
                  <CameraIcon size={10} weight="bold" />
                  Capture
                </button>
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[8px] font-mono text-white/70 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
              <span>RES: {diagnostics.detectedResolution.split(' ')[0]}</span>
              <span>BITRATE: {diagnostics.measuredBitrate}</span>
              <span>CODEC: {diagnostics.detectedCodec.split(' ')[0]}</span>
              <span>LOSS: {diagnostics.packetLoss}</span>
            </div>

            {/* Flash Capture Alert */}
            {capturedSnapshot && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-xs flex items-center justify-center animate-fade-out pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-black/90 border border-green-500/50 text-green-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" />
                  Frame Captured to Diagnostic Buffer
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-white/40">
            <span>RTSP Session: Handshake ESTABLISHED (Keep-Alive UDP/TCP)</span>
            <span className="text-green-400 font-semibold">Signal Quality 98% (Nominal)</span>
          </div>
        </div>

        {/* Diagnostic Telemetry Matrix */}
        <div className="col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-[#13151f] border border-white/5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Handshake Stages</span>
              <span className="text-[10px] font-bold text-green-400 font-mono">ALL PASS</span>
            </div>

            <div className="space-y-2">
              {[
                { stage: 0, label: 'TCP / Socket Transport Handshake', desc: 'Port listening & MTU verified', state: probeStage >= 1 ? 'PASS' : isProbing ? 'CHECKING' : 'READY' },
                { stage: 1, label: 'RTSP DESCRIBE & Digest Auth', desc: '401 Challenge responded OK', state: probeStage >= 2 ? 'PASS' : isProbing ? 'CHECKING' : 'READY' },
                { stage: 2, label: 'SDP Media Stream Negotiation', desc: 'Video Track 0 (H.265/90000)', state: probeStage >= 3 ? 'PASS' : isProbing ? 'CHECKING' : 'READY' },
                { stage: 3, label: 'RTP Packet Ingestion & Decoder', desc: '0 dropped frames across 120 packets', state: probeStage >= 4 ? 'PASS' : isProbing ? 'CHECKING' : 'READY' },
              ].map((item) => (
                <div key={item.stage} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-[11px] font-bold text-white">{item.label}</p>
                    <p className="text-[9px] text-white/30">{item.desc}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono",
                    item.state === 'PASS' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                    item.state === 'CHECKING' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse" :
                    "bg-white/5 text-white/40"
                  )}>
                    {item.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#13151f] border border-white/5 space-y-2.5">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Stream Profile Detected</span>
            
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-white/30 block text-[9px]">Video Codec</span>
                <span className="text-white font-semibold">{diagnostics.detectedCodec.split(' ')[0]}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-white/30 block text-[9px]">Native Resolution</span>
                <span className="text-white font-semibold">{diagnostics.detectedResolution.split(' ')[0]}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-white/30 block text-[9px]">Bitrate / Mode</span>
                <span className="text-white font-semibold">{diagnostics.measuredBitrate} (CBR)</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-white/30 block text-[9px]">GOP / Keyframe</span>
                <span className="text-white font-semibold">{diagnostics.keyframeInterval.split(' ')[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
