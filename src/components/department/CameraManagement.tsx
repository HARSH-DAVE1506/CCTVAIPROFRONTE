import React, { useState, useMemo } from 'react';
import { useEmberlyStore } from '../../store';
import { useCCTVStore } from '../../services/cctv';
import { CCTVPlayer } from '../CCTVPlayer';
import { CAMERA_GROUPS } from '../../data';
import { cn } from '../../lib/utils';
import { Camera } from '../../types';
import { CameraOnboardingModal } from './onboarding/CameraOnboardingModal';
import { CameraDetailModal } from './onboarding/CameraDetailModal';
import { 
  VideoCamera, 
  Plus, 
  MagnifyingGlass, 
  Funnel, 
  Pulse,
  Broadcast,
  CheckCircle,
  Warning,
  Eye,
  SlidersHorizontal,
  MapPin,
  Cpu,
  Cube,
  Tag
} from '@phosphor-icons/react';

export const CameraManagement: React.FC = () => {
  const { 
    cameras: emberlyCameras, 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    selectedCameraDetail, 
    setSelectedCameraDetail,
    discoveredDevices
  } = useEmberlyStore();

  const { cameras: cctvCameras } = useCCTVStore();

  // Merged camera list
  const cameras: Camera[] = useMemo(() => {
    const merged = [...cctvCameras];
    emberlyCameras.forEach(ec => {
      if (!merged.find(cc => cc.id === ec.id)) {
        merged.push(ec);
      }
    });
    return merged;
  }, [cctvCameras, emberlyCameras]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All Cameras');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const matchSearch = 
        cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cam.name && cam.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cam.ipAddress && cam.ipAddress.includes(searchQuery));

      const matchGroup = selectedGroup === 'All Cameras' || cam.group === selectedGroup;
      const matchStatus = selectedStatus === 'ALL' || cam.status === selectedStatus;

      return matchSearch && matchGroup && matchStatus;
    });
  }, [cameras, searchQuery, selectedGroup, selectedStatus]);

  const onlineCount = cameras.filter(c => c.status === 'ONLINE').length;
  const degradedCount = cameras.filter(c => c.status === 'DEGRADED').length;
  const offlineCount = cameras.filter(c => c.status === 'OFFLINE').length;

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Department Cameras</h2>
            <span className="badge badge-accent font-[var(--font-mono)] font-bold tracking-widest px-3 py-1.5 uppercase">
              {cameras.length} PROVISIONED
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Manage your department's CCTV surveillance inventory, RTSP pipelines, and AI edge bindings.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {discoveredDevices.length > 0 && (
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="badge badge-online px-4 py-2 font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm animate-pulse cursor-pointer hover:shadow-md transition-all"
            >
              <Broadcast size={18} weight="fill" />
              <span>{discoveredDevices.length} Signals discovered</span>
            </button>
          )}

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="btn btn-ember h-11"
          >
            <Plus weight="bold" size={18} />
            <span>Onboard camera</span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-[var(--sp-4)]">
        {[
          { label: 'Total Cameras', value: cameras.length, color: 'text-[var(--color-ink)]', icon: VideoCamera, iconColor: 'text-[var(--color-ink-muted)]' },
          { label: 'Active Streams', value: onlineCount, color: 'text-[var(--color-online)]', icon: CheckCircle, iconColor: 'text-[var(--color-online)]', bg: 'bg-[color-mix(in_srgb,var(--color-online)_10%,transparent)] border-[var(--color-online)]/20' },
          { label: 'Degraded Signal', value: degradedCount, color: 'text-[var(--color-accent)]', icon: Warning, iconColor: 'text-[var(--color-accent)]', bg: 'bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] border-[var(--color-accent)]/20' },
          { label: 'Offline / Warning', value: offlineCount, color: 'text-[var(--color-ember)]', icon: Warning, iconColor: 'text-[var(--color-ember)]', bg: 'bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] border-[var(--color-ember)]/20' },
        ].map((stat, i) => (
          <div key={i} className={cn("panel p-[var(--sp-5)] flex items-center justify-between shadow-sm", stat.bg)}>
            <div>
              <span className="eyebrow uppercase tracking-[0.2em] font-bold text-[10px] opacity-70 block mb-1">{stat.label}</span>
              <span className={cn("text-[28px] font-bold tracking-tight font-[var(--font-mono)]", stat.color)}>{stat.value}</span>
            </div>
            <div className={cn("w-12 h-12 rounded-[var(--r-md)] bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-hairline)] shadow-sm", stat.iconColor)}>
              <stat.icon size={24} weight="fill" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="panel bg-[var(--color-surface-raised)] p-[var(--sp-4)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border-[var(--color-hairline-strong)]">
        <div className="flex-1 w-full relative group">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-lg group-focus-within:text-[var(--color-ember)] transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, location, or IP address..."
            className="w-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] py-2.5 pl-12 pr-4 text-[13px] font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-[var(--color-surface)] p-1 rounded-[var(--r-md)] border border-[var(--color-hairline)] shadow-sm">
            {(['ALL', 'ONLINE', 'DEGRADED', 'OFFLINE']).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={cn(
                  "px-4 py-1.5 rounded-[var(--r-sm)] text-[11px] font-bold transition-all uppercase tracking-wider",
                  selectedStatus === st ? "bg-[var(--color-ember)] text-white shadow-md" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                )}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[12px] font-bold text-[var(--color-ink)] rounded-[var(--r-md)] px-4 py-2.5 focus:outline-none focus:border-[var(--color-ember)] shadow-sm cursor-pointer uppercase tracking-wider"
          >
            {CAMERA_GROUPS.map((grp) => (
              <option key={grp} value={grp}>{grp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-3 gap-[var(--sp-6)]">
        {filteredCameras.map((camera) => (
          <div 
            key={camera.id} 
            className="panel bg-[var(--color-surface-raised)] p-0 flex flex-col group hover:shadow-xl transition-all border-[var(--color-hairline-strong)] overflow-hidden shadow-md"
          >
            {/* Top Row: Camera Info */}
            <div className="p-[var(--sp-5)] space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-11 h-11 rounded-[var(--r-md)] flex items-center justify-center border transition-all shrink-0 shadow-sm",
                    camera.status === 'ONLINE' ? "bg-[color-mix(in_srgb,var(--color-online)_10%,transparent)] border-[var(--color-online)]/20 text-[var(--color-online)]" :
                    camera.status === 'DEGRADED' ? "bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] border-[var(--color-accent)]/20 text-[var(--color-accent)]" :
                    "bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] border-[var(--color-ember)]/20 text-[var(--color-ember)]"
                  )}>
                    <VideoCamera size={22} weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-[var(--color-ink)] truncate group-hover:text-[var(--color-ember)] transition-colors tracking-tight">
                      {camera.name || camera.id}
                    </h4>
                    <p className="text-[11px] text-[var(--color-ink-muted)] font-bold truncate flex items-center gap-1.5 mt-1 uppercase tracking-wider">
                      <MapPin size={12} className="text-[var(--color-ember)]" weight="bold" />
                      {camera.location}
                    </p>
                  </div>
                </div>

                <div className={cn(
                  "badge font-[var(--font-mono)] font-bold text-[9px] uppercase tracking-widest",
                  camera.status === 'ONLINE' ? "badge-online" :
                  camera.status === 'DEGRADED' ? "bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] text-[var(--color-accent)] border border-[var(--color-accent)]/20" :
                  "badge-accent"
                )}>
                  {camera.status}
                </div>
              </div>

              {/* Feed Snapshot Thumbnail */}
              <div 
                onClick={() => setSelectedCameraDetail(camera as any)}
                className="relative aspect-video rounded-[var(--r-md)] overflow-hidden bg-black border border-[var(--color-hairline-strong)] cursor-pointer group/thumb shadow-inner"
              >
                <CCTVPlayer cameraId={camera.id} streamUrl={camera.streamUrl} className="w-full h-full" showOverlay={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-[var(--sp-3)]">
                    <span className="text-[10px] font-[var(--font-mono)] text-white/90 font-bold bg-black/40 px-1.5 py-0.5 rounded-[var(--r-sm)]">{camera.resolution}</span>
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-ember)] font-bold bg-black/40 px-1.5 py-0.5 rounded-[var(--r-sm)]">{camera.fps || 30} FPS</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all bg-black/20 backdrop-blur-[1px]">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl">
                      <Eye size={20} weight="bold" className="text-black" />
                    </div>
                  </div>
                </div>
              <div className="space-y-1 text-[11px] font-medium">
                <div className="flex items-center justify-between py-2 border-b border-[var(--color-hairline)]">
                  <span className="text-[var(--color-ink-muted)] uppercase tracking-wider text-[9px]">Protocol / Codec</span>
                  <span className="text-[var(--color-ink)] font-[var(--font-mono)] font-bold">{camera.protocol || 'RTSP'} | {camera.codec?.split(' ')[0] || 'H.264'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--color-hairline)]">
                  <span className="text-[var(--color-ink-muted)] uppercase tracking-wider text-[9px]">Zone Group</span>
                  <span className="text-[var(--color-ink)] font-bold uppercase tracking-tight truncate max-w-[150px]">{camera.group || 'Surveillance'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[var(--color-ink-muted)] uppercase tracking-wider text-[9px]">Active AI capabilities</span>
                  <div className="flex items-center gap-2">
                    {camera.aiModels.length > 0 ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[var(--color-ember)] shadow-[0_0_8px_var(--color-ember)]" />
                        <span className="text-[var(--color-ember)] font-bold font-[var(--font-mono)] uppercase">{camera.aiModels.length} models active</span>
                      </>
                    ) : (
                      <span className="text-[var(--color-ink-muted)] font-bold uppercase opacity-40">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-px bg-[var(--color-hairline-strong)] mt-auto border-t border-[var(--color-hairline-strong)]">
              <button 
                onClick={() => setSelectedCameraDetail(camera)}
                className="py-4 bg-[var(--color-surface)] hover:bg-[color-mix(in_srgb,var(--color-ember)_5%,var(--color-surface))] hover:text-[var(--color-ember)] text-[11px] font-bold text-[var(--color-ink-muted)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <Eye size={16} weight="bold" />
                <span>Open feed</span>
              </button>
              <button 
                onClick={() => setSelectedCameraDetail(camera)}
                className="py-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)] text-[11px] font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <SlidersHorizontal size={16} weight="bold" />
                <span>Config</span>
              </button>
            </div>
          </div>
        ))}
        
        {/* Add Camera Card */}
        <div 
          onClick={() => setIsOnboardingOpen(true)}
          className="panel bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-hairline-strong)] p-10 flex flex-col items-center justify-center group hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-ember)]/40 cursor-pointer transition-all min-h-[350px] space-y-6 shadow-sm hover:shadow-xl"
        >
          <div className="w-16 h-16 rounded-[var(--r-lg)] bg-[var(--color-surface-raised)] flex items-center justify-center text-[var(--color-ink-muted)] group-hover:text-[var(--color-ember)] group-hover:bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] group-hover:scale-110 transition-all border border-[var(--color-hairline)] group-hover:border-[var(--color-ember)]/30 shadow-sm">
            <Plus size={32} weight="bold" />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-bold text-[var(--color-ink)] group-hover:text-[var(--color-ember)] transition-colors tracking-tight">Onboard New Camera</p>
            <p className="text-[12px] text-[var(--color-ink-muted)] mt-2 font-medium max-w-[200px] leading-relaxed uppercase tracking-widest opacity-60">Discover ONVIF subnet or configure RTSP pipeline</p>
          </div>
        </div>
      </div>

      {/* CCTV Onboarding Wizard Modal */}
      <CameraOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Camera Detail & Diagnostics Drawer/Modal */}
      <CameraDetailModal
        camera={selectedCameraDetail}
        onClose={() => setSelectedCameraDetail(null)}
      />
    </div>
  );
};

