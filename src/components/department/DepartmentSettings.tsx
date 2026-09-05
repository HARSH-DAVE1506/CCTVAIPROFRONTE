import React from 'react';
import { cn } from '../../lib/utils';
import { 
  Gear, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  CloudArrowUp, 
  Globe, 
  Notification,
  CaretRight,
  UserCircle
} from '@phosphor-icons/react';

export const DepartmentSettings: React.FC = () => {
  return (
    <div className="space-y-[var(--sp-6)] max-w-[1000px] mx-auto pb-12">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Department settings</h2>
          <span className="badge badge-accent font-[var(--font-mono)]">
            CONFIGURATION
          </span>
        </div>
        <p className="text-[13px] text-[var(--color-ink-secondary)]">
          Manage your department's operational configuration, alert policies, and regional preferences.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-[var(--sp-8)]">
         {/* Sidebar Navigation */}
         <div className="col-span-3 space-y-1.5">
            {[
              { name: 'General', icon: Gear },
              { name: 'Alert Policies', icon: Bell },
              { name: 'Zones', icon: MapPin },
              { name: 'Notifications', icon: Bell },
              { name: 'Security', icon: ShieldCheck },
              { name: 'Integrations', icon: CloudArrowUp },
            ].map((item, i) => (
              <button 
                key={item.name}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-[var(--r-md)] text-[12px] font-bold transition-all uppercase tracking-wider",
                  i === 0 ? "bg-[var(--color-ember)] text-white shadow-md" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                )}
              >
                <item.icon weight={i === 0 ? "fill" : "bold"} size={18} />
                <span>{item.name}</span>
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="col-span-9 space-y-[var(--sp-6)]">
            <div className="panel bg-[var(--color-surface-raised)] p-[var(--sp-8)] space-y-10 border-[var(--color-hairline-strong)] shadow-md">
               <section className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-[var(--color-hairline)] pb-5">
                     <div className="w-10 h-10 rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] flex items-center justify-center text-[var(--color-ember)] border border-[var(--color-ember)]/20 shadow-sm">
                        <UserCircle size={22} weight="fill" />
                     </div>
                     <h3 className="text-[18px] font-bold text-[var(--color-ink)] tracking-tight">Department profile</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2.5">
                        <label className="eyebrow uppercase tracking-[0.2em] font-bold text-[9px] pl-1 opacity-70">Department Name</label>
                        <input type="text" defaultValue="Police District 4" className="w-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-4 py-3 text-[13px] font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] transition-all shadow-sm" />
                     </div>
                     <div className="space-y-2.5">
                        <label className="eyebrow uppercase tracking-[0.2em] font-bold text-[9px] pl-1 opacity-70">Operational Region</label>
                        <input type="text" defaultValue="Ahmedabad Central" className="w-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] px-4 py-3 text-[13px] font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] transition-all shadow-sm" />
                     </div>
                  </div>
               </section>

               <section className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-[var(--color-hairline)] pb-5">
                     <div className="w-10 h-10 rounded-[var(--r-md)] bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-sm">
                        <Globe size={22} weight="fill" />
                     </div>
                     <h3 className="text-[18px] font-bold text-[var(--color-ink)] tracking-tight">Localization</h3>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] shadow-inner">
                     <div>
                        <p className="text-[13px] font-bold text-[var(--color-ink)]">Timezone</p>
                        <p className="eyebrow uppercase tracking-widest text-[9px] font-bold opacity-60 mt-0.5">Indian Standard Time (IST)</p>
                     </div>
                     <button className="btn btn-secondary py-2 px-4 text-[10px] uppercase tracking-[0.2em] h-9">Change</button>
                  </div>
               </section>

               <div className="pt-8 flex justify-end gap-3 border-t border-[var(--color-hairline)]">
                  <button className="btn btn-secondary px-8">Cancel</button>
                  <button className="btn btn-ember px-10">Save configuration</button>
               </div>
            </div>

            <div className="panel bg-[color-mix(in_srgb,var(--color-ember)_5%,var(--color-surface))] border border-[var(--color-ember)]/10 p-[var(--sp-6)] flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] flex items-center justify-center text-[var(--color-ember)] border border-[var(--color-ember)]/20 shadow-sm">
                     <Gear size={24} weight="fill" />
                  </div>
                  <div>
                     <p className="text-[15px] font-bold text-[var(--color-ink)] tracking-tight">System reset</p>
                     <p className="text-[12px] text-[var(--color-ink-secondary)] font-medium mt-0.5 opacity-80 uppercase tracking-widest">Permanently reset department configurations. This action cannot be undone.</p>
                  </div>
               </div>
               <button className="btn btn-secondary border-[var(--color-ember)]/30 text-[var(--color-ember)] hover:bg-[var(--color-ember)] hover:text-white px-6 py-2.5 text-[10px] uppercase tracking-widest transition-all">
                  Reset system
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
