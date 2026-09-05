import React, { useState } from 'react';
import { STATE_DEPARTMENTS } from '../../stateData';
import { StateDepartment } from '../../types';
import { cn } from '../../lib/utils';
import { 
  Buildings, 
  VideoCamera, 
  Cube, 
  Pulse, 
  Warning, 
  CheckCircle, 
  ArrowLeft, 
  ShieldCheck, 
  LockKey, 
  ToggleLeft, 
  ToggleRight, 
  SlidersHorizontal,
  MapPin,
  Clock,
  ArrowSquareOut
} from '@phosphor-icons/react';

export const DepartmentsView: React.FC = () => {
  const [departments, setDepartments] = useState<StateDepartment[]>(STATE_DEPARTMENTS);
  const [selectedDept, setSelectedDept] = useState<StateDepartment | null>(null);

  const toggleDeptStatus = (id: string) => {
    setDepartments(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';
        return { ...d, status: nextStatus };
      }
      return d;
    }));
    if (selectedDept && selectedDept.id === id) {
      setSelectedDept(prev => prev ? { ...prev, status: prev.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE' } : null);
    }
  };

  const toggleCapability = (deptId: string, capName: string) => {
    setDepartments(prev => prev.map(d => {
      if (d.id === deptId) {
        const updatedCaps = d.activeCapabilities.map(c => {
          if (c.name === capName) {
            const nextStatus = c.status === 'DEPLOYED' ? 'AVAILABLE' : 'DEPLOYED';
            return { ...c, status: nextStatus as any };
          }
          return c;
        });
        return { ...d, activeCapabilities: updatedCaps };
      }
      return d;
    }));
    if (selectedDept && selectedDept.id === deptId) {
      setSelectedDept(prev => {
        if (!prev) return null;
        return {
          ...prev,
          activeCapabilities: prev.activeCapabilities.map(c => 
            c.name === capName ? { ...c, status: c.status === 'DEPLOYED' ? 'AVAILABLE' : 'DEPLOYED' as any } : c
          )
        };
      });
    }
  };

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">State Departments</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              GOVERNANCE & PROVISIONING
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Manage participating government entities, allocate approved AI capabilities, and supervise compliance.
          </p>
        </div>

        {selectedDept && (
          <button
            onClick={() => setSelectedDept(null)}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Back to All Departments</span>
          </button>
        )}
      </header>

      {/* If a department is selected: Deep Department Detail View */}
      {selectedDept ? (
        <div className="space-y-[var(--sp-6)] animate-fade-in">
          {/* Department Header Banner */}
          <div className="panel p-[var(--sp-6)] flex items-center justify-between relative overflow-hidden bg-[var(--color-surface-raised)]">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[var(--color-ember)] flex items-center justify-center">
                <Buildings size={32} weight="fill" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-[20px] font-semibold text-[var(--color-ink)]">{selectedDept.name}</h3>
                  <span className={cn(
                    "badge",
                    selectedDept.status === 'ACTIVE' ? "badge-online" : "badge-high"
                  )}>
                    {selectedDept.status}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--color-ink-secondary)] mt-1">
                  Headquarters: {selectedDept.headquarters} · Jurisdictions: {selectedDept.districtsCovered.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleDeptStatus(selectedDept.id)}
                className={cn(
                  "btn",
                  selectedDept.status === 'ACTIVE' 
                    ? "btn-secondary text-[var(--color-critical)]" 
                    : "btn-ember"
                )}
              >
                {selectedDept.status === 'ACTIVE' ? 'Suspend Department Provisioning' : 'Activate Department Provisioning'}
              </button>
            </div>
          </div>

          {/* Department Metric Cards */}
          <div className="grid grid-cols-4 gap-[var(--sp-4)]">
            <div className="panel p-[var(--sp-5)] space-y-2">
              <span className="eyebrow uppercase block">Enrolled cameras</span>
              <span className="text-[24px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{selectedDept.cameras.toLocaleString()}</span>
              <div className="text-[11px] text-[var(--color-online)] flex items-center justify-between pt-1 font-semibold">
                <span>{selectedDept.online.toLocaleString()} Online</span>
                <span className="text-[var(--color-ink-muted)] font-[var(--font-mono)]">{Math.round((selectedDept.online / selectedDept.cameras) * 100)}%</span>
              </div>
            </div>

            <div className="panel p-[var(--sp-5)] space-y-2">
              <span className="eyebrow uppercase block">AI deployments</span>
              <span className="text-[24px] font-semibold text-[var(--color-accent)] font-[var(--font-mono)]">{selectedDept.aiDeployments.toLocaleString()}</span>
              <span className="text-[11px] text-[var(--color-ink-muted)] block pt-1 font-semibold">Active on Edge & GPU</span>
            </div>

            <div className="panel p-[var(--sp-5)] space-y-2">
              <span className="eyebrow uppercase block">Events today</span>
              <span className="text-[24px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{selectedDept.eventsToday.toLocaleString()}</span>
              <span className="text-[11px] text-[var(--color-ink-muted)] block pt-1 font-semibold">Telemetries processed</span>
            </div>

            <div className="panel p-[var(--sp-5)] space-y-2">
              <span className="eyebrow uppercase block">Alerts dispatched</span>
              <span className="text-[24px] font-semibold text-[var(--color-critical)] font-[var(--font-mono)]">{selectedDept.alerts.toLocaleString()}</span>
              <span className="text-[11px] text-[var(--color-ink-muted)] block pt-1 font-semibold">Field incidents handled</span>
            </div>
          </div>

          {/* AI Capability Provisioning Matrix */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h4 className="panel-title uppercase">Central AI Capability Allocation Matrix</h4>
                <p className="text-[12px] text-[var(--color-ink-secondary)] mt-0.5">
                  Authorize or restrict which centrally approved models this department is permitted to deploy.
                </p>
              </div>
              <span className="text-[12px] font-[var(--font-mono)] text-[var(--color-ember)] font-semibold">
                Compliance Score: <strong className="text-[var(--color-ink)] font-bold">{selectedDept.complianceScore}%</strong>
              </span>
            </div>

            <div className="panel-body space-y-[var(--sp-2)]">
              {selectedDept.activeCapabilities.map(cap => (
                <div 
                  key={cap.name}
                  className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] flex items-center justify-between hover:border-[var(--color-hairline-strong)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-ember)]">
                      <Cube size={20} weight="fill" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-[var(--color-ink)]">{cap.name}</span>
                        <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)]">v{cap.version}</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-ink-secondary)] mt-0.5">
                        {cap.status === 'DEPLOYED' 
                          ? `Active on ${cap.camerasActive.toLocaleString()} department cameras` 
                          : 'Cleared for department rollout but not yet deployed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className={cn(
                      "badge",
                      cap.status === 'DEPLOYED' ? "badge-online" :
                      cap.status === 'AVAILABLE' ? "badge-accent" :
                      "badge-critical"
                    )}>
                      {cap.status}
                    </span>

                    <button
                      onClick={() => toggleCapability(selectedDept.id, cap.name)}
                      className="transition-colors"
                      title="Toggle Provisioning Cleared State"
                    >
                      {cap.status === 'DEPLOYED' ? (
                        <ToggleRight size={36} weight="fill" className="text-[var(--color-ember)]" />
                      ) : (
                        <ToggleLeft size={36} weight="fill" className="text-[var(--color-ink-muted)] opacity-50" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Explicit Central Governance vs Department Boundary */}
            <div className="panel-body">
              <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[color-mix(in_srgb,var(--color-high)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-high)_20%,transparent)] flex items-start gap-4">
                <LockKey size={20} className="text-[var(--color-high)] shrink-0 mt-0.5" weight="fill" />
                <div className="text-[12px] space-y-2">
                  <p className="font-bold text-[var(--color-high)] uppercase tracking-wider">Central Governance & Autonomy Protocol</p>
                  <p className="text-[var(--color-ink-secondary)] leading-relaxed">
                    Central Government retains authority over capability validation, quota allocation, and compliance oversight. Department operational leaders autonomously manage local detection thresholds, camera grouping schemes, operator shifts, and investigative dispatch workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Department List / Cards Overview */
        <div className="grid grid-cols-2 gap-[var(--sp-6)]">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => setSelectedDept(dept)}
              className="panel flex flex-col hover:border-[var(--color-hairline-strong)] transition-all cursor-pointer group p-[var(--sp-6)] bg-[var(--color-surface-raised)]"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[var(--color-ember)] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Buildings size={24} weight="fill" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-ember)] transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-[11px] text-[var(--color-ink-muted)] font-[var(--font-mono)] mt-0.5 uppercase tracking-wide">{dept.code} · {dept.headquarters}</p>
                    </div>
                  </div>

                  <span className={cn(
                    "badge",
                    dept.status === 'ACTIVE' ? "badge-online" : "badge-high"
                  )}>
                    {dept.status}
                  </span>
                </div>

                {/* Metrics 4-grid */}
                <div className="grid grid-cols-4 gap-[var(--sp-3)] p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] mb-6">
                  <div className="space-y-1">
                    <span className="eyebrow uppercase block">Cameras</span>
                    <span className="text-[15px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{dept.cameras.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="eyebrow uppercase !text-[var(--color-online)] block">Online</span>
                    <span className="text-[15px] font-semibold text-[var(--color-online)] font-[var(--font-mono)]">{dept.online.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="eyebrow uppercase !text-[var(--color-accent)] block">AI Assets</span>
                    <span className="text-[15px] font-semibold text-[var(--color-accent)] font-[var(--font-mono)]">{dept.aiDeployments.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="eyebrow uppercase !text-[var(--color-ember)] block">Alerts</span>
                    <span className="text-[15px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{dept.alerts.toLocaleString()}</span>
                  </div>
                </div>

                {/* Capabilities pills */}
                <div className="space-y-[var(--sp-2)]">
                  <span className="eyebrow uppercase tracking-widest block">Provisioned AI models</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.activeCapabilities.map(cap => (
                      <span
                        key={cap.name}
                        className={cn(
                          "badge text-[9px] uppercase",
                          cap.status === 'DEPLOYED' ? "badge-accent" : "opacity-40"
                        )}
                      >
                        {cap.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-[var(--sp-4)] border-t border-[var(--color-hairline)] mt-[var(--sp-6)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-ink-muted)]">Compliance: <strong className="text-[var(--color-online)] font-bold">{dept.complianceScore}%</strong></span>
                <span className="text-[11px] text-[var(--color-ember)] font-bold flex items-center gap-1.5 group-hover:underline">
                  <span>Manage Provisioning</span>
                  <ArrowSquareOut size={14} weight="bold" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
