import React from 'react';
import { useEmberlyStore } from '../../store';
import { CAMERAS, INVESTIGATIONS, ALERTS } from '../../data';
import { cn } from '../../lib/utils';
import { MapView } from '../map/MapView';
import { 
  VideoCamera, 
  Pulse, 
  Warning, 
  Cube, 
  Plus, 
  CaretRight, 
  Users, 
  MagnifyingGlass,
  MapTrifold,
  Bell
} from '@phosphor-icons/react';

export const DepartmentDashboard: React.FC = () => {
  const { department } = useEmberlyStore();

  const stats = [
    { label: 'Live Cameras', value: '1,248', change: '+4 active', icon: VideoCamera, color: 'text-green-500' },
    { label: 'Offline Cameras', value: '12', change: 'Action required', icon: Warning, color: 'text-red-500' },
    { label: 'Critical Alerts', value: '2', change: 'Active now', icon: Bell, color: 'text-red-500' },
    { label: 'Model Health', value: '94.2%', change: 'Optimal', icon: Cube, color: 'text-orange-500' },
  ];

  const liveEvents = [
    { type: 'VEHICLE DETECTED', icon: Pulse, time: '14:32:10', confidence: 94, sub: 'CAM-023 · Central Bus Station', color: 'text-blue-500' },
    { type: 'PLATE DETECTED', icon: Pulse, time: '14:32:12', confidence: 89, sub: '# GJ01AB1234 · Central Bus Station', color: 'text-orange-500' },
    { type: 'ABANDONED OBJECT', icon: Warning, time: '14:32:18', confidence: 91, sub: 'CAM-023 · Waiting Area A', severity: 'HIGH', color: 'text-red-500' },
  ];

  function BellIcon(props: any) {
    return <Warning {...props} />;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Department Dashboard</h2>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Current operational status for <span className="text-[var(--color-ink)] font-semibold">{department} District 4</span>
          </p>
        </div>
        <button className="btn btn-ember">
          <Plus weight="bold" size={16} />
          <span>Onboard Camera</span>
        </button>
      </header>

      <div className="grid grid-cols-4 gap-[var(--sp-4)]">
        {stats.map((stat, i) => (
          <div key={i} className="panel px-[var(--sp-5)] py-[var(--sp-5)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-all group shadow-sm">
            <div className="flex items-start justify-between mb-4">
               <div>
                  <p className="eyebrow uppercase tracking-[0.2em] font-bold text-[10px] opacity-70 block mb-1">{stat.label}</p>
                  <span className="text-[28px] font-bold tracking-tight text-[var(--color-ink)] font-[var(--font-mono)]">{stat.value}</span>
               </div>
               <div className={cn("w-12 h-12 rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] flex items-center justify-center shadow-sm", stat.color)}>
                  <stat.icon weight="fill" size={24} />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className={cn("w-2 h-2 rounded-full", stat.color.replace('text-', 'bg-'), "shadow-[0_0_8px_currentColor]")} />
               <span className="text-[11px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-[var(--sp-4)]">
        {/* Live Events Section */}
        <div className="col-span-8 space-y-[var(--sp-4)]">
          <div className="panel">
            <div className="panel-header">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-ember)]" />
                  <h3 className="panel-title uppercase">Live AI Events</h3>
               </div>
               <button className="btn btn-ghost btn-sm uppercase font-bold tracking-widest text-[9px]">View All Events</button>
            </div>

            <div className="panel-body space-y-[var(--sp-2)]">
               {liveEvents.map((event, i) => (
                 <div key={i} className="flex items-center gap-4 p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all cursor-pointer group">
                    <div className={cn("w-10 h-10 rounded-[var(--r-md)] bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-hairline)] transition-colors group-hover:border-[var(--color-hairline-strong)]", event.color)}>
                       <event.icon weight="fill" size={20} />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--color-ink)]">{event.type}</span>
                          <span className="text-[11px] text-[var(--color-ink-muted)] font-[var(--font-mono)]">{event.time}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[var(--color-ink-secondary)] font-medium">{event.sub}</span>
                          {event.severity && (
                            <span className="badge badge-critical text-[9px] px-1.5 py-0">Severity: {event.severity}</span>
                          )}
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[15px] font-semibold text-[var(--color-ink)] leading-none mb-1 font-[var(--font-mono)]">{event.confidence}%</p>
                       <p className="text-[9px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider">Confidence</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="panel h-[320px]">
             <div className="panel-header">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-[var(--color-ember)]" />
                   <h3 className="panel-title uppercase">District area map</h3>
                </div>
                <div className="segmented">
                   <button className="active">Cameras</button>
                   <button>Zones</button>
                </div>
             </div>
             <div className="panel-body relative h-[230px] p-0 overflow-hidden">
                <MapView 
                   center={[73.1812, 22.3072]} 
                   zoom={13}
                   className="rounded-[var(--r-lg)]"
                />
             </div>
          </div>
        </div>

        {/* Active Investigations */}
        <div className="col-span-4 panel h-fit sticky top-[var(--sp-6)]">
           <div className="panel-header">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[var(--color-ember)]" />
                 <h3 className="panel-title uppercase">Active investigations</h3>
              </div>
              <MagnifyingGlass size={16} className="text-[var(--color-ink-muted)]" />
           </div>

           <div className="panel-body space-y-[var(--sp-4)]">
              {INVESTIGATIONS.map((inv) => (
                <div key={inv.id} className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[var(--color-surface-raised)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] transition-all group relative overflow-hidden">
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-[var(--color-ember)] font-[var(--font-mono)] tracking-wider">{inv.id}</span>
                      <span className={cn(
                        "badge",
                        inv.status === 'IN_PROGRESS' ? "badge-accent" : "badge-high"
                      )}>{inv.status.replace('_', ' ')}</span>
                   </div>
                   <h4 className="text-[13px] font-semibold text-[var(--color-ink)] mb-1 group-hover:text-[var(--color-ember)] transition-colors">{inv.title}</h4>
                   <p className="text-[11px] text-[var(--color-ink-muted)] font-medium mb-4">Owner tracked across 3 cameras</p>
                   
                   <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                         <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&h=64&auto=format&fit=crop" className="w-6 h-6 rounded-full border-2 border-[var(--color-surface-raised)] object-cover" alt="User" />
                         <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64&h=64&auto=format&fit=crop" className="w-6 h-6 rounded-full border-2 border-[var(--color-surface-raised)] object-cover" alt="User" />
                      </div>
                      <button className="btn btn-ghost btn-sm px-[var(--sp-3)] bg-[var(--color-surface)] border border-[var(--color-hairline)] text-[11px]">
                        Open Case
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
