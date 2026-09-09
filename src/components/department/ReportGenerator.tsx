import React from 'react';
import { cn } from '../../lib/utils';
import { 
  FileText, 
  DownloadSimple, 
  Clock, 
  Selection, 
  CaretRight,
  ChartBar,
  ShieldCheck,
  VideoCamera,
  Archive
} from '@phosphor-icons/react';

export const ReportGenerator: React.FC = () => {
  const reports = [
    { title: 'Vehicle Intelligence Report', type: 'System', date: '1 Sep 2026', id: 'REP-V-001', icon: VideoCamera },
    { title: 'Investigation: INV-000421', type: 'Investigation', date: '31 Aug 2026', id: 'REP-I-421', icon: ShieldCheck },
    { title: 'Daily Alert Summary', type: 'System', date: '31 Aug 2026', id: 'REP-D-992', icon: ChartBar },
  ];

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1200px] mx-auto pb-12">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Operational intelligence outputs</h2>
            <span className="badge badge-accent font-[var(--font-mono)] text-[10px]">
              CAKSHAM AI · REPORT CENTER
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            <span className="font-semibold text-[var(--color-ink)]">Caksham AI</span>: <span className="italic text-[var(--color-ink-muted)]">"Vision That Understands Too"</span> — Generate and audit operational intelligence outputs, investigation dossiers, and chain-of-custody logs.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-[var(--sp-8)]">
         {/* Report Templates */}
         <div className="col-span-8 space-y-[var(--sp-4)]">
            <h3 className="eyebrow uppercase tracking-[0.2em] font-bold text-[10px] mb-6 pl-1 opacity-70">AVAILABLE TEMPLATES</h3>
            <div className="grid grid-cols-2 gap-[var(--sp-4)]">
               {[
                 { name: 'Investigation Summary', desc: 'Comprehensive dossiers containing entities, timelines, and connected evidence.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                 { name: 'Vehicle Journey Report', desc: 'Reconstructed paths, plate observations, and behavioral metadata.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                 { name: 'Alert Audit Log', desc: 'Full history of alert lifecycle events and operator remediation actions.', color: 'text-red-500', bg: 'bg-red-500/10' },
                 { name: 'Camera Health Analytics', desc: 'Connectivity uptime trends and degradation history reports.', color: 'text-green-500', bg: 'bg-green-500/10' },
               ].map((temp) => (
                 <div key={temp.name} className="panel bg-[var(--color-surface-raised)] p-[var(--sp-6)] flex flex-col group hover:shadow-xl transition-all border-[var(--color-hairline-strong)] shadow-md">
                    <div className={cn("w-12 h-12 rounded-[var(--r-md)] flex items-center justify-center border transition-all mb-6 shadow-sm", temp.bg, temp.color, "border-current/20")}>
                       <FileText size={24} weight="bold" />
                    </div>
                    <h4 className="text-[16px] font-bold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-ember)] transition-colors tracking-tight">{temp.name}</h4>
                    <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed mb-8 h-10 overflow-hidden line-clamp-2 font-medium opacity-80">{temp.desc}</p>
                    <button className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-ember)] uppercase tracking-[0.15em] transition-all group/btn">
                      <span>Configure report</span>
                      <CaretRight weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Recent Reports */}
         <div className="col-span-4 h-fit sticky top-6">
            <h3 className="eyebrow uppercase tracking-[0.2em] font-bold text-[10px] mb-6 pl-1 opacity-70">RECENTLY GENERATED</h3>
            <div className="panel bg-[var(--color-surface-raised)] p-[var(--sp-5)] border-[var(--color-hairline-strong)] shadow-md space-y-4">
              <div className="space-y-4">
                 {reports.map((rep) => (
                   <div key={rep.id} className="p-4 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-ember)]/20 transition-all group cursor-pointer relative overflow-hidden shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-10 h-10 rounded-[var(--r-sm)] bg-[var(--color-surface-raised)] flex items-center justify-center text-[var(--color-ink-muted)] border border-[var(--color-hairline)] group-hover:text-[var(--color-ember)] transition-colors shadow-inner">
                            <rep.icon size={18} weight="fill" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-bold text-[var(--color-ink)] leading-tight mb-1 truncate">{rep.title}</h4>
                            <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider">{rep.id}</span>
                         </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[var(--color-ink-muted)] font-bold pt-4 border-t border-[var(--color-hairline)]">
                         <span className="uppercase tracking-widest">{rep.date}</span>
                         <button className="w-8 h-8 flex items-center justify-center rounded-[var(--r-sm)] hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-all">
                           <DownloadSimple weight="bold" size={16} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="btn btn-secondary w-full h-11 uppercase tracking-[0.2em] text-[10px]">
                <Archive weight="bold" size={16} />
                <span>View report archive</span>
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};
