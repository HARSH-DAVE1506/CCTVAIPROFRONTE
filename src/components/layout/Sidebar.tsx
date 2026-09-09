import React from 'react';
import { useEmberlyStore } from '../../store';
import { cn } from '../../lib/utils';
import { 
  ChartLine, 
  GridFour, 
  Storefront, 
  Buildings, 
  Palette, 
  Cube, 
  Stack, 
  RocketLaunch, 
  ShieldCheck, 
  ClockCounterClockwise, 
  Gear,
  Monitor,
  VideoCamera,
  Warning,
  MagnifyingGlass,
  FileText,
  Users,
  SquaresFour
} from '@phosphor-icons/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { mode } = useEmberlyStore();

  const centralNav = [
    { name: 'State Command Center', icon: ChartLine, category: 'OPERATIONS' },
    { name: 'State Camera Grid', icon: GridFour, category: 'OPERATIONS' },
    { name: 'Departments', icon: Buildings, category: 'OPERATIONS' },
    { name: 'AI Marketplace', icon: Storefront, category: 'INTELLIGENCE' },
    { name: 'Model Studio', icon: Palette, category: 'INTELLIGENCE' },
    { name: 'Model Registry', icon: Stack, category: 'INTELLIGENCE' },
    { name: 'Deployment Control', icon: RocketLaunch, category: 'INTELLIGENCE' },
    { name: 'Analytics', icon: ChartLine, category: 'INSIGHTS' },
    { name: 'Settings', icon: Gear, category: 'INSIGHTS' },
  ];

  const departmentNav = [
    { name: 'Dashboard', icon: SquaresFour, category: 'OPERATIONAL' },
    { name: 'Live Monitoring', icon: VideoCamera, category: 'OPERATIONAL' },
    { name: 'Cameras', icon: GridFour, category: 'OPERATIONAL' },
    { name: 'AI Models', icon: Cube, category: 'INTELLIGENCE' },
    { name: 'Alerts', icon: Warning, category: 'INTELLIGENCE' },
    { name: 'Investigations', icon: MagnifyingGlass, category: 'INTELLIGENCE' },
    { name: 'Evidence', icon: FileText, category: 'INTELLIGENCE' },
    { name: 'Reports', icon: FileText, category: 'INTELLIGENCE' },
    { name: 'Operators', icon: Users, category: 'CONFIGURATION' },
    { name: 'Settings', icon: Gear, category: 'CONFIGURATION' },
  ];

  const currentNav = mode === 'CENTRAL' ? centralNav : departmentNav;

  const categories = Array.from(new Set(currentNav.map(item => item.category)));

  return (
    <aside className="w-[240px] flex-none flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-hairline)] h-screen overflow-y-auto">
      <div className="flex flex-col gap-2 px-[var(--sp-4)] py-[var(--sp-5)] mb-[var(--sp-3)] border-b border-[var(--color-hairline)]">
        <div className="flex items-center gap-2.5">
          {/* Official Reticle Mark A: 24px Nav Rail Size */}
          <div className="w-[26px] h-[26px] flex items-center justify-center shrink-0" title="Caksham AI">
            <svg width="22" height="22" viewBox="0 0 48 48" className="text-[var(--color-ink)] fill-current">
              <path 
                d="M4 16V6a2 2 0 0 1 2-2h10 M4 32V42a2 2 0 0 0 2 2h10 M44 16V6a2 2 0 0 0-2-2H32 M44 32V42a2 2 0 0 1-2 2H32" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.6" 
                strokeLinecap="square"
              />
              <rect x="20" y="20" width="8" height="8" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline tracking-[-0.03em] leading-none">
              <span className="text-[14px] font-bold text-[var(--color-ink)] font-sans">Caksham</span>
              <span className="text-[13px] font-normal text-[var(--color-ink-secondary)] font-sans ml-1">AI</span>
            </div>
            <p className="text-[9.5px] text-[var(--color-ink-muted)] font-mono tracking-wider uppercase mt-[3px]">
              {mode === 'CENTRAL' ? 'State Command' : 'Department Node'}
            </p>
          </div>
        </div>
        {/* Brand Tagline */}
        <div className="text-[10px] text-[var(--color-ink-muted)] font-sans tracking-tight pl-[31px] -mt-1 leading-tight select-none">
          Vision That Understands Too
        </div>
      </div>

      <nav className="flex-1 px-[var(--sp-4)] space-y-5 pb-[var(--sp-10)]">
        {categories.map(category => (
          <div key={category} className="space-y-1">
            <h3 className="px-[var(--sp-2)] text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-[0.04em] mb-[var(--sp-2)]">
              {category}
            </h3>
            {currentNav.filter(item => item.category === category).map(item => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "nav-link w-full",
                  mode === 'DEPARTMENT' && "ember",
                  activeTab === item.name && "active"
                )}
              >
                <item.icon 
                  size={18}
                  weight={activeTab === item.name ? "fill" : "regular"} 
                />
                {item.name}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-[var(--sp-4)] border-t border-[var(--color-hairline)]">
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--r-lg)] p-[var(--sp-4)] border border-[var(--color-hairline-strong)]">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} weight="fill" className="text-[var(--color-online)]" />
            <span className="text-[11px] font-semibold text-[var(--color-ink)]">System Integrity</span>
          </div>
          <p className="text-[10px] text-[var(--color-ink-muted)] leading-relaxed">
            All nodes synchronized. Next audit in 14m.
          </p>
        </div>
      </div>
    </aside>
  );
};
