import React from 'react';
import { useEmberlyStore } from '../../store';
import { cn } from '../../lib/utils';
import { 
  MagnifyingGlass, 
  Bell, 
  CaretDown, 
  UserCircle,
  Command,
  Monitor
} from '@phosphor-icons/react';

export const TopBar: React.FC = () => {
  const { mode, department, setMode } = useEmberlyStore();

  return (
    <header className="h-[64px] border-b border-[var(--color-hairline)] flex items-center justify-between px-[var(--sp-6)] bg-[var(--color-canvas)] sticky top-0 z-50">
      <div className="flex items-center gap-[var(--sp-6)]">
        <button 
          onClick={() => setMode(mode === 'CENTRAL' ? 'DEPARTMENT' : 'CENTRAL')}
          className="btn btn-secondary btn-sm group"
        >
          <div className={cn(
            "w-2 h-2 rounded-full",
            mode === 'CENTRAL' ? "bg-[var(--color-accent)]" : "bg-[var(--color-ember)]"
          )} />
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {department}
          </span>
          <CaretDown size={10} className="text-[var(--color-ink-muted)]" />
        </button>

        <div className="relative group">
          <MagnifyingGlass size={16} className="absolute left-[var(--sp-3)] top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
          <input 
            type="text" 
            placeholder={mode === 'CENTRAL' ? "Show white cars..." : "Search entities..."}
            className="field w-[380px] pl-[var(--sp-10)]"
          />
          <div className="absolute right-[var(--sp-3)] top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[var(--r-sm)] border border-[var(--color-hairline-strong)] bg-[var(--color-surface-raised)] text-[9px] font-bold text-[var(--color-ink-muted)] uppercase">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[var(--sp-6)]">
        <div className="flex items-center gap-[var(--sp-3)]">
          <span className="eyebrow">Active alerts</span>
          <div className="flex items-center gap-1.5">
            <span className="badge badge-critical"><span className="badge-dot"></span>3 Critical</span>
            <span className="badge badge-high"><span className="badge-dot"></span>8 High</span>
            <span className="badge badge-neutral"><span className="badge-dot"></span>21 Medium</span>
          </div>
        </div>

        <div className="h-[16px] w-[1px] bg-[var(--color-hairline)]" />

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right">
            <p className="text-[13px] font-semibold text-[var(--color-ink)] leading-none">Marcus Hale</p>
            <p className="text-[11px] text-[var(--color-ink-muted)] font-medium mt-[2px]">Field Commander</p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&h=128&auto=format&fit=crop" 
              alt="User" 
              className="w-9 h-9 rounded-[var(--r-md)] border border-[var(--color-hairline-strong)] group-hover:border-[var(--color-accent)] transition-colors object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--color-online)] border-2 border-[var(--color-canvas)] rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};
