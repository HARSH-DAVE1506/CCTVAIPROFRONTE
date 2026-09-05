import React from 'react';
import { MODELS } from '../../data';
import { cn } from '../../lib/utils';
import { 
  RocketLaunch, 
  CheckCircle, 
  Pulse, 
  ShieldCheck, 
  ChatsCircle, 
  Cpu,
  Plus,
  Monitor,
  Gear,
  Trash
} from '@phosphor-icons/react';

export const AIModelManagement: React.FC = () => {
  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">AI capabilities</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              DEPARTMENT LICENSES
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Deploy and configure centrally approved AI capabilities for your department's sensors.
          </p>
        </div>
      </header>

      <div className="flex items-center gap-1.5 p-1.5 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] shadow-sm w-fit">
         {['Available', 'Installed', 'Running', 'Updates'].map((tab, i) => (
           <button key={tab} className={cn(
             "px-6 py-2 rounded-[var(--r-sm)] text-[11px] font-bold uppercase transition-all tracking-wider",
             i === 0 ? "bg-[var(--color-ember)] text-white shadow-md" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
           )}>{tab}</button>
         ))}
      </div>

      <div className="grid grid-cols-3 gap-[var(--sp-6)]">
         {MODELS.map((model) => (
           <div key={model.id} className="panel bg-[var(--color-surface-raised)] p-[var(--sp-6)] flex flex-col group hover:shadow-xl transition-all border-[var(--color-hairline-strong)] shadow-md">
              <div className="flex items-start justify-between mb-8">
                 <div className="w-14 h-14 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-ember)] shadow-sm group-hover:border-[var(--color-ember)]/30 transition-all">
                    {model.id === 'vlm-intel' ? <ChatsCircle size={28} weight="fill" /> : model.id === 'abandoned-object' ? <ShieldCheck size={28} weight="fill" /> : <Pulse size={28} weight="fill" />}
                 </div>
                 <div className="text-right">
                    <span className="badge badge-online font-[var(--font-mono)] font-bold px-2 py-1 uppercase tracking-widest text-[9px] mb-2">INSTALLED</span>
                    <p className="text-[11px] text-[var(--color-ink-muted)] font-[var(--font-mono)] font-bold opacity-60">VER {model.version}</p>
                 </div>
              </div>

              <h3 className="text-[20px] font-bold text-[var(--color-ink)] mb-3 tracking-tight group-hover:text-[var(--color-ember)] transition-colors">{model.name}</h3>
              <p className="text-[13px] text-[var(--color-ink-secondary)] leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2 font-medium opacity-80">
                {model.description}
              </p>

              <div className="panel p-[var(--sp-4)] bg-[var(--color-surface)] border border-[var(--color-hairline)] mb-8 shadow-inner">
                 <div className="flex items-center justify-between mb-3">
                    <span className="eyebrow uppercase tracking-[0.2em] font-bold text-[9px]">Active deployments</span>
                    <span className="text-[11px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">42 CAMERAS</span>
                 </div>
                 <div className="h-1.5 bg-[var(--color-hairline-strong)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-ember)] w-2/3 shadow-[0_0_8px_var(--color-ember)]" />
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button className="btn btn-ember flex-1 h-12">
                   <span>Deploy capability</span>
                 </button>
                 <button className="btn btn-secondary w-12 h-12 p-0 flex items-center justify-center">
                    <Gear size={20} weight="bold" />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
