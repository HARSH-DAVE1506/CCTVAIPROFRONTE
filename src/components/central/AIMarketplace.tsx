import React, { useState } from 'react';
import { MARKETPLACE_CAPABILITIES } from '../../stateData';
import { cn } from '../../lib/utils';
import { 
  RocketLaunch, 
  MagnifyingGlass, 
  Eye, 
  CheckCircle, 
  Pulse, 
  ShieldCheck, 
  ChatsCircle, 
  Clock, 
  Cpu, 
  Car, 
  Backpack, 
  Crosshair, 
  FileText,
  LockKey,
  X,
  ShareNetwork,
  Buildings,
  ArrowSquareOut,
  SlidersHorizontal
} from '@phosphor-icons/react';

export const AIMarketplace: React.FC = () => {
  const [capabilities, setCapabilities] = useState(MARKETPLACE_CAPABILITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedModel, setSelectedModel] = useState<typeof MARKETPLACE_CAPABILITIES[0] | null>(null);
  const [provisionModalModel, setProvisionModalModel] = useState<typeof MARKETPLACE_CAPABILITIES[0] | null>(null);

  const categories = ['ALL', 'Vehicle', 'Object', 'Security', 'Analytics', 'VLM'];
  const allDepartments = ['Police', 'GSRTC', 'Municipal Corporation', 'Health', 'Panchayat'];

  const filteredCapabilities = capabilities.filter(cap => {
    if (selectedCategory !== 'ALL' && cap.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        cap.name.toLowerCase().includes(q) ||
        cap.description.toLowerCase().includes(q) ||
        cap.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleDeptAvailability = (capId: string, deptName: string) => {
    setCapabilities(prev => prev.map(c => {
      if (c.id === capId) {
        const hasDept = c.availableTo.includes(deptName);
        const updated = hasDept 
          ? c.availableTo.filter(d => d !== deptName)
          : [...c.availableTo, deptName];
        return { ...c, availableTo: updated };
      }
      return c;
    }));
    if (provisionModalModel && provisionModalModel.id === capId) {
      setProvisionModalModel(prev => {
        if (!prev) return null;
        const hasDept = prev.availableTo.includes(deptName);
        const updated = hasDept 
          ? prev.availableTo.filter(d => d !== deptName)
          : [...prev.availableTo, deptName];
        return { ...prev, availableTo: updated };
      });
    }
  };

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">AI Marketplace</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              STATEWIDE REPOSITORY
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Centralized catalogue of approved government AI models available for department provisioning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="badge badge-online px-4 py-2 text-[11px]">
            All 5 Core Capabilities Approved
          </div>
        </div>
      </header>

      {/* Hero / Filter Bar */}
      <div className="panel p-[var(--sp-5)] bg-[var(--color-surface-raised)]">
        <div className="flex items-center justify-between gap-[var(--sp-6)]">
          <div className="flex-1 relative group max-w-xl">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-[18px] group-focus-within:text-[var(--color-ember)] transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search approved capabilities, ANPR, temporal, Re-ID..."
              className="w-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] py-2.5 pl-11 pr-4 text-[13px] focus:outline-none focus:border-[var(--color-ember)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "btn btn-sm",
                  selectedCategory === cat ? "btn-ember" : "btn-secondary"
                )}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-3 gap-[var(--sp-6)]">
        {filteredCapabilities.map((cap) => (
          <div
            key={cap.id}
            className="panel p-[var(--sp-6)] flex flex-col justify-between group hover:border-[var(--color-hairline-strong)] transition-all relative overflow-hidden bg-[var(--color-surface-raised)]"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-ember)] group-hover:scale-105 transition-transform">
                  {cap.id === 'cap-01' ? <Car size={28} weight="fill" /> :
                   cap.id === 'cap-02' ? <Backpack size={28} weight="fill" /> :
                   cap.id === 'cap-03' ? <Crosshair size={28} weight="fill" /> :
                   cap.id === 'cap-04' ? <ShieldCheck size={28} weight="fill" /> :
                   <ChatsCircle size={28} weight="fill" />}
                </div>

                <div className="text-right">
                  <span className="badge badge-online">
                    {cap.status}
                  </span>
                  <p className="text-[11px] text-[var(--color-ink-muted)] font-[var(--font-mono)] mt-1.5 uppercase tracking-wider">{cap.version}</p>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-ember)] transition-colors">
                {cap.name}
              </h3>
              <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed mb-6 line-clamp-2">
                {cap.description}
              </p>

              {/* Capabilities checklist */}
              <div className="space-y-[var(--sp-2)] mb-6">
                {cap.capabilities.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-[12px] text-[var(--color-ink-secondary)]">
                    <CheckCircle className="text-[var(--color-ember)] shrink-0" size={14} weight="fill" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
                {cap.capabilities.length > 3 && (
                  <span className="text-[11px] text-[var(--color-ember)] font-semibold block pl-[var(--sp-6)]">
                    +{cap.capabilities.length - 3} more capabilities
                  </span>
                )}
              </div>

              {/* Performance Metrics Box */}
              <div className="grid grid-cols-2 gap-[var(--sp-2)] p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] mb-6">
                <div>
                  <span className="eyebrow uppercase block mb-0.5">Accuracy</span>
                  <span className="text-[14px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{cap.accuracy}</span>
                </div>
                <div>
                  <span className="eyebrow uppercase block mb-0.5">Latency</span>
                  <span className="text-[14px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{cap.latency}</span>
                </div>
                <div>
                  <span className="eyebrow uppercase block mb-0.5">Active cams</span>
                  <span className="text-[14px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{cap.deployments.toLocaleString()}</span>
                </div>
                <div>
                  <span className="eyebrow uppercase block mb-0.5">Compute</span>
                  <span className="text-[11px] font-semibold text-[var(--color-ink-secondary)] truncate">{cap.compatible.split('(')[0]}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-[var(--sp-2)] pt-[var(--sp-4)] border-t border-[var(--color-hairline)]">
              <button
                onClick={() => setProvisionModalModel(cap)}
                className="btn btn-ember w-full"
              >
                <ShareNetwork size={16} weight="bold" />
                <span>Make Available to Departments</span>
              </button>
              
              <button
                onClick={() => setSelectedModel(cap)}
                className="btn btn-secondary w-full"
              >
                <Eye size={14} />
                <span>View Full Specifications</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: PROVISION TO DEPARTMENTS */}
      {provisionModalModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[color-mix(in_srgb,var(--color-canvas)_80%,transparent)] backdrop-blur-md animate-fade-in">
          <div className="panel w-full max-w-xl overflow-hidden shadow-2xl flex flex-col bg-[var(--color-surface-raised)] border-[var(--color-hairline-strong)]">
            <div className="panel-header bg-[var(--color-surface)]">
              <div>
                <span className="eyebrow text-[var(--color-ember)] uppercase tracking-widest block mb-0.5">State Authorization</span>
                <h3 className="panel-title">Department Availability Matrix</h3>
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5 font-[var(--font-mono)] uppercase">{provisionModalModel.name} ({provisionModalModel.version})</p>
              </div>
              <button
                onClick={() => setProvisionModalModel(null)}
                className="btn btn-secondary btn-icon btn-sm"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="panel-body space-y-[var(--sp-4)]">
              <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed">
                Toggle which departments have central authorization to deploy this AI capability to their cameras.
              </p>

              <div className="space-y-[var(--sp-2)]">
                {allDepartments.map(dept => {
                  const isAvailable = provisionModalModel.availableTo.includes(dept);
                  return (
                    <div
                      key={dept}
                      className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-between hover:border-[var(--color-hairline-strong)] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-[var(--color-ink)] font-semibold">
                        <Buildings size={18} className="text-[var(--color-ember)]" />
                        <span className="text-[13px]">{dept}</span>
                      </div>

                      <button
                        onClick={() => toggleDeptAvailability(provisionModalModel.id, dept)}
                        className={cn(
                          "btn btn-sm min-w-[100px]",
                          isAvailable 
                            ? "btn-ember" 
                            : "btn-secondary"
                        )}
                      >
                        {isAvailable ? 'Authorized' : 'Restricted'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Boundary reminder */}
              <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--color-high)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-high)_20%,transparent)] flex items-start gap-3 text-[12px] text-[var(--color-ink-secondary)]">
                <LockKey size={18} className="text-[var(--color-high)] shrink-0 mt-0.5" weight="fill" />
                <p>
                  Once authorized by Central, the department operational team decides which specific cameras receive this model and manages local detection parameters.
                </p>
              </div>
            </div>

            <div className="panel-body border-t border-[var(--color-hairline)] flex items-center justify-end bg-[var(--color-surface)]">
              <button
                onClick={() => setProvisionModalModel(null)}
                className="btn btn-ember"
              >
                Save Availability Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FULL CAPABILITY SPECIFICATION */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[color-mix(in_srgb,var(--color-canvas)_80%,transparent)] backdrop-blur-md animate-fade-in">
          <div className="panel w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col bg-[var(--color-surface-raised)] border-[var(--color-hairline-strong)]">
            <div className="panel-header bg-[var(--color-surface)]">
              <div>
                <span className="eyebrow text-[var(--color-ember)] uppercase tracking-widest block mb-0.5">Model Specification</span>
                <h3 className="panel-title">{selectedModel.name}</h3>
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5 font-[var(--font-mono)] uppercase">{selectedModel.version} · Category: {selectedModel.category}</p>
              </div>
              <button
                onClick={() => setSelectedModel(null)}
                className="btn btn-secondary btn-icon btn-sm"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="panel-body space-y-[var(--sp-6)] overflow-y-auto max-h-[70vh]">
              <div>
                <h4 className="eyebrow uppercase tracking-wider mb-3">Description & Architecture</h4>
                <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed bg-[var(--color-surface)] p-[var(--sp-4)] rounded-[var(--r-md)] border border-[var(--color-hairline)]">
                  {selectedModel.description}
                </p>
              </div>

              <div>
                <h4 className="eyebrow uppercase tracking-wider mb-3">Validated Capabilities</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedModel.capabilities.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-[var(--sp-3)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[12px] text-[var(--color-ink)] font-semibold">
                      <CheckCircle size={16} className="text-[var(--color-online)]" weight="fill" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="eyebrow uppercase tracking-wider mb-3">Benchmark Performance Metrics</h4>
                <div className="grid grid-cols-4 gap-[var(--sp-3)]">
                  <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)]">
                    <span className="eyebrow uppercase block mb-1">Precision</span>
                    <span className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{selectedModel.performance.precision}%</span>
                  </div>
                  <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)]">
                    <span className="eyebrow uppercase block mb-1">Recall</span>
                    <span className="text-[16px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{selectedModel.performance.recall}%</span>
                  </div>
                  <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)]">
                    <span className="eyebrow uppercase block mb-1">F1-score</span>
                    <span className="text-[16px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{selectedModel.performance.f1Score}%</span>
                  </div>
                  <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)]">
                    <span className="eyebrow uppercase block mb-1">Inference</span>
                    <span className="text-[16px] font-semibold text-[var(--color-online)] font-[var(--font-mono)]">{selectedModel.performance.inferenceMs} ms</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-body border-t border-[var(--color-hairline)] flex items-center justify-between bg-[var(--color-surface)]">
              <button
                onClick={() => setSelectedModel(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setProvisionModalModel(selectedModel);
                  setSelectedModel(null);
                }}
                className="btn btn-ember"
              >
                Provision to Departments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
