import React, { useState } from 'react';
import { MODEL_REGISTRY_ENTRIES } from '../../stateData';
import { ModelRegistryItem } from '../../types';
import { cn } from '../../lib/utils';
import { 
  Stack, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  FileCode, 
  ArrowSquareOut, 
  LockKey, 
  Warning, 
  ArrowsCounterClockwise, 
  Storefront,
  MagnifyingGlass,
  X,
  FileText
} from '@phosphor-icons/react';

export const ModelRegistry: React.FC = () => {
  const [entries, setEntries] = useState<ModelRegistryItem[]>(MODEL_REGISTRY_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<ModelRegistryItem | null>(null);

  const filteredEntries = entries.filter(e => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.version.toLowerCase().includes(q) || e.sha256Hash.toLowerCase().includes(q);
    }
    return true;
  });

  const handlePromoteToMarketplace = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'PUBLISHED' } : e));
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry(prev => prev ? { ...prev, status: 'PUBLISHED' } : null);
    }
    alert('Model version promoted to Central AI Marketplace. Departments can now request provisioning.');
  };

  const handleDeprecate = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'DEPRECATED' } : e));
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry(prev => prev ? { ...prev, status: 'DEPRECATED' } : null);
    }
  };

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Model Registry</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              AUTHORITATIVE REPOSITORY
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Cryptographic ledger of verified AI model versions, audit hashes, and court-admissible evidence traces.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] bg-[var(--color-surface)] border border-[var(--color-hairline)] px-4 py-2 rounded-[var(--r-md)] uppercase tracking-wider font-bold">
          <span>Flow: Studio → <strong className="text-[var(--color-ink)]">Registry</strong> → Marketplace → Departments</span>
        </div>
      </header>

      {/* Forensic Evidence Callout Banner */}
      <div className="panel p-[var(--sp-6)] flex items-start gap-5 bg-[var(--color-surface-raised)] border-[var(--color-hairline-strong)]">
        <div className="w-12 h-12 rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[var(--color-ember)] flex items-center justify-center shrink-0">
          <ShieldCheck size={28} weight="fill" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-[14px] font-semibold text-[var(--color-ink)] uppercase tracking-wider">Mandatory cryptographic audit traces</h4>
          <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed">
            Under government evidentiary rules, any automated alert or video evidence submitted in court must be traceable back to an exact, immutable model build hash (<span className="font-[var(--font-mono)] text-[var(--color-ember)] font-bold">SHA-256</span>). The Model Registry ensures every detection event records precisely which certified weights and runtime binary produced it.
          </p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="panel bg-[var(--color-surface-raised)] overflow-hidden">
        <div className="panel-header bg-[var(--color-surface)]">
          <div className="flex-1 relative group max-w-md">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-[16px] group-focus-within:text-[var(--color-ember)] transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, SHA-256 hash, release..."
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] py-2 pl-11 pr-4 text-[12px] focus:outline-none focus:border-[var(--color-ember)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
            />
          </div>

          <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider">
            {filteredEntries.length} Certified Artifacts Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model & Version</th>
                <th>Status</th>
                <th>Deployment scale</th>
                <th>Cryptographic hash</th>
                <th>Release date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedEntry(item)}
                  className="cursor-pointer group"
                >
                  <td>
                    <div className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-ember)] transition-colors">
                      {item.name}
                    </div>
                    <div className="font-[var(--font-mono)] text-[10px] text-[var(--color-ink-muted)] uppercase tracking-tight font-bold mt-0.5">{item.version} · {item.category}</div>
                  </td>

                  <td>
                    <span className={cn(
                      "badge",
                      item.status === 'DEPLOYED' ? "badge-online" :
                      item.status === 'PUBLISHED' ? "badge-accent" :
                      item.status === 'VALIDATION' ? "badge-ember" :
                      "badge-secondary"
                    )}>
                      {item.status}
                    </span>
                  </td>

                  <td className="font-[var(--font-mono)] text-[var(--color-ink)] font-semibold">
                    {item.deployedCameras > 0 ? (
                      <span className="text-[var(--color-ember)]">{item.deployedCameras.toLocaleString()} cameras</span>
                    ) : (
                      <span className="opacity-40">0 (Validation)</span>
                    )}
                  </td>

                  <td className="font-[var(--font-mono)] text-[10px] text-[var(--color-ink-muted)] truncate max-w-[180px]" title={item.sha256Hash}>
                    {item.sha256Hash}
                  </td>

                  <td className="text-[var(--color-ink-secondary)] font-[var(--font-mono)] font-semibold">
                    {item.releaseDate}
                  </td>

                  <td className="text-right">
                    <span className="text-[var(--color-ember)] font-bold group-hover:underline text-[11px] inline-flex items-center gap-1.5 uppercase tracking-wider">
                      Audit Trace <ArrowSquareOut size={12} weight="bold" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL: AUDIT TRACE & VERSION CONTROL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[color-mix(in_srgb,var(--color-canvas)_80%,transparent)] backdrop-blur-md animate-fade-in">
          <div className="panel w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col bg-[var(--color-surface-raised)] border-[var(--color-hairline-strong)]">
            <div className="panel-header bg-[var(--color-surface)]">
              <div>
                <span className="eyebrow text-[var(--color-ember)] uppercase tracking-widest block mb-0.5">Cryptographic Ledger Item</span>
                <h3 className="panel-title">{selectedEntry.name} (v{selectedEntry.version})</h3>
                <p className="text-[11px] text-[var(--color-ink-muted)] font-[var(--font-mono)] mt-0.5 font-bold uppercase">{selectedEntry.id} · Certified: {selectedEntry.releaseDate}</p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="btn btn-secondary btn-icon btn-sm"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="panel-body space-y-[var(--sp-6)] overflow-y-auto max-h-[70vh]">
              {/* Immutable Hash Box */}
              <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-2">
                <span className="eyebrow text-[var(--color-ember)] uppercase tracking-widest block font-bold">
                  Immutable hash (SHA-256)
                </span>
                <p className="font-[var(--font-mono)] text-[var(--color-ink)] break-all select-all bg-[var(--color-surface-raised)] p-3 rounded-[var(--r-md)] text-[12px] border border-[var(--color-hairline)] leading-relaxed">
                  {selectedEntry.sha256Hash}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow uppercase block">Approved by authority</span>
                  <span className="text-[14px] text-[var(--color-ink)] font-semibold">{selectedEntry.approvedBy}</span>
                </div>
                <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow uppercase block">Benchmark dataset</span>
                  <span className="text-[14px] text-[var(--color-ink)] font-semibold">{selectedEntry.testedDataset}</span>
                </div>
                <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow uppercase block">Deployed cameras</span>
                  <span className="text-[14px] text-[var(--color-ember)] font-[var(--font-mono)] font-bold">{selectedEntry.deployedCameras.toLocaleString()}</span>
                </div>
                <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                  <span className="eyebrow uppercase block">Total events generated</span>
                  <span className="text-[14px] text-[var(--color-ink)] font-[var(--font-mono)] font-bold">{selectedEntry.eventsGenerated.toLocaleString()}</span>
                </div>
              </div>

              {/* Department distribution */}
              <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-3">
                <span className="eyebrow uppercase tracking-widest block">
                  Authoritative department utilization
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.associatedDepartments.map(dept => (
                    <span key={dept} className="badge badge-accent px-3 py-1 font-bold">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="panel-body border-t border-[var(--color-hairline)] bg-[var(--color-surface)] flex items-center justify-between">
              <button
                onClick={() => handleDeprecate(selectedEntry.id)}
                className="btn btn-secondary text-[var(--color-critical)] font-bold"
              >
                Mark as Deprecated
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                {selectedEntry.status !== 'DEPLOYED' && selectedEntry.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePromoteToMarketplace(selectedEntry.id)}
                    className="btn btn-ember"
                  >
                    <Storefront size={18} weight="bold" />
                    <span>Publish to Marketplace</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
