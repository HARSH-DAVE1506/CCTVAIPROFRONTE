import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Gear, 
  ShieldCheck, 
  HardDrives, 
  ShareNetwork, 
  LockKey, 
  FileText, 
  CheckCircle, 
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Warning,
  ArrowsClockwise
} from '@phosphor-icons/react';

export const CentralSettings: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'PLATFORM' | 'SECURITY' | 'GOVERNANCE' | 'INFRASTRUCTURE' | 'INTEGRATIONS' | 'AUDIT'>('PLATFORM');
  const [faceBlurring, setFaceBlurring] = useState(true);
  const [minAccuracyThreshold, setMinAccuracyThreshold] = useState(90);
  const [retentionHotDays, setRetentionHotDays] = useState(30);
  const [vahanSync, setVahanSync] = useState(true);
  const [cctnsSync, setCctnsSync] = useState(true);

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">State Platform Settings</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              CENTRAL ADMINISTRATION
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            State-level system architecture, cryptographic policies, and inter-department governance controls.
          </p>
        </div>

        <div className="badge badge-online px-4 py-2 font-[var(--font-mono)] text-[11px] uppercase tracking-wider font-bold">
          Policy Engine: Strict Enforcement
        </div>
      </header>

      {/* Explicit Central Governance vs Department Boundary */}
      <div className="panel p-[var(--sp-6)] flex items-start gap-5 bg-[color-mix(in_srgb,var(--color-ember)_4%,var(--color-surface-raised))] border-[color-mix(in_srgb,var(--color-ember)_30%,transparent)]">
        <div className="w-12 h-12 rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[color-mix(in_srgb,var(--color-ember)_20%,transparent)] text-[var(--color-ember)] flex items-center justify-center shrink-0">
          <LockKey size={26} weight="fill" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-[14px] font-semibold text-[var(--color-ink)] uppercase tracking-wider">Central Governance vs. Department Operational Autonomy</h4>
          <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed">
            Central Settings control platform-wide compute quotas, cryptographic standards, AI certification thresholds, and state integration gateways. Department-specific alert thresholds, camera grouping schemes, zone boundary rules, operator shifts, and investigative dispatch protocols remain strictly under the control of individual Department Settings.
          </p>
        </div>
      </div>

      {/* Main Settings Panel with Left Navigation */}
      <div className="grid grid-cols-12 gap-[var(--sp-6)] items-start">
        {/* Left Navigation */}
        <div className="col-span-3 panel p-[var(--sp-3)] bg-[var(--color-surface-raised)] space-y-1">
          {[
            { id: 'PLATFORM', label: 'Platform & Cluster', icon: Gear },
            { id: 'SECURITY', label: 'Security & State SSO', icon: ShieldCheck },
            { id: 'GOVERNANCE', label: 'AI Ethics & Governance', icon: SlidersHorizontal },
            { id: 'INFRASTRUCTURE', label: 'Compute & Storage Tiers', icon: HardDrives },
            { id: 'INTEGRATIONS', label: 'Government Gateways', icon: ShareNetwork },
            { id: 'AUDIT', label: 'Cryptographic Audit Trail', icon: FileText }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-[var(--r-md)] text-[12px] font-bold transition-all text-left uppercase tracking-wider",
                  isActive 
                    ? "bg-[var(--color-ember)] text-white shadow-md" 
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                )}
              >
                <Icon size={18} weight={isActive ? 'fill' : 'bold'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Body */}
        <div className="col-span-9 panel bg-[var(--color-surface-raised)] overflow-hidden min-h-[600px]">
          <div className="panel-body p-[var(--sp-8)] space-y-[var(--sp-8)]">
            {activeCategory === 'PLATFORM' && (
              <div className="space-y-[var(--sp-8)] animate-fade-in">
                <div>
                  <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-1">Statewide Platform Parameters</h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] font-medium">Core system identification and sovereign hosting cluster configuration.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-2">
                    <label className="eyebrow uppercase block">Platform identity</label>
                    <input
                      type="text"
                      disabled
                      value="Caksham AI Statewide Intelligence Operating System"
                      className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-3 py-2 text-[var(--color-ink)] font-[var(--font-mono)] text-[12px] focus:outline-none"
                    />
                  </div>
                  <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-2">
                    <label className="eyebrow uppercase block">Hosting environment</label>
                    <input
                      type="text"
                      disabled
                      value="Gujarat Production Node - Gandhinagar Secure Cloud Zone"
                      className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-3 py-2 text-[var(--color-ink)] font-[var(--font-mono)] text-[12px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-semibold text-[var(--color-ink)] text-[15px] block">Multi-Tenancy Isolation Mode</span>
                    <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 font-medium leading-relaxed">Strict cryptographic tenant isolation across all participating departments.</p>
                  </div>
                  <span className="badge badge-online px-4 py-1.5 font-[var(--font-mono)] font-bold text-[11px] uppercase tracking-wider border">
                    Enforced (Level 4)
                  </span>
                </div>
              </div>
            )}

            {activeCategory === 'SECURITY' && (
              <div className="space-y-[var(--sp-8)] animate-fade-in">
                <div>
                  <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-1">State SSO & Access Security</h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] font-medium">Identity federation with national e-Pramaan and multi-tier RBAC rules.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-between shadow-sm">
                    <div>
                      <span className="font-semibold text-[var(--color-ink)] text-[15px] block">e-Pramaan State SSO Federation</span>
                      <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 font-medium">Require multi-factor cryptographic smart card or Aadhaar OTP authentication.</p>
                    </div>
                    <span className="badge badge-online px-4 py-1.5 font-[var(--font-mono)] font-bold text-[11px] uppercase tracking-wider border">Active</span>
                  </div>

                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-between shadow-sm">
                    <div>
                      <span className="font-semibold text-[var(--color-ink)] text-[15px] block">Session Idle Timeout</span>
                      <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 font-medium">Automatically locks operational terminals during inactivity.</p>
                    </div>
                    <span className="text-[var(--color-ink)] font-[var(--font-mono)] font-bold text-[14px]">15 MINUTES</span>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'GOVERNANCE' && (
              <div className="space-y-[var(--sp-8)] animate-fade-in">
                <div>
                  <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-1">AI Ethics & Quality Gates</h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] font-medium">Mandatory verification standards required before any model can be certified.</p>
                </div>

                <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-semibold text-[var(--color-ink)] text-[15px] block">Automated Face Redaction on Non-Tactical Feeds</span>
                    <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 font-medium max-w-md">Blurs civilian faces on public square and transit overview streams to protect privacy.</p>
                  </div>
                  <button onClick={() => setFaceBlurring(!faceBlurring)} className="transition-transform hover:scale-110 active:scale-95">
                    {faceBlurring ? (
                      <ToggleRight size={44} weight="fill" className="text-[var(--color-ember)]" />
                    ) : (
                      <ToggleLeft size={44} weight="fill" className="text-[var(--color-hairline-strong)]" />
                    )}
                  </button>
                </div>

                <div className="p-[var(--sp-6)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--color-ink)] text-[15px]">Minimum Model Precision Benchmark</span>
                    <span className="text-[var(--color-ember)] font-[var(--font-mono)] font-bold text-[18px]">{minAccuracyThreshold}% mAP</span>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={99}
                    value={minAccuracyThreshold}
                    onChange={(e) => setMinAccuracyThreshold(Number(e.target.value))}
                    className="w-full accent-[var(--color-ember)] cursor-pointer"
                  />
                  <span className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider block">Models scoring beneath this threshold cannot be promoted to Registry.</span>
                </div>
              </div>
            )}

            {activeCategory === 'INFRASTRUCTURE' && (
              <div className="space-y-[var(--sp-8)] animate-fade-in">
                <div>
                  <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-1">Compute Nodes & Video Retention Policy</h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] font-medium">Statewide edge gateway quotas and video archiving storage lifecycle.</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-2 shadow-sm text-center">
                    <span className="eyebrow uppercase block text-[10px]">Hot NVMe cache</span>
                    <span className="text-[24px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">{retentionHotDays} DAYS</span>
                    <span className="text-[11px] text-[var(--color-ink-muted)] block font-bold uppercase">Instant playback</span>
                  </div>
                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-2 shadow-sm text-center">
                    <span className="eyebrow uppercase block text-[10px]">Warm object storage</span>
                    <span className="text-[24px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">90 DAYS</span>
                    <span className="text-[11px] text-[var(--color-ink-muted)] block font-bold uppercase">Searchable metadata</span>
                  </div>
                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-2 shadow-sm text-center">
                    <span className="eyebrow uppercase block text-[10px]">Cold evidence vault</span>
                    <span className="text-[24px] font-bold text-[var(--color-ember)] font-[var(--font-mono)]">7 YEARS</span>
                    <span className="text-[11px] text-[var(--color-ink-muted)] block font-bold uppercase tracking-tighter">Cryptographic sealed</span>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'INTEGRATIONS' && (
              <div className="space-y-[var(--sp-8)] animate-fade-in">
                <div>
                  <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-1">Inter-Governmental Data Gateways</h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] font-medium">Active integrations with national police and transport databases.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-between shadow-sm">
                    <div>
                      <span className="font-semibold text-[var(--color-ink)] text-[15px] block">Vahan & Sarathi National Vehicle Registry</span>
                      <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 font-medium">Live optical plate lookup and stolen vehicle mismatch alerts.</p>
                    </div>
                    <button onClick={() => setVahanSync(!vahanSync)} className="transition-transform hover:scale-110 active:scale-95">
                      {vahanSync ? <ToggleRight size={44} weight="fill" className="text-[var(--color-ember)]" /> : <ToggleLeft size={44} weight="fill" className="text-[var(--color-hairline-strong)]" />}
                    </button>
                  </div>

                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-between shadow-sm">
                    <div>
                      <span className="font-semibold text-[var(--color-ink)] text-[15px] block">CCTNS Criminal Database Synchronization</span>
                      <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 font-medium">Secure criminal record correlation for police tactical units.</p>
                    </div>
                    <button onClick={() => setCctnsSync(!cctnsSync)} className="transition-transform hover:scale-110 active:scale-95">
                      {cctnsSync ? <ToggleRight size={44} weight="fill" className="text-[var(--color-ember)]" /> : <ToggleLeft size={44} weight="fill" className="text-[var(--color-hairline-strong)]" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'AUDIT' && (
              <div className="space-y-[var(--sp-8)] animate-fade-in">
                <div>
                  <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-1">Statewide Cryptographic Audit Ledger</h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] font-medium">Immutable log of all model authorizations, policy adjustments, and cross-department exports.</p>
                </div>

                <div className="panel overflow-hidden bg-[var(--color-surface)] border-[var(--color-hairline-strong)]">
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Actor</th>
                          <th>Action</th>
                          <th>Cryptographic Digest</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-[var(--color-ink-muted)] font-[var(--font-mono)] font-bold">2026-09-01 14:48:12</td>
                          <td className="font-semibold text-[var(--color-ink)]">Central Governor</td>
                          <td className="text-[var(--color-ember)] font-bold">Approved Weapon Intelligence v1.0.0</td>
                          <td className="text-[var(--color-ink-muted)] font-[var(--font-mono)] truncate max-w-[140px] text-[10px]">sha256:1904ea88c...</td>
                        </tr>
                        <tr>
                          <td className="text-[var(--color-ink-muted)] font-[var(--font-mono)] font-bold">2026-09-01 13:20:05</td>
                          <td className="font-semibold text-[var(--color-ink)]">Police Superintendent</td>
                          <td className="text-[var(--color-ink)] font-bold">Deployed Vehicle Intel to Ahmedabad</td>
                          <td className="text-[var(--color-ink-muted)] font-[var(--font-mono)] truncate max-w-[140px] text-[10px]">sha256:7f9a88c2e...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  onClick={() => alert('Exporting full cryptographically signed audit ledger for state legislative oversight.')}
                  className="btn btn-ember"
                >
                  <ArrowsClockwise size={18} weight="bold" />
                  <span>Export Signed State Audit Ledger (.p7b)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
