import React, { useState, useMemo } from 'react';
import { useEmberlyStore } from '../../store';
import { useCCTVStore } from '../../services/cctv';
import { CCTVPlayer } from '../CCTVPlayer';
import { Camera } from '../../types';
import { cn } from '../../lib/utils';
import { MapView } from '../map/MapView';
import { 
  MagnifyingGlass, 
  VideoCamera, 
  ShieldCheck, 
  Pulse, 
  Eye, 
  SquaresFour, 
  MapTrifold, 
  SlidersHorizontal,
  X,
  LockKey,
  CheckCircle,
  Warning,
  Broadcast,
  ArrowsClockwise,
  Cube,
  Buildings,
  MapPin,
  CircleNotch,
  ArrowSquareOut,
  Lightning,
  FilmReel,
  Rows,
  GridFour
} from '@phosphor-icons/react';

export const StateCameraGrid: React.FC = () => {
  const { cameras: emberlyCameras } = useEmberlyStore();
  const { cameras: cctvCameras, isLoading, streamMode, setStreamMode, fetchCameras } = useCCTVStore();

  const displayCameras: Camera[] = useMemo(() => {
    // Merge CCTV cameras with manually added ones, avoiding duplicates by ID
    const merged = [...cctvCameras];
    emberlyCameras.forEach(ec => {
      if (!merged.find(cc => cc.id === ec.id)) {
        merged.push(ec);
      }
    });
    return merged;
  }, [cctvCameras, emberlyCameras]);

  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');
  const [gridColumns, setGridColumns] = useState<number>(3); // 2, 3, 4, or 6
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedProtocol, setSelectedProtocol] = useState('ALL');
  const [selectedAI, setSelectedAI] = useState('ALL');
  const [inspectCamera, setInspectCamera] = useState<Camera | null>(null);

  // Departments list
  const departments = ['ALL', 'Police', 'GSRTC', 'Municipal Corporation', 'Health', 'Panchayat'];
  const protocols = ['ALL', 'WebRTC', 'HLS', 'RTSP'];
  const aiModels = ['ALL', 'Vehicle Tracking', 'Weapon & Threat', 'Plate OCR', 'Object Detection'];

  // Filter cameras
  const filteredCameras = displayCameras.filter(cam => {
    if (selectedDept !== 'ALL' && cam.department !== selectedDept) return false;
    if (selectedStatus !== 'ALL' && cam.status !== selectedStatus) return false;
    if (selectedProtocol !== 'ALL' && cam.protocol !== selectedProtocol && streamMode !== selectedProtocol) return false;
    if (selectedAI !== 'ALL' && !cam.aiModels.some(m => m.toLowerCase().includes(selectedAI.toLowerCase()))) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = cam.id.toLowerCase().includes(q);
      const matchLoc = (cam.location || '').toLowerCase().includes(q);
      const matchDept = (cam.department || '').toLowerCase().includes(q);
      if (!matchId && !matchLoc && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1700px] mx-auto pb-16">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">State Camera Grid</h2>
            <span className="badge badge-accent font-[var(--font-mono)] flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SENTINEL LIVE GRID ({filteredCameras.length} CHANNELS)
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Synchronized live surveillance wall with zero-delay WebRTC streaming and HLS auto-fallback across all state cameras.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Stream Protocol Switcher */}
          <div className="flex items-center bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] p-1 text-[11px] font-mono">
            <button
              onClick={() => setStreamMode('WHEP')}
              className={cn(
                "px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-all",
                streamMode === 'WHEP' 
                  ? "bg-[var(--color-ember,#f97316)] text-white font-bold shadow-sm" 
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              <Lightning size={14} weight="fill" />
              <span>WebRTC (Real-Time &lt;300ms)</span>
            </button>
            <button
              onClick={() => setStreamMode('HLS')}
              className={cn(
                "px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-all",
                streamMode === 'HLS' 
                  ? "bg-[var(--color-ember,#f97316)] text-white font-bold shadow-sm" 
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              <FilmReel size={14} weight="fill" />
              <span>HLS (CDN Stream)</span>
            </button>
          </div>

          {/* Grid Layout Density */}
          {viewMode === 'GRID' && (
            <div className="flex items-center bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] p-1 text-[11px] font-mono">
              <button
                onClick={() => setGridColumns(2)}
                title="2-Column Large Display"
                className={cn("px-2 py-1 rounded transition-all", gridColumns === 2 ? "bg-white/10 text-white font-bold" : "text-[var(--color-ink-muted)]")}
              >
                2 Col
              </button>
              <button
                onClick={() => setGridColumns(3)}
                title="3-Column Standard Display"
                className={cn("px-2 py-1 rounded transition-all", gridColumns === 3 ? "bg-white/10 text-white font-bold" : "text-[var(--color-ink-muted)]")}
              >
                3 Col
              </button>
              <button
                onClick={() => setGridColumns(4)}
                title="4-Column Compact Display"
                className={cn("px-2 py-1 rounded transition-all", gridColumns === 4 ? "bg-white/10 text-white font-bold" : "text-[var(--color-ink-muted)]")}
              >
                4 Col
              </button>
              <button
                onClick={() => setGridColumns(6)}
                title="6-Column Full 30-Camera Video Wall"
                className={cn("px-2 py-1 rounded transition-all", gridColumns === 6 ? "bg-white/10 text-white font-bold text-amber-400" : "text-[var(--color-ink-muted)]")}
              >
                30-Wall
              </button>
            </div>
          )}

          {/* Refresh Feeds */}
          <button
            onClick={() => fetchCameras()}
            disabled={isLoading}
            className="p-2 rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-all"
            title="Refresh Camera Catalogue"
          >
            <ArrowsClockwise size={16} className={cn(isLoading && "animate-spin text-orange-500")} />
          </button>

          {/* View Mode Toggle */}
          <div className="segmented">
            <button
              onClick={() => setViewMode('GRID')}
              className={cn(viewMode === 'GRID' && "active")}
            >
              <SquaresFour size={16} weight="bold" />
              <span>Grid wall</span>
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={cn(viewMode === 'MAP' && "active")}
            >
              <MapTrifold size={16} weight="bold" />
              <span>Spatial map</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="panel p-[var(--sp-4)] space-y-[var(--sp-3)]">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <MagnifyingGlass className="absolute left-[var(--sp-4)] top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-lg group-focus-within:text-[var(--color-ember)] transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search camera by ID (cam01 - cam30), location, or department..."
              className="w-full bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--r-md)] py-2 pl-11 pr-[var(--sp-4)] text-[13px] focus:outline-none focus:border-[var(--color-ember)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-[var(--sp-4)] top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 px-[var(--sp-4)] py-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)]">
            <div className="flex flex-col">
              <span className="eyebrow uppercase text-[9px]">Active Feeds</span>
              <span className="text-[13px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{filteredCameras.length} / 30</span>
            </div>
            <div className="h-5 w-px bg-[var(--color-hairline)]" />
            <div className="flex flex-col">
              <span className="eyebrow uppercase text-[9px] !text-emerald-400">Real-Time Sync</span>
              <span className="text-[13px] font-semibold text-emerald-400 font-[var(--font-mono)] flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                100%
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-4 gap-[var(--sp-3)] pt-[var(--sp-3)] border-t border-[var(--color-hairline)]">
          {/* Department Filter */}
          <div className="space-y-1">
            <label className="eyebrow uppercase text-[9px] block">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-2.5 py-1 text-[12px] font-semibold text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] cursor-pointer"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="eyebrow uppercase text-[9px] block">Health status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-2.5 py-1 text-[12px] font-semibold text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] cursor-pointer"
            >
              <option value="ALL">All statuses (Online + Active)</option>
              <option value="ONLINE">ONLINE only</option>
              <option value="OFFLINE">OFFLINE only</option>
            </select>
          </div>

          {/* Protocol Filter */}
          <div className="space-y-1">
            <label className="eyebrow uppercase text-[9px] block">Transmission Protocol</label>
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-2.5 py-1 text-[12px] font-semibold text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] cursor-pointer"
            >
              {protocols.map(p => (
                <option key={p} value={p}>
                  {p === 'ALL' ? `Current Engine (${streamMode})` : p}
                </option>
              ))}
            </select>
          </div>

          {/* AI Capability Filter */}
          <div className="space-y-1">
            <label className="eyebrow uppercase text-[9px] block">AI capability</label>
            <select
              value={selectedAI}
              onChange={(e) => setSelectedAI(e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-2.5 py-1 text-[12px] font-semibold text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] cursor-pointer"
            >
              {aiModels.map(ai => (
                <option key={ai} value={ai}>
                  {ai === 'ALL' ? 'All AI capabilities' : ai}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main View: GRID or MAP */}
      {viewMode === 'GRID' ? (
        <div className={cn(
          "grid gap-[var(--sp-4)]",
          gridColumns === 2 && "grid-cols-1 md:grid-cols-2",
          gridColumns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          gridColumns === 4 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          gridColumns === 6 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        )}>
          {filteredCameras.map((cam) => (
            <div
              key={cam.id}
              onClick={() => setInspectCamera(cam)}
              className="panel group flex flex-col hover:border-[var(--color-hairline-strong)] transition-all cursor-pointer overflow-hidden shadow-sm"
            >
              {/* Thumbnail with Overlays */}
              <div className="relative aspect-video bg-black overflow-hidden border-b border-[var(--color-hairline)]">
                <CCTVPlayer 
                  cameraId={cam.id} 
                  streamUrl={cam.streamUrl} 
                  preferredProtocol={streamMode}
                  className="w-full h-full" 
                  showOverlay={false} 
                />

                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                  <span className="badge bg-black/70 backdrop-blur-sm border-white/20 text-[var(--color-ember,#f97316)] font-[var(--font-mono)] font-bold text-[10px]">
                    {cam.id.toUpperCase()}
                  </span>
                  {gridColumns < 6 && (
                    <span className="badge bg-[var(--color-surface-raised)] border-[var(--color-hairline)] text-[var(--color-ink-secondary)] text-[10px]">
                      {cam.department || 'Surveillance'}
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <span className="badge badge-online text-[9px] font-mono font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-online)] animate-pulse" />
                    ONLINE
                  </span>
                </div>

                {gridColumns < 6 && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-[var(--font-mono)] text-white/80 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 z-10">
                    <span className="truncate max-w-[130px]">{cam.location || cam.id}</span>
                    <span className="text-amber-400 font-bold">{streamMode}</span>
                  </div>
                )}
              </div>

              {/* Card Body - shown when not in high-density 6-col mode */}
              {gridColumns < 6 && (
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[13px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-ember)] transition-colors line-clamp-1">
                      {cam.name || cam.location}
                    </h4>
                    <p className="text-[10px] text-[var(--color-ink-muted)] mt-0.5 font-[var(--font-mono)]">
                      Endpoint: {streamMode === 'WHEP' ? 'WebRTC Gateway (103.250.160.189:8889)' : 'CDN HLS (cctv.corp8.cloud)'}
                    </p>
                  </div>

                  {/* AI Models Assigned */}
                  {gridColumns <= 3 && (
                    <div className="space-y-1 pt-2 border-t border-[var(--color-hairline)]">
                      <span className="eyebrow text-[9px] block">Active AI models</span>
                      <div className="flex flex-wrap gap-1">
                        {cam.aiModels && cam.aiModels.length > 0 ? (
                          cam.aiModels.map(model => (
                            <span
                              key={model}
                              className="badge badge-accent bg-[var(--color-surface-raised)] !text-[9px] flex items-center gap-1"
                            >
                              <Cube size={10} weight="fill" />
                              {model}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[var(--color-ink-muted)] italic">No AI deployed</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Health Bar & Inspect */}
                  <div className="pt-2 border-t border-[var(--color-hairline)] flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 mr-3">
                      <span className="eyebrow text-[9px]">Latency</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {streamMode === 'WHEP' ? '~220ms' : '~2.1s'}
                      </span>
                    </div>

                    <button className="text-[11px] font-bold text-[var(--color-ember)] flex items-center gap-1 group-hover:underline">
                      <span>Inspect</span>
                      <ArrowSquareOut size={12} weight="bold" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Spatial Map View */
        <div className="panel p-[var(--sp-5)] space-y-[var(--sp-4)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="panel-title uppercase">Statewide Geospatial Distribution</h3>
              <p className="text-[12px] text-[var(--color-ink-secondary)]">All 30 active Sentinel camera locations plotted across Gujarat.</p>
            </div>
            <div className="badge badge-accent font-mono">
              30 NODES ACTIVE
            </div>
          </div>
          <div className="h-[650px] rounded-[var(--r-md)] overflow-hidden border border-[var(--color-hairline)]">
            <MapView 
              cameras={filteredCameras} 
              onSelectCamera={(cam) => setInspectCamera(cam)} 
            />
          </div>
        </div>
      )}

      {/* Camera Inspection Modal */}
      {inspectCamera && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setInspectCamera(null)}
        >
          <div 
            className="bg-[#0e1017] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                  <VideoCamera size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    {inspectCamera.id.toUpperCase()} - {inspectCamera.name || inspectCamera.location}
                  </h3>
                  <p className="text-xs text-white/50 font-mono">
                    Department: {inspectCamera.department} · IP: {inspectCamera.ipAddress || '103.250.160.189'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="badge badge-online text-xs font-mono">ONLINE</span>
                <button 
                  onClick={() => setInspectCamera(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Full Featured Player */}
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg">
                <CCTVPlayer 
                  cameraId={inspectCamera.id} 
                  streamUrl={inspectCamera.streamUrl} 
                  preferredProtocol={streamMode}
                  className="w-full h-full" 
                  showOverlay={true}
                />
              </div>

              {/* Stream Parameters and AI Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 font-mono">
                  <span className="eyebrow text-white/40 block uppercase">Stream Pipeline</span>
                  <div className="space-y-1 text-xs">
                    <p className="text-white/70 flex justify-between">
                      <span>Protocol:</span>
                      <span className="text-amber-400 font-bold">{streamMode}</span>
                    </p>
                    <p className="text-white/70 flex justify-between">
                      <span>Codec:</span>
                      <span className="text-white">H.264 / AAC</span>
                    </p>
                    <p className="text-white/70 flex justify-between">
                      <span>Resolution:</span>
                      <span className="text-white">1920x1080 @ 30fps</span>
                    </p>
                    <p className="text-white/70 flex justify-between">
                      <span>Bitrate:</span>
                      <span className="text-white">4.5 Mbps</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 font-mono">
                  <span className="eyebrow text-white/40 block uppercase">Active AI Detectors</span>
                  <div className="space-y-1 text-xs">
                    <p className="text-white/70 flex justify-between">
                      <span>Model 1:</span>
                      <span className="text-emerald-400">Cross-Cam Tracking</span>
                    </p>
                    <p className="text-white/70 flex justify-between">
                      <span>Model 2:</span>
                      <span className="text-emerald-400">Abandoned Objects</span>
                    </p>
                    <p className="text-white/70 flex justify-between">
                      <span>Model 3:</span>
                      <span className="text-emerald-400">Weapon &amp; Threat</span>
                    </p>
                    <p className="text-white/70 flex justify-between">
                      <span>Model 4:</span>
                      <span className="text-emerald-400">Plate OCR &amp; Mismatch</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 font-mono">
                  <span className="eyebrow text-white/40 block uppercase">Endpoints</span>
                  <div className="space-y-1.5 text-[10px]">
                    <div>
                      <span className="text-white/40 block">WHEP WebRTC:</span>
                      <span className="text-white/80 break-all select-all">http://103.250.160.189:8889/stream/{inspectCamera.id}/whep</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">HLS CDN:</span>
                      <span className="text-white/80 break-all select-all">https://cctv.corp8.cloud/{inspectCamera.id}/index.m3u8</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">RTSP Inference:</span>
                      <span className="text-white/80 break-all select-all">rtsp://103.250.160.189:8554/stream/{inspectCamera.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
