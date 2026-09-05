import React from 'react';
import { ALERTS } from '../../data';
import { cn } from '../../lib/utils';
import { 
  Bell, 
  Warning, 
  MagnifyingGlass, 
  Funnel, 
  CaretDown, 
  ShieldCheck, 
  UserCircle,
  Clock,
  Play,
  ArrowSquareOut,
  DotsThree,
  VideoCamera
} from '@phosphor-icons/react';

export const AlertCenter: React.FC = () => {
  return (
    <div className="space-y-[var(--sp-6)] max-w-[1200px] mx-auto pb-12">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Alert Center</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              DEPARTMENT OPERATIONS
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Manage and resolve high-priority operational events across your department.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <span className="eyebrow uppercase tracking-[0.2em] font-bold text-[9px]">Sorted by</span>
           <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[12px] font-bold text-[var(--color-ink)] hover:border-[var(--color-hairline-strong)] transition-all uppercase tracking-wider">
             Newest first <CaretDown size={14} className="text-[var(--color-ember)]" />
           </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-[var(--sp-4)]">
        {[
          { label: 'CRITICAL', value: '02', color: 'bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] border-[var(--color-ember)]/30 text-[var(--color-ember)]', dot: 'bg-[var(--color-ember)]' },
          { label: 'HIGH', value: '08', color: 'bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] border-[var(--color-accent)]/30 text-[var(--color-accent)]', dot: 'bg-[var(--color-accent)]' },
          { label: 'MEDIUM', value: '14', color: 'bg-[var(--color-surface-raised)] border-[var(--color-hairline)] text-[var(--color-ink)]', dot: 'bg-[var(--color-hairline-strong)]' },
          { label: 'LOW', value: '31', color: 'bg-[var(--color-surface-raised)] border-[var(--color-hairline)] text-[var(--color-ink-muted)]', dot: 'bg-[var(--color-hairline)]' },
        ].map((stat) => (
          <div key={stat.label} className={cn("panel p-[var(--sp-5)] transition-all cursor-pointer group hover:shadow-lg", stat.color)}>
            <div className="flex items-center justify-between mb-2">
              <span className="eyebrow uppercase tracking-[0.2em] font-bold text-[10px] opacity-70 group-hover:opacity-100">{stat.label}</span>
              <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", stat.dot)} />
            </div>
            <span className="text-[32px] font-bold tracking-tight font-[var(--font-mono)]">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-6">
         <div className="flex items-center gap-2 px-4 py-2 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)]">
           <span className="eyebrow uppercase tracking-widest text-[10px] font-bold whitespace-nowrap">District 4</span>
         </div>
         <div className="flex-1 max-w-lg relative group">
           <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-lg group-focus-within:text-[var(--color-ember)] transition-colors" />
           <input 
             type="text" 
             placeholder="Search alerts by case ID or camera..."
             className="w-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] py-2.5 pl-12 pr-4 text-[13px] font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] transition-all shadow-sm"
           />
         </div>
         <div className="flex items-center gap-1.5 p-1.5 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] shadow-sm">
            {['All', 'Pending', 'Assigned', 'Closed'].map((tab, i) => (
              <button key={tab} className={cn(
                "px-5 py-2 rounded-[var(--r-sm)] text-[11px] font-bold uppercase transition-all tracking-wider",
                i === 0 ? "bg-[var(--color-ember)] text-white shadow-md" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}>{tab}</button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-[var(--sp-6)]">
         {ALERTS.map((alert) => (
           <div key={alert.id} className="panel bg-[var(--color-surface-raised)] p-[var(--sp-6)] flex flex-col group relative overflow-hidden shadow-md hover:shadow-xl transition-all border-[var(--color-hairline-strong)]">
              <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full",
                alert.severity === 'CRITICAL' ? "bg-[var(--color-ember)] shadow-[4px_0_12px_color-mix(in_srgb,var(--color-ember)_40%,transparent)]" :
                alert.severity === 'HIGH' ? "bg-[var(--color-accent)] shadow-[4px_0_12px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]" :
                "bg-[var(--color-hairline-strong)]"
              )} />
              
              <div className="flex items-center justify-between mb-5">
                 <div className="flex items-center gap-3">
                    <span className={cn(
                      "badge font-bold px-2 py-1 uppercase tracking-wider text-[9px] border",
                      alert.severity === 'CRITICAL' ? "badge-accent bg-[color-mix(in_srgb,var(--color-ember)_15%,transparent)] text-[var(--color-ember)] border-[var(--color-ember)]/30" :
                      alert.severity === 'HIGH' ? "badge-accent bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] text-[var(--color-accent)] border-[var(--color-accent)]/30" :
                      "bg-[var(--color-surface)] text-[var(--color-ink-muted)] border-[var(--color-hairline)]"
                    )}>{alert.severity} ALERT</span>
                    <span className="eyebrow font-[var(--font-mono)] text-[10px] uppercase tracking-widest opacity-60">ID: {alert.id}</span>
                 </div>
                 <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold">{alert.timestamp}</span>
              </div>

              <div className="flex gap-6 mb-6">
                 <div className="w-52 h-36 rounded-[var(--r-lg)] bg-black border border-[var(--color-hairline-strong)] relative overflow-hidden group/thumb cursor-pointer shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] group-hover/thumb:bg-black/30 transition-all z-10 opacity-0 group-hover/thumb:opacity-100">
                       <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover/thumb:scale-110 transition-transform">
                          <Play size={20} weight="fill" className="text-black translate-x-0.5" />
                       </div>
                    </div>
                    <img 
                      src={alert.type.includes('Weapon') ? 'https://images.unsplash.com/photo-1595062584113-47ba1900f11d?q=80&w=200&h=150&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=200&h=150&auto=format&fit=crop'} 
                      alt="Alert Thumb"
                      className="w-full h-full object-cover opacity-70 group-hover/thumb:opacity-100 transition-opacity"
                    />
                 </div>
                 <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                       <h3 className="text-[18px] font-bold text-[var(--color-ink)] leading-none tracking-tight">{alert.type}</h3>
                       <span className={cn("text-[11px] font-[var(--font-mono)] font-bold uppercase tracking-widest", alert.severity === 'CRITICAL' ? "text-[var(--color-ember)]" : "text-[var(--color-accent)]")}>
                          {alert.confidence}% CONF
                       </span>
                    </div>
                    <div className="space-y-2.5">
                       <div className="flex items-center gap-2.5 text-[12px] font-medium text-[var(--color-ink-secondary)]">
                          <VideoCamera size={16} className="text-[var(--color-ember)]" weight="bold" />
                          <span className="font-bold text-[var(--color-ink)]">{alert.cameraId}</span>
                          <span className="opacity-20">|</span>
                          <span>{alert.location}</span>
                       </div>
                       <div className="flex items-center gap-2.5 text-[12px] font-medium text-[var(--color-ink-secondary)]">
                          <ShieldCheck size={16} className="text-[var(--color-online)]" weight="bold" />
                          <span>Railway Terminal 1 North</span>
                       </div>
                       <div className="flex items-center gap-2.5 text-[12px] font-medium text-[var(--color-ink-secondary)]">
                          <UserCircle size={16} className="text-[var(--color-ink-muted)]" weight="bold" />
                          <span>Tracked subject: <span className="font-[var(--font-mono)] font-bold text-[var(--color-ink)]">#14492</span></span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button className={cn(
                   "btn h-11 transition-all shadow-lg",
                   alert.severity === 'CRITICAL' ? "btn-ember" : "bg-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_90%,white)] text-white shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]"
                 )}>
                   ACKNOWLEDGE
                 </button>
                 <button className="btn btn-secondary h-11 flex items-center justify-center gap-2 group/btn">
                   <span>INVESTIGATE</span>
                   <ArrowSquareOut size={18} weight="bold" className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                 </button>
              </div>

              <button className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-[var(--r-md)] hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
                <DotsThree size={24} weight="bold" />
              </button>
           </div>
         ))}

         {/* System Alert Example */}
         <div className="panel bg-[var(--color-surface-raised)] p-[var(--sp-8)] flex flex-col group col-span-2 shadow-lg border-[var(--color-hairline-strong)] border-l-[var(--color-online)] border-l-4">
            <div className="flex items-center justify-between mb-5">
               <div className="flex items-center gap-3">
                  <span className="badge font-bold px-2 py-1 rounded bg-[var(--color-surface)] text-[var(--color-ink-muted)] border border-[var(--color-hairline)] uppercase tracking-wider text-[9px]">System notification</span>
                  <span className="eyebrow font-[var(--font-mono)] text-[10px] uppercase tracking-widest opacity-60">ID: ALT-28790</span>
               </div>
               <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] font-bold">14:12:05</span>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-2xl">
                <h3 className="text-[20px] font-bold text-[var(--color-ink)] mb-3 tracking-tight">Camera Connection Integrity Loss</h3>
                <p className="text-[14px] text-[var(--color-ink-secondary)] leading-relaxed font-medium">
                  State-owned sensor <span className="font-bold text-[var(--color-ember)] font-[var(--font-mono)]">CAM-023-F9</span> has dropped from the statewide RTSP fabric for over 30 minutes. 
                </p>
              </div>
              <div className="flex items-center gap-3">
                 <button className="btn btn-secondary h-11 px-6 font-bold uppercase tracking-widest text-[11px]">View Health</button>
                 <button className="btn btn-ember h-11 px-6 font-bold uppercase tracking-widest text-[11px]">Retry connection</button>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};
