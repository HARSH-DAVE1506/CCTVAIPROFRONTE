import React, { useState } from 'react';
import { MapView } from '../map/MapView';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  GUJARAT_DISTRICTS, 
  LIVE_STATE_INTELLIGENCE, 
  STATE_OVERVIEW_METRICS,
  STATE_DEPARTMENTS
} from '../../stateData';
import { useCCTVStore } from '../../services/cctv';
import { CCTVPlayer } from '../CCTVPlayer';
import { DistrictRegion, StateAlertEvent } from '../../types';
import { cn } from '../../lib/utils';
import { 
  ShieldCheck, 
  VideoCamera, 
  Warning, 
  Cube, 
  Buildings, 
  Pulse, 
  ArrowLeft, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ArrowsClockwise,
  Eye,
  MagnifyingGlass,
  SlidersHorizontal,
  X,
  FileText,
  LockKey
} from '@phosphor-icons/react';

export const CentralCommand: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRegion | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<StateAlertEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  const filteredAlerts = LIVE_STATE_INTELLIGENCE.filter(alert => {
    if (activeFilter === 'CRITICAL') return alert.severity === 'CRITICAL';
    if (activeFilter === 'HIGH') return alert.severity === 'HIGH';
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">State Command Center</h2>
            <span className="badge badge-accent uppercase font-mono text-[10px]">
              CAKSHAM AI · COMMAND
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            <span className="font-semibold text-[var(--color-ink)]">Caksham AI</span>: <span className="italic text-[var(--color-ink-muted)]">"Vision That Understands Too"</span> · Unified Situational Awareness · <span className="text-[var(--color-ink)]">Gujarat State Command Grid</span> · <code className="text-[var(--color-ember)] font-semibold">LIVE IST</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="badge badge-online">
            <span className="badge-dot" />
            All systems operational
          </div>
          <div className="px-[var(--sp-3)] py-[var(--sp-2)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] text-[11px] font-[var(--font-mono)] text-[var(--color-ink-secondary)]">
            Audit Synchronized · 33 Districts Active
          </div>
        </div>
      </header>

      {/* Opening Screen Metrics: 3 Primary State Blocks */}
      <div className="grid grid-cols-3 gap-[var(--sp-4)]">
        {/* BLOCK 1: CAMERAS */}
        <div className="panel">
          <div className="panel-header">
            <div className="flex items-center gap-2.5">
              <VideoCamera size={16} weight="fill" className="text-[var(--color-ink-muted)]" />
              <span className="eyebrow">Statewide cameras</span>
            </div>
            <span className="text-[18px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
              {STATE_OVERVIEW_METRICS.cameras.total.toLocaleString()}
            </span>
          </div>
          <div className="panel-body grid grid-cols-3 gap-[var(--sp-3)] !pt-4">
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-online mb-2">Online</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.cameras.online.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">90.5% uptime</span>
            </div>
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-high mb-2">Degraded</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.cameras.degraded.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Jitter / Frame drop</span>
            </div>
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-offline mb-2">Offline</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.cameras.offline.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Network severed</span>
            </div>
          </div>
        </div>

        {/* BLOCK 2: AI DEPLOYMENTS */}
        <div className="panel">
          <div className="panel-header">
            <div className="flex items-center gap-2.5">
              <Cube size={16} weight="fill" className="text-[var(--color-ink-muted)]" />
              <span className="eyebrow">AI deployments</span>
            </div>
            <span className="text-[18px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
              {STATE_OVERVIEW_METRICS.aiDeployments.total.toLocaleString()}
            </span>
          </div>
          <div className="panel-body grid grid-cols-3 gap-[var(--sp-3)] !pt-4">
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-accent mb-2">Active</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.aiDeployments.active.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Edge / GPU cluster</span>
            </div>
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-high mb-2">Degraded</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.aiDeployments.degraded.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Inference throttled</span>
            </div>
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-critical mb-2">Failed</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.aiDeployments.failed.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Container crash</span>
            </div>
          </div>
        </div>

        {/* BLOCK 3: INTELLIGENCE */}
        <div className="panel">
          <div className="panel-header">
            <div className="flex items-center gap-2.5">
              <Pulse size={16} weight="bold" className="text-[var(--color-ink-muted)]" />
              <span className="eyebrow">State intelligence</span>
            </div>
            <span className="text-[18px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">
              {STATE_OVERVIEW_METRICS.intelligence.eventsToday.toLocaleString()}
            </span>
          </div>
          <div className="panel-body grid grid-cols-3 gap-[var(--sp-3)] !pt-4">
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-neutral mb-2">Total alerts</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.intelligence.alerts.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Processed 24h</span>
            </div>
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-high mb-2">High priority</span>
              <div className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.intelligence.high}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Requires review</span>
            </div>
            <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
              <span className="badge badge-critical mb-2">Critical</span>
              <div className="text-[16px] font-semibold text-[var(--color-critical)] font-[var(--font-mono)]">
                {STATE_OVERVIEW_METRICS.intelligence.critical}
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Live intervention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Central Section: Gujarat State Map & Live Intelligence Feed */}
      <div className="grid grid-cols-12 gap-[var(--sp-4)]">
        
        {/* Left Column: Interactive Gujarat Map with Region Drill-Down */}
        <div className="col-span-7 panel flex flex-col justify-between overflow-hidden">
          <div>
            <div className="panel-header border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-ember)]" />
                <h3 className="panel-title uppercase">
                  {selectedDistrict ? `Region focus: ${selectedDistrict.name} District` : 'Gujarat statewide observation grid'}
                </h3>
              </div>

              {selectedDistrict ? (
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="btn btn-secondary btn-sm"
                >
                  <ArrowLeft size={14} weight="bold" />
                  <span>Back to statewide view</span>
                </button>
              ) : (
                <span className="panel-meta font-[var(--font-mono)]">
                  Click any district node to drill down
                </span>
              )}
            </div>

            {/* If a district is clicked: Drill-down Regional Dashboard */}
            {selectedDistrict ? (
              <div className="panel-body space-y-[var(--sp-5)] animate-fade-in">
                <div className="p-[var(--sp-4)] rounded-[var(--r-lg)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] flex items-center justify-between">
                  <div>
                    <span className="eyebrow">Jurisdiction</span>
                    <h4 className="text-[16px] font-semibold text-[var(--color-ink)] mt-1">{selectedDistrict.name} · {selectedDistrict.hindiName}</h4>
                    <p className="text-[11px] text-[var(--color-ink-muted)] mt-1 font-[var(--font-mono)]">
                      Coordinates: {selectedDistrict.coordinates.lat}° N, {selectedDistrict.coordinates.lng}° E
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-online">
                      {selectedDistrict.health}% Operational health
                    </span>
                    <p className="text-[11px] text-[var(--color-ink-muted)] mt-1">{selectedDistrict.activeIncidents} Active incidents</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-[var(--sp-3)]">
                  <div className="p-[var(--sp-4)] rounded-[var(--r-lg)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
                    <span className="eyebrow block mb-2">Cameras</span>
                    <span className="text-[20px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{selectedDistrict.cameras.toLocaleString()}</span>
                    <span className="text-[10px] text-[var(--color-online)] block mt-1">{selectedDistrict.online.toLocaleString()} Online</span>
                  </div>
                  <div className="p-[var(--sp-4)] rounded-[var(--r-lg)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
                    <span className="eyebrow block mb-2">Active alerts</span>
                    <span className="text-[20px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{selectedDistrict.alerts}</span>
                    <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Processed 24h</span>
                  </div>
                  <div className="p-[var(--sp-4)] rounded-[var(--r-lg)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)]">
                    <span className="eyebrow block mb-2">AI deployments</span>
                    <span className="text-[20px] font-semibold text-[var(--color-accent)] font-[var(--font-mono)]">{selectedDistrict.aiDeployments}</span>
                    <span className="text-[10px] text-[var(--color-ink-muted)] block mt-1">Active Models</span>
                  </div>
                </div>

                <div className="p-[var(--sp-4)] rounded-[var(--r-lg)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] space-y-3">
                  <span className="eyebrow block uppercase">
                    Participating department nodes in {selectedDistrict.name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDistrict.departmentsActive.map((dept) => (
                      <span
                        key={dept}
                        className="px-[var(--sp-3)] py-[var(--sp-1)] rounded-[var(--r-sm)] bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[11px] font-semibold text-[var(--color-ink-secondary)] flex items-center gap-2"
                      >
                        <Buildings size={14} className="text-[var(--color-ember)]" />
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Gujarat Geographic State Map Canvas with Nodes */
              <div className="panel-body h-[400px] p-0">
                <MapView 
                  center={[72.5, 22.5]} // Center of Gujarat roughly
                  zoom={6.5}
                  markers={GUJARAT_DISTRICTS.map(district => ({
                    id: district.id,
                    lng: district.coordinates.lng,
                    lat: district.coordinates.lat,
                    title: district.name,
                    color: 'var(--color-ember)'
                  }))}
                  onMarkerClick={(m) => {
                    const dist = GUJARAT_DISTRICTS.find(d => d.id === m.id);
                    if (dist) setSelectedDistrict(dist);
                  }}
                  className="rounded-[var(--r-lg)]"
                />
              </div>
            )}
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="px-[var(--sp-5)] py-[var(--sp-4)] border-t border-[var(--color-hairline)] flex items-center justify-between text-[11px] text-[var(--color-ink-muted)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-[var(--color-online)]" />
              Statewide ingestion latency: <strong className="text-[var(--color-ink)] font-[var(--font-mono)]">38ms</strong>
            </span>
            <span className="font-[var(--font-mono)]">
              Active districts: <strong>33 / 33</strong>
            </span>
          </div>
        </div>

        {/* Right Column: LIVE STATE INTELLIGENCE FEED */}
        <div className="col-span-5 panel flex flex-col justify-between overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="panel-header">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-critical)] animate-pulse" />
                <h3 className="panel-title uppercase">Live state intelligence</h3>
              </div>
              <div className="segmented">
                {(['ALL', 'CRITICAL', 'HIGH'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={activeFilter === filter ? "active" : ""}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-[var(--sp-5)] pb-0">
              <p className="text-[12.5px] text-[var(--color-ink-secondary)] mb-[var(--sp-4)]">
                High-confidence incidents flagged by computer vision across participating department feeds.
              </p>
            </div>

            {/* List of Live State Intelligence Alerts */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-[var(--sp-5)] space-y-[var(--sp-3)] pb-[var(--sp-5)]">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "badge",
                        alert.severity === 'CRITICAL' ? "badge-critical" :
                        alert.severity === 'HIGH' ? "badge-high" : "badge-accent"
                      )}>
                        {alert.severity}
                      </span>
                      <span className="text-[13px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                        {alert.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--color-ink-muted)] font-[var(--font-mono)] flex items-center gap-1">
                      <Clock size={12} />
                      {alert.timeAgo}
                    </span>
                  </div>

                  <div className="text-[11px] text-[var(--color-ink-secondary)] flex items-center gap-2 mb-1">
                    <span className="text-[var(--color-ink)] font-semibold">{alert.department}</span>
                    <span>·</span>
                    <span className="text-[var(--color-ember)] font-semibold">{alert.district}</span>
                    <span>·</span>
                    <span className="font-[var(--font-mono)] text-[var(--color-ink-muted)]">{alert.cameraId}</span>
                  </div>

                  <p className="text-[11px] text-[var(--color-ink-muted)] line-clamp-1">{alert.description}</p>
                </div>
              ))}
            </div>

            <div className="p-[var(--sp-5)] border-t border-[var(--color-hairline)] flex items-center justify-between text-[11px] text-[var(--color-ink-muted)]">
              <span>Showing {filteredAlerts.length} active state incidents</span>
              <button className="btn btn-ghost btn-sm">View Archive →</button>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT CONTEXT MODAL (When an alert is clicked) */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[var(--sp-6)] bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="panel w-full max-w-2xl overflow-hidden shadow-none flex flex-col">
            
            {/* Modal Header */}
            <div className="panel-header border-b border-[var(--color-hairline)] bg-[var(--color-surface-raised)]">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-[var(--r-md)] flex items-center justify-center border",
                  selectedAlert.severity === 'CRITICAL' ? "bg-[color-mix(in_srgb,var(--color-critical)_10%,transparent)] border-[color-mix(in_srgb,var(--color-critical)_20%,transparent)] text-[var(--color-critical)]" : "bg-[color-mix(in_srgb,var(--color-high)_10%,transparent)] border-[color-mix(in_srgb,var(--color-high)_20%,transparent)] text-[var(--color-high)]"
                )}>
                  <Warning size={20} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">{selectedAlert.title}</h3>
                    <span className={cn(
                      "badge",
                      selectedAlert.severity === 'CRITICAL' ? "badge-critical" : "badge-high"
                    )}>
                      {selectedAlert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-ink-muted)] font-[var(--font-mono)] mt-[2px]">
                    {selectedAlert.id} · Flagged {selectedAlert.timeAgo} ({selectedAlert.timestamp})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="btn btn-ghost btn-sm h-8 w-8 !p-0"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="panel-body space-y-[var(--sp-5)] overflow-y-auto max-h-[70vh]">
              {/* Evidence Snapshot / Live Feed */}
              <div className="relative aspect-video rounded-[var(--r-lg)] overflow-hidden bg-black border border-[var(--color-hairline-strong)]">
                <CCTVPlayer cameraId={selectedAlert.cameraId} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-[var(--sp-4)]">
                  <span className="text-[11px] font-[var(--font-mono)] text-white/70">Camera Feed: {selectedAlert.cameraId}</span>
                  <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-online)] font-semibold">Confidence: {selectedAlert.confidence}%</span>
                </div>
              </div>

              {/* Alert Parameters Table */}
              <div className="grid grid-cols-2 gap-[var(--sp-4)]">
                <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow block">Responsible department</span>
                  <span className="text-[13px] font-semibold text-[var(--color-ink)]">{selectedAlert.department}</span>
                </div>
                <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow block">District & location</span>
                  <span className="text-[13px] font-semibold text-[var(--color-ink)]">{selectedAlert.district} · {selectedAlert.cameraLocation}</span>
                </div>
                <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow block">AI model & version</span>
                  <span className="text-[13px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{selectedAlert.model} (v{selectedAlert.modelVersion})</span>
                </div>
                <div className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow block">Verification status</span>
                  <span className="text-[13px] font-semibold text-[var(--color-online)]">Temporal Agreement Verified</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-[var(--sp-4)] rounded-[var(--r-lg)] bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[12.5px] text-[var(--color-ink-secondary)] leading-relaxed">
                {selectedAlert.description}
              </div>

              {/* IMPORTANT Central/Department Boundary Callout */}
              <div className="p-[var(--sp-4)] rounded-[var(--r-lg)] bg-[color-mix(in_srgb,var(--color-high)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-high)_20%,transparent)] flex items-start gap-3">
                <LockKey size={18} className="text-[var(--color-high)] shrink-0 mt-0.5" weight="fill" />
                <div className="text-[12px] space-y-1">
                  <p className="font-bold text-[var(--color-high)] uppercase tracking-wide">Central Oversight & Policy Boundary</p>
                  <p className="text-[var(--color-ink-secondary)] leading-relaxed">
                    As a Central Command user, you have statewide surveillance oversight and evidence audit privileges. However, field operator dispatch and department rule configurations remain strictly controlled by the {selectedAlert.department}.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="panel-header border-t border-[var(--color-hairline)] bg-[var(--color-surface-raised)] flex items-center justify-between">
              <button
                onClick={() => setSelectedAlert(null)}
                className="btn btn-secondary btn-sm"
              >
                Close Context
              </button>
              
              <button
                onClick={() => {
                  alert(`Investigation oversight ticket logged for ${selectedAlert.id}. Department ${selectedAlert.department} notified.`);
                  setSelectedAlert(null);
                }}
                className="btn btn-ember"
              >
                <FileText size={16} weight="bold" />
                <span>Open Investigation Oversight</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
