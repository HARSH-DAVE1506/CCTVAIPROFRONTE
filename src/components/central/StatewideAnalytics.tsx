import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { STATE_ANALYTICS_DATA, GUJARAT_DISTRICTS } from '../../stateData';
import { cn } from '../../lib/utils';
import { 
  ChartLine, 
  Cube, 
  Buildings, 
  MapPin, 
  Pulse, 
  ShieldCheck, 
  ArrowRight,
  CaretRight,
  HardDrives
} from '@phosphor-icons/react';

export const StatewideAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'AI_ACTIVITY' | 'DEPARTMENTS' | 'GEOGRAPHY' | 'TELEMETRY' | 'DRILLDOWN'>('AI_ACTIVITY');

  // Drilldown path state
  const [drillStep, setDrillStep] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState('Police');
  const [selectedDist, setSelectedDist] = useState('Ahmedabad');
  const [selectedCam, setSelectedCam] = useState('CAM-023');

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Statewide Analytics</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              CROSS-DOMAIN INTELLIGENCE
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Macro-level performance telemetry, multi-department comparative indicators, and statewide incident density.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-[var(--color-surface)] p-1.5 rounded-[var(--r-md)] border border-[var(--color-hairline)] shadow-sm">
          {[
            { id: 'AI_ACTIVITY', label: 'AI Activity' },
            { id: 'DEPARTMENTS', label: 'Department comparison' },
            { id: 'GEOGRAPHY', label: 'Geographic trends' },
            { id: 'TELEMETRY', label: 'Camera telemetry' },
            { id: 'DRILLDOWN', label: 'Investigation drill-down' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-[var(--r-md)] text-[12px] font-bold transition-all uppercase tracking-wider",
                activeTab === tab.id 
                  ? "bg-[var(--color-ember)] text-white shadow-md" 
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Tab Views */}
      {activeTab === 'AI_ACTIVITY' && (
        <div className="space-y-[var(--sp-6)] animate-fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-3 gap-[var(--sp-6)]">
            <div className="panel p-[var(--sp-6)] bg-[var(--color-surface-raised)] space-y-1">
              <span className="eyebrow uppercase block mb-1">Total 24h AI inferences</span>
              <span className="text-[32px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)] tracking-tight">1,299,822</span>
              <span className="text-[12px] text-[var(--color-online)] font-bold block">+14.2% statewide acceleration</span>
            </div>
            <div className="panel p-[var(--sp-6)] bg-[var(--color-surface-raised)] space-y-1">
              <span className="eyebrow uppercase block mb-1">Mean inference latency</span>
              <span className="text-[32px] font-semibold text-[var(--color-online)] font-[var(--font-mono)] tracking-tight">38.4 ms</span>
              <span className="text-[12px] text-[var(--color-ink-muted)] font-bold block uppercase tracking-wider">Edge gateways (FP16)</span>
            </div>
            <div className="panel p-[var(--sp-6)] bg-[var(--color-surface-raised)] space-y-1">
              <span className="eyebrow uppercase block mb-1">False-positive audit rate</span>
              <span className="text-[32px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)] tracking-tight">1.84%</span>
              <span className="text-[12px] text-[var(--color-ink-muted)] font-bold block uppercase tracking-wider">Passes &gt;95% judicial threshold</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-[var(--sp-6)]">
            {/* Hourly Volume */}
            <div className="panel bg-[var(--color-surface-raised)] overflow-hidden">
              <div className="panel-header bg-[var(--color-surface)]">
                <h3 className="panel-title uppercase tracking-wider">Statewide real-time ingestion (Hourly volume)</h3>
              </div>
              <div className="panel-body h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={STATE_ANALYTICS_DATA.hourlyStatewideVolume}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
                    <XAxis dataKey="hour" stroke="var(--color-ink-muted)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--color-ink-muted)" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface-raised)', 
                        borderColor: 'var(--color-hairline-strong)', 
                        fontSize: '11px',
                        borderRadius: 'var(--r-md)',
                        color: 'var(--color-ink)'
                      }} 
                    />
                    <Area type="monotone" dataKey="events" stroke="var(--color-ember)" fill="var(--color-ember)" fillOpacity={0.1} strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Events by Capability Breakdown */}
            <div className="panel bg-[var(--color-surface-raised)] overflow-hidden">
              <div className="panel-header bg-[var(--color-surface)]">
                <h3 className="panel-title uppercase tracking-wider">Detections by AI capability category</h3>
              </div>
              <div className="panel-body h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STATE_ANALYTICS_DATA.eventsByModel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" horizontal={false} />
                    <XAxis type="number" stroke="var(--color-ink-muted)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="var(--color-ink-muted)" fontSize={10} width={130} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface-raised)', 
                        borderColor: 'var(--color-hairline-strong)', 
                        fontSize: '11px',
                        borderRadius: 'var(--r-md)',
                        color: 'var(--color-ink)'
                      }} 
                    />
                    <Bar dataKey="count" fill="var(--color-ember)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DEPARTMENTS' && (
        <div className="space-y-[var(--sp-6)] animate-fade-in">
          <div className="panel bg-[var(--color-surface-raised)] overflow-hidden">
            <div className="panel-header bg-[var(--color-surface)]">
              <div>
                <h3 className="panel-title uppercase tracking-wider">Cross-department comparative benchmark</h3>
                <p className="text-[12px] text-[var(--color-ink-secondary)] mt-0.5">Comparison of camera volume, operational uptime %, and daily alerts processed.</p>
              </div>
            </div>

            <div className="panel-body h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STATE_ANALYTICS_DATA.departmentComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-ink-muted)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-ink-muted)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-surface-raised)', 
                      borderColor: 'var(--color-hairline-strong)', 
                      fontSize: '11px',
                      borderRadius: 'var(--r-md)',
                      color: 'var(--color-ink)'
                    }} 
                  />
                  <Bar dataKey="cameras" fill="var(--color-ember)" name="Total Cameras" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="alertsToday" fill="var(--color-accent)" name="Alerts Today" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'GEOGRAPHY' && (
        <div className="space-y-[var(--sp-6)] animate-fade-in">
          <div className="grid grid-cols-3 gap-[var(--sp-6)]">
            {GUJARAT_DISTRICTS.map(dist => (
              <div key={dist.id} className="panel p-[var(--sp-5)] bg-[var(--color-surface-raised)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={18} className="text-[var(--color-ember)]" />
                    <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">{dist.name}</h4>
                  </div>
                  <span className="badge badge-online font-bold">{dist.health}% Health</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--color-surface)] p-[var(--sp-3)] rounded-[var(--r-md)] border border-[var(--color-hairline)]">
                    <span className="eyebrow uppercase block mb-0.5">Cameras</span>
                    <span className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{dist.cameras.toLocaleString()}</span>
                  </div>
                  <div className="bg-[var(--color-surface)] p-[var(--sp-3)] rounded-[var(--r-md)] border border-[var(--color-hairline)]">
                    <span className="eyebrow uppercase block mb-0.5">Active alerts</span>
                    <span className="text-[16px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{dist.alerts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TELEMETRY' && (
        <div className="panel bg-[var(--color-surface-raised)] p-[var(--sp-6)] animate-fade-in space-y-6">
          <h3 className="panel-title uppercase tracking-wider">Network & stream health telemetry</h3>
          <div className="grid grid-cols-3 gap-[var(--sp-5)]">
            <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
              <span className="eyebrow uppercase block mb-1">Mean RTSP packet drop</span>
              <span className="text-[24px] font-semibold text-[var(--color-online)] font-[var(--font-mono)]">0.04%</span>
            </div>
            <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
              <span className="eyebrow uppercase block mb-1">H.265 compression efficiency</span>
              <span className="text-[24px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">68.2%</span>
            </div>
            <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
              <span className="eyebrow uppercase block mb-1">Storage ingestion rate</span>
              <span className="text-[24px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">42.8 GB/sec</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DRILLDOWN' && (
        <div className="panel bg-[var(--color-surface-raised)] overflow-hidden animate-fade-in shadow-xl">
          <div className="panel-header bg-[var(--color-surface)] border-b border-[var(--color-hairline)]">
            <div>
              <h3 className="panel-title uppercase tracking-wider">Hierarchical investigation drill-down</h3>
              <p className="text-[12px] text-[var(--color-ink-secondary)] mt-0.5 font-medium">
                Trace from high-level state governance down to individual camera frames.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-[var(--font-mono)] text-[var(--color-ember)] font-bold uppercase tracking-wider bg-[color-mix(in_srgb,var(--color-ember)_8%,transparent)] px-3 py-1.5 rounded-[var(--r-md)] border border-[var(--color-ember)]/20">
              <span>Gujarat</span>
              <CaretRight size={12} weight="bold" className="text-[var(--color-ink-muted)]" />
              <span>{selectedDept}</span>
              <CaretRight size={12} weight="bold" className="text-[var(--color-ink-muted)]" />
              <span>{selectedDist}</span>
              <CaretRight size={12} weight="bold" className="text-[var(--color-ink-muted)]" />
              <span className="text-[var(--color-ink)]">{selectedCam}</span>
            </div>
          </div>

          <div className="panel-body grid grid-cols-4 gap-[var(--sp-6)]">
            {/* Step 1: Department */}
            <div className="space-y-[var(--sp-3)]">
              <span className="eyebrow uppercase block font-bold mb-4 tracking-widest text-[var(--color-ink-muted)]">1. Department</span>
              {['Police', 'GSRTC', 'Municipal Corporation'].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-[var(--r-md)] text-[12px] font-bold transition-all border uppercase tracking-wider",
                    selectedDept === dept 
                      ? "bg-[var(--color-ember)] border-transparent text-white shadow-md" 
                      : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-ink-muted)] hover:border-[var(--color-hairline-strong)]"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Step 2: District */}
            <div className="space-y-[var(--sp-3)]">
              <span className="eyebrow uppercase block font-bold mb-4 tracking-widest text-[var(--color-ink-muted)]">2. District</span>
              {['Ahmedabad', 'Surat', 'Vadodara'].map(dist => (
                <button
                  key={dist}
                  onClick={() => setSelectedDist(dist)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-[var(--r-md)] text-[12px] font-bold transition-all border uppercase tracking-wider",
                    selectedDist === dist 
                      ? "bg-[var(--color-ember)] border-transparent text-white shadow-md" 
                      : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-ink-muted)] hover:border-[var(--color-hairline-strong)]"
                  )}
                >
                  {dist}
                </button>
              ))}
            </div>

            {/* Step 3: Camera */}
            <div className="space-y-[var(--sp-3)]">
              <span className="eyebrow uppercase block font-bold mb-4 tracking-widest text-[var(--color-ink-muted)]">3. Target camera</span>
              {['CAM-023', 'CAM-114', 'CAM-421'].map(cam => (
                <button
                  key={cam}
                  onClick={() => setSelectedCam(cam)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-[var(--r-md)] text-[12px] font-[var(--font-mono)] font-bold transition-all border uppercase tracking-widest",
                    selectedCam === cam 
                      ? "bg-[var(--color-ember)] border-transparent text-white shadow-md" 
                      : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-ink-muted)] hover:border-[var(--color-hairline-strong)]"
                  )}
                >
                  {cam}
                </button>
              ))}
            </div>

            {/* Step 4: Live Result Card */}
            <div className="p-[var(--sp-6)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline-strong)] space-y-4 shadow-sm flex flex-col justify-center">
              <div className="space-y-1">
                <span className="eyebrow text-[var(--color-ember)] uppercase tracking-widest block font-bold mb-2">Investigation result</span>
                <p className="font-bold text-[var(--color-ink)] text-[15px]">{selectedCam} · Concourse North</p>
                <p className="text-[var(--color-ink-secondary)] text-[12px] font-medium">Model: Weapon & Threat v1.0.0</p>
              </div>
              <div className="p-3 bg-[color-mix(in_srgb,var(--color-online)_8%,transparent)] rounded-[var(--r-md)] border border-[var(--color-online)]/20 text-[11px] text-[var(--color-online)] font-[var(--font-mono)] font-bold uppercase tracking-wider">
                Temporal verification confirmed. No breach detected in last 24h.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
