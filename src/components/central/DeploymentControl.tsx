import React, { useState } from 'react';
import { DEPLOYMENT_TREE } from '../../stateData';
import { DeploymentTreeItem } from '../../types';
import { cn } from '../../lib/utils';
import { 
  RocketLaunch, 
  Cube, 
  CheckCircle, 
  Pause, 
  ArrowsCounterClockwise, 
  Warning, 
  Cpu, 
  Buildings, 
  ArrowRight, 
  CaretDown, 
  CaretRight,
  ShieldCheck,
  HardDrives,
  Gauge
} from '@phosphor-icons/react';

export const DeploymentControl: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentTreeItem[]>(DEPLOYMENT_TREE);
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({
    'Vehicle Intelligence': true,
    'Weapon & Threat Intelligence': true
  });
  const [isPaused, setIsPaused] = useState(false);

  const toggleExpand = (modelName: string) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelName]: !prev[modelName]
    }));
  };

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Deployment Control</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              STATEWIDE ORCHESTRATION
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Supervise container distribution, manage edge vs cloud inference nodes, and orchestrate rollouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "btn",
              isPaused 
                ? "bg-[color-mix(in_srgb,var(--color-critical)_10%,transparent)] border-[var(--color-critical)]/30 text-[var(--color-critical)]" 
                : "btn-secondary"
            )}
          >
            <Pause size={16} weight="bold" />
            <span>{isPaused ? 'Global Inference Throttled' : 'Throttle Non-Critical Inference'}</span>
          </button>
        </div>
      </header>

      {/* Deployment Status Metrics */}
      <div className="grid grid-cols-4 gap-[var(--sp-6)]">
        <div className="panel p-[var(--sp-5)] bg-[var(--color-surface-raised)] space-y-1">
          <span className="eyebrow text-[var(--color-online)] uppercase block mb-1">Active deployments</span>
          <span className="text-[28px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)] tracking-tight">12,842</span>
          <span className="text-[11px] text-[var(--color-ink-muted)] block font-semibold uppercase tracking-wider">On 1,480 Edge Gateways + Cloud</span>
        </div>

        <div className="panel p-[var(--sp-5)] bg-[var(--color-surface-raised)] space-y-1">
          <span className="eyebrow text-[var(--color-accent)] uppercase block mb-1">In Queue / Validating</span>
          <span className="text-[28px] font-semibold text-[var(--color-accent)] font-[var(--font-mono)] tracking-tight">42</span>
          <span className="text-[11px] text-[var(--color-ink-muted)] block font-semibold uppercase tracking-wider">Awaiting gateway handshake</span>
        </div>

        <div className="panel p-[var(--sp-5)] bg-[var(--color-surface-raised)] space-y-1">
          <span className="eyebrow text-[var(--color-ember)] uppercase block mb-1">Degraded inference</span>
          <span className="text-[28px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)] tracking-tight">83</span>
          <span className="text-[11px] text-[var(--color-ink-muted)] block font-semibold uppercase tracking-wider">FPS drops under thermal limit</span>
        </div>

        <div className="panel p-[var(--sp-5)] bg-[var(--color-surface-raised)] space-y-1">
          <span className="eyebrow text-[var(--color-critical)] uppercase block mb-1">Failed node containers</span>
          <span className="text-[28px] font-semibold text-[var(--color-critical)] font-[var(--font-mono)] tracking-tight">17</span>
          <span className="text-[11px] text-[var(--color-critical)]/70 block font-semibold uppercase tracking-wider">Auto-restarting in sandbox</span>
        </div>
      </div>

      {/* State Flow Visualizer */}
      <div className="panel p-[var(--sp-6)] bg-[var(--color-surface-raised)]">
        <span className="eyebrow uppercase tracking-widest block mb-4">
          Statewide Deployment Lifecycle Pipeline
        </span>

        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { label: 'REQUESTED', desc: 'Dept submits camera list' },
            { label: 'VALIDATING', desc: 'Resolution & codec verified' },
            { label: 'QUEUED', desc: 'Container assigned to edge/GPU' },
            { label: 'DEPLOYING', desc: 'TensorRT weights loaded' },
            { label: 'ACTIVE', desc: 'Real-time inference live' }
          ].map((step, idx) => (
            <div key={step.label} className="flex-1 flex items-center gap-3 min-w-[180px]">
              <div className="flex-1 p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-0.5">
                <span className="text-[10px] font-bold text-[var(--color-ember)] uppercase font-[var(--font-mono)] block tracking-widest">{step.label}</span>
                <span className="text-[11px] text-[var(--color-ink-muted)] font-semibold block">{step.desc}</span>
              </div>
              {idx < 4 && <ArrowRight size={16} className="text-[var(--color-hairline-strong)] shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Deployment Tree */}
      <div className="panel bg-[var(--color-surface-raised)] overflow-hidden">
        <div className="panel-header bg-[var(--color-surface)] border-b border-[var(--color-hairline)]">
          <div>
            <h3 className="panel-title">Statewide Distribution Hierarchy</h3>
            <p className="text-[12px] text-[var(--color-ink-secondary)] mt-0.5 font-medium">Explore active deployments grouped by AI model, department, and district nodes.</p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2"><HardDrives size={18} className="text-[var(--color-online)]" /> GPU Load: 44%</span>
            <div className="w-px h-4 bg-[var(--color-hairline-strong)]" />
            <span className="flex items-center gap-2"><Gauge size={18} className="text-[var(--color-ember)]" /> Edge NPU Load: 68%</span>
          </div>
        </div>

        <div className="panel-body space-y-[var(--sp-4)]">
          {deployments.map((item) => {
            const isExpanded = expandedModels[item.modelName] ?? false;

            return (
              <div 
                key={item.modelName}
                className="rounded-[var(--r-md)] border border-[var(--color-hairline)] bg-[var(--color-surface)] overflow-hidden transition-all shadow-sm"
              >
                {/* Model Row Header */}
                <div 
                  onClick={() => toggleExpand(item.modelName)}
                  className="p-[var(--sp-4)] flex items-center justify-between cursor-pointer hover:bg-[var(--color-surface-raised)] transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <button className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors">
                      {isExpanded ? <CaretDown size={18} weight="bold" /> : <CaretRight size={18} weight="bold" />}
                    </button>
                    <div className="w-11 h-11 rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] text-[var(--color-ember)] flex items-center justify-center shadow-sm">
                      <Cube size={22} weight="fill" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">{item.modelName}</h4>
                        <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold uppercase">{item.modelVersion}</span>
                      </div>
                      <p className="text-[12px] text-[var(--color-ink-secondary)] mt-0.5">
                        Allocated to {item.departments.length} government departments
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="badge badge-accent px-3 py-1 font-[var(--font-mono)] font-bold text-[11px]">
                      {item.totalCameras.toLocaleString()} Cameras Active
                    </span>
                    <span className={cn(
                      "badge font-bold",
                      item.status === 'ACTIVE' ? "badge-online" : "badge-secondary"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Sub-Tree: Departments & District Breakdown */}
                {isExpanded && (
                  <div className="px-[var(--sp-6)] pb-[var(--sp-6)] pt-[var(--sp-2)] border-t border-[var(--color-hairline)] space-y-4 bg-[var(--color-surface-raised)]/50 animate-fade-in">
                    {item.departments.map((dept) => (
                      <div key={dept.name} className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                          <div className="flex items-center gap-3">
                            <Buildings size={20} className="text-[var(--color-ember)]" />
                            <span className="text-[14px] font-semibold text-[var(--color-ink)]">{dept.name}</span>
                          </div>
                          <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold uppercase">
                            {dept.districts.reduce((acc, d) => acc + d.cameras, 0).toLocaleString()} Total Cameras
                          </span>
                        </div>

                        {/* District chips */}
                        <div className="grid grid-cols-4 gap-3">
                          {dept.districts.map((dist) => (
                            <div key={dist.name} className="p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] flex items-center justify-between transition-colors hover:border-[var(--color-hairline-strong)]">
                              <div>
                                <span className="font-semibold text-[var(--color-ink)] block text-[13px]">{dist.name}</span>
                                <span className="text-[10px] text-[var(--color-ink-muted)] font-[var(--font-mono)] font-bold uppercase">{dist.cameras.toLocaleString()} cams</span>
                              </div>
                              <span className={cn(
                                "text-[12px] font-[var(--font-mono)] font-bold",
                                dist.health > 90 ? "text-[var(--color-online)]" : "text-[var(--color-ember)]"
                              )}>
                                {dist.health}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
