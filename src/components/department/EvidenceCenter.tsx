import React from 'react';
import { EVIDENCE_LIST } from '../../data';
import { cn } from '../../lib/utils';
import { 
  MagnifyingGlass, 
  Funnel, 
  DownloadSimple, 
  Plus, 
  Clock, 
  ShieldCheck, 
  DotsThree,
  Eye,
  FileText
} from '@phosphor-icons/react';

export const EvidenceCenter: React.FC = () => {
  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Intelligence artifacts</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              EVIDENCE REPOSITORY
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Centralized intelligence artifacts generated from AI events and investigations.
          </p>
        </div>
        <button className="btn btn-secondary h-11 px-6 group">
          <DownloadSimple size={18} weight="bold" className="group-hover:text-[var(--color-ember)] transition-colors" />
          <span>Bulk export repository</span>
        </button>
      </header>

      <div className="panel bg-[var(--color-surface-raised)] p-[var(--sp-4)] flex items-center justify-between gap-6 shadow-md border-[var(--color-hairline-strong)]">
        <div className="flex-1 relative group">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-lg group-focus-within:text-[var(--color-ember)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Evidence ID, camera, or AI model signature..."
            className="w-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] py-2.5 pl-12 pr-4 text-[13px] font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
           <button className="btn btn-secondary py-2.5 px-4 flex items-center gap-2">
              <Funnel size={16} weight="bold" />
              <span>Filter artifacts</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[var(--sp-6)]">
         {EVIDENCE_LIST.map((ev) => (
           <div key={ev.id} className="panel bg-[var(--color-surface-raised)] p-0 flex flex-col group hover:shadow-xl transition-all relative overflow-hidden border-[var(--color-hairline-strong)] shadow-md">
              <div className="aspect-video relative overflow-hidden bg-black shadow-inner">
                 <img src={ev.imageUrl} alt={ev.id} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute top-3 left-3 px-2 py-1 rounded-[var(--r-sm)] bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase border border-white/10 tracking-widest">
                    {ev.type}
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/30 backdrop-blur-[1px]">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                      <Eye size={22} weight="bold" className="text-black" />
                    </div>
                 </div>
              </div>

              <div className="p-[var(--sp-5)] space-y-5">
                 <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--color-ember)] font-[var(--font-mono)] tracking-widest uppercase">{ev.id}</span>
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold">{ev.timestamp}</span>
                 </div>
                 
                 <div>
                    <h4 className="text-[15px] font-bold text-[var(--color-ink)] mb-1.5 tracking-tight group-hover:text-[var(--color-ember)] transition-colors">{ev.model}</h4>
                    <p className="eyebrow uppercase tracking-[0.2em] text-[9px] font-bold opacity-60">Source: {ev.cameraId}</p>
                 </div>

                 <div className="flex items-center justify-between pt-[var(--sp-4)] border-t border-[var(--color-hairline)]">
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="text-[var(--color-online)]" size={16} weight="bold" />
                       <span className="text-[11px] font-bold text-[var(--color-ink-muted)] font-[var(--font-mono)] uppercase tracking-tighter">{ev.confidence}% match confidence</span>
                    </div>
                    <button className="p-2 rounded-[var(--r-md)] hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-all">
                       <DotsThree size={22} weight="bold" />
                    </button>
                 </div>
              </div>
           </div>
         ))}
         
         {/* Export Action Card */}
         <div className="panel bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-hairline-strong)] p-10 flex flex-col items-center justify-center group hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-ember)]/40 cursor-pointer transition-all shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 rounded-[var(--r-lg)] bg-[var(--color-surface-raised)] flex items-center justify-center text-[var(--color-ink-muted)] group-hover:text-[var(--color-ember)] group-hover:bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] group-hover:scale-110 transition-all border border-[var(--color-hairline)] group-hover:border-[var(--color-ember)]/30 mb-5 shadow-sm">
               <FileText size={28} weight="bold" />
            </div>
            <p className="text-[13px] font-bold text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-colors uppercase tracking-[0.2em]">Import artifact</p>
         </div>
      </div>
    </div>
  );
};
