import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { getStreamUrl, useCCTVStore } from '../services/cctv';
import { cn } from '../lib/utils';
import { Broadcast, Warning, ArrowsClockwise, Lightning, FilmReel, ArrowsOut } from '@phosphor-icons/react';

interface CCTVPlayerProps {
  cameraId: string;
  streamUrl?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  showOverlay?: boolean;
  preferredProtocol?: 'WHEP' | 'HLS';
}

export const CCTVPlayer: React.FC<CCTVPlayerProps> = ({
  cameraId,
  streamUrl: propStreamUrl,
  className,
  autoPlay = true,
  muted = true,
  showOverlay = true,
  preferredProtocol,
}) => {
  const globalStreamMode = useCCTVStore((s) => s.streamMode);
  const activeProtocol = preferredProtocol || globalStreamMode;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeEngine, setActiveEngine] = useState<'WHEP' | 'HLS'>(activeProtocol);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryTimeoutRef = useRef<any>(null);
  const watchdogIntervalRef = useRef<any>(null);
  const lastTimeRef = useRef<number>(0);
  const stallCounterRef = useRef<number>(0);

  const cleanId = cameraId.toLowerCase().replace(/[^a-z0-9]/g, '');

  const cleanupEngines = useCallback(() => {
    if (watchdogIntervalRef.current) {
      clearInterval(watchdogIntervalRef.current);
      watchdogIntervalRef.current = null;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (pcRef.current) {
      try {
        pcRef.current.close();
      } catch (e) {
        // Ignore cleanup errors
      }
      pcRef.current = null;
    }

    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch (e) {
        // Ignore cleanup errors
      }
      hlsRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute('src');
    }
  }, []);

  // 1. Initialize HLS Engine with Anti-Freeze Watchdog & Concurrency Tuning
  const startHlsEngine = useCallback(() => {
    cleanupEngines();
    setActiveEngine('HLS');
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setIsBuffering(true);
    lastTimeRef.current = 0;
    stallCounterRef.current = 0;

    const hlsUrl = getStreamUrl(cameraId, 'HLS', propStreamUrl);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,          // Retain recent segments to avoid black frame dropouts
        maxBufferLength: 20,          // Healthy 20s forward buffer for rock-solid continuous playback
        maxMaxBufferLength: 40,
        liveSyncDurationCount: 3,     // Stay ~18s safely behind live edge for 100% uninterrupted feeds
        maxBufferHole: 0.5,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 10,
        manifestLoadingRetryDelay: 1000,
        fragLoadingTimeOut: 25000,
        fragLoadingMaxRetry: 10,
        fragLoadingRetryDelay: 1000,
        nudgeOffset: 0.2,
        nudgeMaxRetry: 10,
        startLevel: -1,
      });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(hlsUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay && video) {
          video.play().catch(() => {});
        }
        setIsBuffering(false);
      });

      // Handle stream errors gracefully without freezing or showing black screen
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.details === 'bufferStalledError') {
          hls.startLoad();
          return;
        }

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              retryTimeoutRef.current = setTimeout(() => {
                setRetryCount(c => c + 1);
              }, 3000);
              break;
          }
        }
      });

      hls.attachMedia(video);
      hlsRef.current = hls;

      // Gentle Anti-Freeze Watchdog: only acts if frozen for > 6 seconds to prevent unnecessary restarts
      watchdogIntervalRef.current = setInterval(() => {
        if (!video) return;

        if (!video.paused && !video.ended && video.readyState >= 2) {
          const currentTime = video.currentTime;
          if (Math.abs(currentTime - lastTimeRef.current) < 0.05) {
            stallCounterRef.current++;
            if (stallCounterRef.current >= 3) {
              if (hlsRef.current) {
                hlsRef.current.startLoad();
              }
              if (video.buffered.length > 0) {
                const liveEdge = video.buffered.end(video.buffered.length - 1);
                video.currentTime = Math.max(0, liveEdge - 1.0);
              }
              video.play().catch(() => {});
              stallCounterRef.current = 0;
            }
          } else {
            stallCounterRef.current = 0;
            setIsBuffering(false);
          }
          lastTimeRef.current = currentTime;
        }
      }, 2000);

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS for Safari/iOS
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) video.play().catch(() => {});
        setIsBuffering(false);
      }, { once: true });
      video.addEventListener('error', () => {
        setError('Native HLS stream playback failed');
      }, { once: true });
    } else {
      setError('HLS playback is not supported by this browser');
    }
  }, [cameraId, propStreamUrl, autoPlay, cleanupEngines]);

  // 2. Initialize WebRTC (WHEP) Engine
  const startWhepEngine = useCallback(async () => {
    cleanupEngines();
    setActiveEngine('WHEP');
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setIsBuffering(true);

    const whepUrl = getStreamUrl(cameraId, 'WHEP', propStreamUrl);

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ],
        bundlePolicy: 'max-bundle'
      });

      pcRef.current = pc;

      pc.addTransceiver('video', { direction: 'recvonly' });

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setIsBuffering(false);
          if (autoPlay) {
            videoRef.current.play().catch(() => {});
          }
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          // Gracefully fallback to HLS without interrupting playback
          startHlsEngine();
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete or timeout (up to 800ms) so candidates are included in SDP
      if (pc.iceGatheringState !== 'complete') {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 800);
          const checkState = () => {
            if (pc.iceGatheringState === 'complete') {
              clearTimeout(timeout);
              pc.removeEventListener('icegatheringstatechange', checkState);
              resolve();
            }
          };
          pc.addEventListener('icegatheringstatechange', checkState);
        });
      }

      const sdpToSend = pc.localDescription?.sdp || offer.sdp;

      const res = await fetch(whepUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: sdpToSend,
      });

      if (!res.ok) {
        throw new Error(`WHEP status ${res.status}`);
      }

      const answerSdp = await res.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
    } catch (err: any) {
      // Seamlessly switch to high-stability HLS engine
      startHlsEngine();
    }
  }, [cameraId, propStreamUrl, autoPlay, cleanupEngines, startHlsEngine]);

  // Lifecycle with small startup stagger to avoid socket stampedes
  useEffect(() => {
    const camNum = parseInt(cleanId.replace(/\D/g, ''), 10) || 0;
    const staggerMs = (camNum % 6) * 120; // Stagger across 6 slots

    const timer = setTimeout(() => {
      if (activeProtocol === 'WHEP') {
        startWhepEngine();
      } else {
        startHlsEngine();
      }
    }, staggerMs);

    return () => {
      clearTimeout(timer);
      cleanupEngines();
    };
  }, [cameraId, activeProtocol, retryCount, startWhepEngine, startHlsEngine, cleanupEngines]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const toggleProtocol = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeEngine === 'WHEP') {
      startHlsEngine();
    } else {
      startWhepEngine();
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className={cn("relative bg-neutral-950 overflow-hidden group select-none", className)}>
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        autoPlay={autoPlay}
        preload="metadata"
        className="w-full h-full object-cover"
      />

      {/* Buffering State */}
      {isBuffering && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <ArrowsClockwise size={26} className="text-[var(--color-ember,#f97316)] animate-spin opacity-80" />
            <span className="text-[10px] font-mono font-bold text-white tracking-wider uppercase opacity-80">
              Live {activeEngine}
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-md z-20">
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <Warning size={20} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-bold text-white mb-0.5">Stream Signal Interrupted</p>
              <p className="text-[10px] text-white/50 font-mono leading-tight max-w-[220px] truncate">
                {error}
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              <button 
                onClick={handleRetry}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white uppercase tracking-wider transition-all"
              >
                Reconnect
              </button>
              <button 
                onClick={toggleProtocol}
                className="px-3 py-1.5 rounded bg-orange-500/20 hover:bg-orange-500/30 text-[10px] font-bold text-orange-400 uppercase tracking-wider transition-all border border-orange-500/30"
              >
                Switch to {activeEngine === 'WHEP' ? 'HLS' : 'WHEP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Overlay Top Left */}
      {showOverlay && !error && (
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 pointer-events-none z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
          <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">LIVE</span>
          <span className="text-[8px] font-mono px-1 rounded bg-white/10 text-white/70">
            {activeEngine}
          </span>
        </div>
      )}

      {/* Controls Overlay on Hover (Bottom) */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100 z-10">
        <div className="px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
          <Broadcast size={12} className="text-orange-500" />
          <span className="text-[9px] font-mono text-white/90 font-bold uppercase tracking-wider">
            {cleanId.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={toggleProtocol}
            title={`Current engine: ${activeEngine}. Click to switch.`}
            className="px-1.5 py-1 rounded bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[9px] font-mono text-white/80 hover:text-white flex items-center gap-1"
          >
            {activeEngine === 'WHEP' ? <Lightning size={10} className="text-amber-400" /> : <FilmReel size={10} className="text-blue-400" />}
            {activeEngine}
          </button>
          <button
            onClick={handleFullscreen}
            title="Fullscreen"
            className="p-1 rounded bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white/80 hover:text-white"
          >
            <ArrowsOut size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
