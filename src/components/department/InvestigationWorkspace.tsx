import React from 'react';
import { INVESTIGATIONS } from '../../data';
import { cn } from '../../lib/utils';
import { MapView } from '../map/MapView';
import { 
  MagnifyingGlass, 
  Pulse, 
  MapTrifold, 
  FileText, 
  CaretRight, 
  Plus, 
  Clock, 
  ShieldCheck, 
  UserCircle,
  VideoCamera,
  DownloadSimple
} from '@phosphor-icons/react';

export const InvestigationWorkspace: React.FC = () => {
  const activeInv = INVESTIGATIONS[0];

  return (
    <div className="h-full flex flex-col space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">Investigation</h2>
          <span className="badge badge-accent font-[var(--font-mono)] font-bold tracking-widest px-3 py-1.5 uppercase">
            {activeInv.id}
          </span>
        </div>
        <div className="flex items-center gap-3">
           <button className="btn btn-secondary">
             <DownloadSimple size={18} weight="bold" />
             <span>Export evidence</span>
           </button>
           <button className="btn btn-ember">
             <FileText size={18} weight="bold" />
             <span>Generate report</span>
           </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Panel: Entities & Info */}
        <div className="col-span-3 space-y-6 flex flex-col min-h-0">
           <div className="panel bg-[var(--color-surface-raised)] flex-1 overflow-hidden flex flex-col shadow-lg">
              <div className="panel-header bg-[var(--color-surface)]">
                <h3 className="panel-title uppercase tracking-wider">Investigative entities</h3>
              </div>
              <div className="panel-body flex-1 overflow-y-auto space-y-3 p-[var(--sp-4)]">
                 {activeInv.entities.map((entity, i) => (
                   <div key={i} className="panel p-[var(--sp-4)] bg-[var(--color-surface)] border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all cursor-pointer group shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-9 h-9 rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-ember)_20%,transparent)] flex items-center justify-center text-[var(--color-ember)]">
                            <Pulse size={18} weight="fill" />
                         </div>
                         <span className="text-[13px] font-semibold text-[var(--color-ink)]">{entity}</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-ink-muted)] font-medium">Detected at Central Bus Station</p>
                   </div>
                 ))}
                 <button className="w-full py-4 rounded-[var(--r-md)] border border-dashed border-[var(--color-hairline-strong)] text-[11px] font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-all uppercase tracking-wider">
                   + Add entity to case
                 </button>
              </div>
           </div>

           <div className="panel p-[var(--sp-5)] bg-[var(--color-surface-raised)] shadow-md">
              <span className="eyebrow uppercase tracking-widest block mb-4 font-bold text-[var(--color-ink-muted)]">Lead investigator</span>
              <div className="flex items-center gap-4">
                 <div className="relative">
                   <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=64&auto=format&fit=crop" className="w-11 h-11 rounded-full object-cover ring-2 ring-[var(--color-hairline)] ring-offset-2 ring-offset-[var(--color-surface-raised)]" alt="Owner" />
                   <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-[var(--color-online)] border-2 border-[var(--color-surface-raised)] shadow-sm" />
                 </div>
                 <div>
                    <p className="text-[14px] font-bold text-[var(--color-ink)] leading-tight">{activeInv.owner}</p>
                    <p className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider mt-0.5">Tactical division</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Center: Timeline */}
        <div className="col-span-5 panel bg-[var(--color-surface-raised)] flex flex-col min-h-0 shadow-xl border-[var(--color-hairline-strong)]">
           <div className="panel-header bg-[var(--color-surface)] border-b border-[var(--color-hairline)]">
              <h3 className="panel-title uppercase tracking-wider">Event chain timeline</h3>
              <Clock size={18} className="text-[var(--color-ink-muted)]" />
           </div>
           
           <div className="panel-body flex-1 overflow-y-auto space-y-0 relative pl-6 pr-6 pt-6">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--color-hairline-strong)]" />
              {activeInv.timeline.map((item, i) => (
                <div key={i} className="relative pl-10 pb-[var(--sp-6)] group">
                   <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-[var(--color-ember)] border-4 border-[var(--color-surface-raised)] box-content group-hover:scale-125 transition-transform shadow-[0_0_8px_var(--color-ember)]" />
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ember)] font-bold uppercase tracking-widest">{item.time}</span>
                      <span className="badge badge-accent font-[var(--font-mono)] text-[10px] tracking-tighter opacity-60">{item.camera}</span>
                   </div>
                   <div className="panel p-[var(--sp-4)] bg-[var(--color-surface)] border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all shadow-sm">
                      <p className="text-[14px] font-semibold text-[var(--color-ink)] mb-1.5">{item.event}</p>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[var(--color-online)]" weight="bold" />
                        <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wider font-bold">Verified by AI engine v2.1.0</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Panel: Evidence & Map */}
        <div className="col-span-4 space-y-6 flex flex-col min-h-0">
           <div className="panel bg-[var(--color-surface-raised)] flex-1 flex flex-col min-h-0 shadow-lg overflow-hidden">
              <div className="panel-header bg-[var(--color-surface)]">
                <h3 className="panel-title uppercase tracking-wider">Digital evidence locker</h3>
              </div>
              <div className="panel-body flex-1 grid grid-cols-2 gap-4 overflow-y-auto p-[var(--sp-5)]">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="aspect-video rounded-[var(--r-md)] border border-[var(--color-hairline-strong)] overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                      <img src={`https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Evidence" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl">
                           <MagnifyingGlass size={20} weight="bold" className="text-black" />
                         </div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 rounded-[var(--r-sm)] bg-black/60 backdrop-blur-md text-[10px] font-bold text-white font-[var(--font-mono)] border border-white/10 uppercase tracking-widest">
                         FRM-092{i}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="panel bg-[var(--color-surface-raised)] p-0 h-[300px] relative overflow-hidden shadow-lg border-[var(--color-hairline-strong)]">
              <div className="panel-header bg-[var(--color-surface)] border-b border-[var(--color-hairline)]">
                 <h3 className="panel-title uppercase tracking-wider">Tactical movement path</h3>
                 <MapTrifold size={18} className="text-[var(--color-ink-muted)]" />
              </div>
              <div className="absolute inset-x-0 top-[52px] bottom-0">
                 <MapView 
                    center={[73.1812, 22.3072]} 
                    zoom={15}
                    markers={[
                      { id: 'start', lng: 73.1800, lat: 22.3060, color: 'var(--color-ember)' },
                      { id: 'end', lng: 73.1850, lat: 22.3100, color: 'var(--color-online)' }
                    ]}
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
