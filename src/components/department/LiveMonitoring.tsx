import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useEmberlyStore } from '../../store';
import { useCCTVStore } from '../../services/cctv';
import { CCTVPlayer } from '../CCTVPlayer';
import { CameraOnboardingModal } from './onboarding/CameraOnboardingModal';
import { 
  VideoCamera, 
  Pulse, 
  Warning, 
  CaretRight, 
  Selection,
  ArrowsInSimple,
  DotsThree,
  MagnifyingGlass,
  Plus,
  Lightning,
  FilmReel,
  SquaresFour,
  X
} from '@phosphor-icons/react';

export const LiveMonitoring: React.FC = () => {
  const { cameras: emberlyCameras, isOnboardingOpen, setIsOnboardingOpen } = useEmberlyStore();
  const { cameras: cctvCameras, isLoading, streamMode, setStreamMode } = useCCTVStore();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [gridLayout, setGridLayout] = useState<'2x2' | '3x3' | '4x4' | 'ALL'>('ALL');
  const [gridCams, setGridCams] = useState<string[]>([]);

  // Merged camera list
  const allCameras = useMemo(() => {
    const merged = [...cctvCameras];
    emberlyCameras.forEach(ec => {
      if (!merged.find(cc => cc.id === ec.id)) {
        merged.push(ec);
      }
    });
    return merged;
  }, [cctvCameras, emberlyCameras]);

  // Update visible cameras according to grid layout
  useEffect(() => {
    if (allCameras.length === 0) return;

    if (gridLayout === 'ALL') {
      setGridCams(allCameras.map(c => c.id));
    } else if (gridLayout === '2x2') {
      setGridCams(allCameras.slice(0, 4).map(c => c.id));
    } else if (gridLayout === '3x3') {
      setGridCams(allCameras.slice(0, 9).map(c => c.id));
    } else if (gridLayout === '4x4') {
      setGridCams(allCameras.slice(0, 16).map(c => c.id));
    }
  }, [allCameras, gridLayout]);

  const handleSwap = (cameraId: string) => {
    if (selectedSlot !== null) {
      const newGrid = [...gridCams];
      newGrid[selectedSlot] = cameraId;
      setGridCams(newGrid);
      setSelectedSlot(null);
    }
  };

  const displayCameras = gridCams.map(id => allCameras.find(c => c.id === id)).filter(Boolean) as any[];

  return (
    <div className="h-full flex flex-col space-y-[var(--sp-4)] pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-[20px] font-semibold text-[var(--color-ink)] tracking-tight">Live Monitoring Video Wall</h2>
          
          {/* Grid Layout Selector */}
          <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] p-1 text-[11px] font-mono">
            <button 
              onClick={() => setGridLayout('2x2')}
              className={cn("px-2.5 py-1 rounded transition-all", gridLayout === '2x2' ? "bg-white/10 text-white font-bold" : "text-[var(--color-ink-muted)] hover:text-white")}
            >
              2x2 (4)
            </button>
            <button 
              onClick={() => setGridLayout('3x3')}
              className={cn("px-2.5 py-1 rounded transition-all", gridLayout === '3x3' ? "bg-white/10 text-white font-bold" : "text-[var(--color-ink-muted)] hover:text-white")}
            >
              3x3 (9)
            </button>
            <button 
              onClick={() => setGridLayout('4x4')}
              className={cn("px-2.5 py-1 rounded transition-all", gridLayout === '4x4' ? "bg-white/10 text-white font-bold" : "text-[var(--color-ink-muted)] hover:text-white")}
            >
              4x4 (16)
            </button>
            <button 
              onClick={() => setGridLayout('ALL')}
              className={cn("px-3 py-1 rounded transition-all font-bold", gridLayout === 'ALL' ? "bg-[var(--color-ember,#f97316)] text-white shadow-sm" : "text-amber-400 hover:text-white")}
            >
              All 30 Feeds
            </button>
          </div>

          {/* Stream Mode Switcher */}
          <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] p-1 text-[11px] font-mono">
            <button
              onClick={() => setStreamMode('WHEP')}
              className={cn(
                "px-2.5 py-1 rounded flex items-center gap-1 transition-all",
                streamMode === 'WHEP' ? "bg-emerald-600 text-white font-bold" : "text-[var(--color-ink-muted)]"
              )}
            >
              <Lightning size={12} weight="fill" />
              WebRTC &lt;300ms
            </button>
            <button
              onClick={() => setStreamMode('HLS')}
              className={cn(
                "px-2.5 py-1 rounded flex items-center gap-1 transition-all",
                streamMode === 'HLS' ? "bg-blue-600 text-white font-bold" : "text-[var(--color-ink-muted)]"
              )}
            >
              <FilmReel size={12} weight="fill" />
              HLS
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="badge badge-accent px-3 py-1.5 font-mono text-[11px] font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {displayCameras.length} STREAMS LIVE
          </div>
          <button 
            onClick={() => setIsOnboardingOpen(true)}
            className="btn btn-ember py-1.5 px-3 text-xs"
          >
            <Plus size={16} weight="bold" />
            <span>Add Camera</span>
          </button>
        </div>
      </header>

      <CameraOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Grid container */}
      <div className="flex-1 overflow-y-auto min-h-[600px] p-3 bg-[var(--color-surface)] rounded-[var(--r-lg)] border border-[var(--color-hairline)] shadow-inner">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 py-24">
             <Pulse size={48} className="text-[var(--color-ember,#f97316)] animate-pulse" />
             <p className="eyebrow uppercase tracking-[0.2em] font-bold text-[12px] opacity-60">Synchronizing Statewide Grid...</p>
          </div>
        ) : displayCameras.length > 0 ? (
          <div className={cn(
            "grid gap-3",
            gridLayout === '2x2' && "grid-cols-1 md:grid-cols-2",
            gridLayout === '3x3' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            gridLayout === '4x4' && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
            gridLayout === 'ALL' && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          )}>
            {displayCameras.map((camera, index) => (
              <div 
                key={camera.id} 
                onClick={() => setSelectedSlot(index)}
                className="relative aspect-video rounded-[var(--r-md)] overflow-hidden group bg-black border border-[var(--color-hairline-strong)] hover:border-[var(--color-ember,#f97316)] transition-all shadow-md cursor-pointer"
              >
                <CCTVPlayer 
                  cameraId={camera.id} 
                  streamUrl={camera.streamUrl} 
                  preferredProtocol={streamMode}
                  className="w-full h-full" 
                  showOverlay={false}
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 p-2 flex flex-col justify-between pointer-events-none z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="badge badge-online text-[8px] font-mono font-bold py-0 px-1">
                        LIVE
                      </span>
                      <span className="text-[11px] font-bold text-white font-mono drop-shadow-md bg-black/60 px-1.5 py-0.5 rounded">
                        {camera.id.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-white/80 bg-black/60 px-1 rounded">
                      {streamMode}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-[9px] font-mono text-white/80 drop-shadow truncate max-w-[120px] bg-black/60 px-1 rounded">
                      {camera.name || camera.location}
                    </span>
                    <span className="text-[8px] font-mono text-emerald-400 drop-shadow bg-black/60 px-1 rounded">
                      30 FPS
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-12">
             <Warning size={48} className="text-[var(--color-ink-muted)] opacity-20" />
             <p className="text-[14px] font-bold text-[var(--color-ink)] tracking-tight">No active camera signals detected.</p>
             <p className="text-[12px] text-[var(--color-ink-secondary)] max-w-[300px] leading-relaxed">
               Please verify the Sentinel Camera Grid status or check your pipeline credentials.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};
