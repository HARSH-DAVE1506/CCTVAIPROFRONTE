import React from 'react';
import { OPERATORS } from '../../data';
import { cn } from '../../lib/utils';
import { 
  Users, 
  Plus, 
  MagnifyingGlass, 
  DotsThree, 
  ShieldCheck, 
  UserCircle,
  Pulse,
  Envelope,
  UserGear
} from '@phosphor-icons/react';

export const OperatorManagement: React.FC = () => {
  return (
    <div className="space-y-[var(--sp-6)] max-w-[1200px] mx-auto pb-12">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Department users</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              OPERATOR ROSTER
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Manage department personnel, administrative roles, and system access permissions.
          </p>
        </div>
        <button className="btn btn-ember h-11 px-6">
          <Plus weight="bold" size={18} />
          <span>Add new operator</span>
        </button>
      </header>

      <div className="panel bg-[var(--color-surface-raised)] p-[var(--sp-4)] flex items-center justify-between gap-6 shadow-md border-[var(--color-hairline-strong)]">
        <div className="flex-1 relative group">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] text-lg group-focus-within:text-[var(--color-ember)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, operator ID, or role..."
            className="w-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--r-md)] py-2.5 pl-12 pr-4 text-[13px] font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ember)] transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-4 pr-3 border-l border-[var(--color-hairline)] pl-6">
           <div className="flex flex-col items-end">
              <span className="eyebrow text-[9px] uppercase tracking-[0.2em] font-bold opacity-60">Session status</span>
              <span className="text-[13px] font-bold text-[var(--color-online)] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-online)] shadow-[0_0_6px_var(--color-online)]" />
                2 OPERATORS ACTIVE
              </span>
           </div>
        </div>
      </div>

      <div className="panel bg-[var(--color-surface-raised)] p-0 overflow-hidden border-[var(--color-hairline-strong)] shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-hairline-strong)] bg-[var(--color-surface)]">
              {['Operator identity', 'Role & Authorization', 'Session status', 'Last activity', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-5 text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-widest">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-hairline)]">
            {OPERATORS.map((op) => (
              <tr key={op.id} className="hover:bg-[var(--color-surface)] transition-all group">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={op.avatar} className="w-10 h-10 rounded-full object-cover border border-[var(--color-hairline)] shadow-sm group-hover:border-[var(--color-ember)]/30 transition-all" alt={op.name} />
                        {op.status === 'ACTIVE' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--color-online)] border-2 border-[var(--color-surface-raised)]" />
                        )}
                      </div>
                      <div>
                         <p className="text-[14px] font-bold text-[var(--color-ink)] leading-tight mb-1 tracking-tight">{op.name}</p>
                         <p className="text-[10px] text-[var(--color-ink-muted)] font-[var(--font-mono)] font-bold uppercase tracking-wider">{op.id}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-hairline)] text-[var(--color-ink-muted)]">
                        <UserGear size={16} weight="bold" />
                      </div>
                      <span className="text-[12px] font-bold text-[var(--color-ink-secondary)] uppercase tracking-wide">{op.role}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className={cn(
                     "badge font-bold px-2.5 py-1 text-[9px] tracking-widest uppercase",
                     op.status === 'ACTIVE' ? "badge-online" : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] border border-[var(--color-hairline)]"
                   )}>
                      {op.status}
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-[12px] text-[var(--color-ink-muted)] font-medium">{op.lastActive}</span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-1.5">
                      <button className="w-9 h-9 flex items-center justify-center rounded-[var(--r-md)] hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ember)] transition-all">
                         <Envelope size={18} weight="bold" />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-[var(--r-md)] hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-all">
                         <DotsThree size={22} weight="bold" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel p-[var(--sp-5)] bg-[color-mix(in_srgb,var(--color-ember)_5%,var(--color-surface))] border border-[var(--color-ember)]/10 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--color-ember)_10%,transparent)] flex items-center justify-center text-[var(--color-ember)] border border-[var(--color-ember)]/20 shadow-sm">
               <ShieldCheck size={26} weight="fill" />
            </div>
            <div>
               <p className="text-[15px] font-bold text-[var(--color-ink)] tracking-tight">Department Role Governance</p>
               <p className="text-[12px] text-[var(--color-ink-secondary)] font-medium mt-0.5 opacity-80 uppercase tracking-widest">Only authorized administrators can modify operator roles or access groups.</p>
            </div>
         </div>
         <button className="btn btn-secondary px-5 py-2 text-[11px] font-bold uppercase tracking-widest border-[var(--color-ember)]/30 text-[var(--color-ember)] hover:bg-[var(--color-ember)] hover:text-white transition-all">
            Review permissions
         </button>
      </div>
    </div>
  );
};
