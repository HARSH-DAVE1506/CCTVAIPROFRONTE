/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useEmberlyStore } from './store';
import { useCCTVStore } from './services/cctv';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CentralCommand } from './components/central/CentralCommand';
import { StateCameraGrid } from './components/central/StateCameraGrid';
import { DepartmentsView } from './components/central/DepartmentsView';
import { AIMarketplace } from './components/central/AIMarketplace';
import { ModelStudio } from './components/central/ModelStudio';
import { ModelRegistry } from './components/central/ModelRegistry';
import { DeploymentControl } from './components/central/DeploymentControl';
import { StatewideAnalytics } from './components/central/StatewideAnalytics';
import { CentralSettings } from './components/central/CentralSettings';
import { DepartmentDashboard } from './components/department/DepartmentDashboard';
import { LiveMonitoring } from './components/department/LiveMonitoring';
import { AlertCenter } from './components/department/AlertCenter';
import { CameraManagement } from './components/department/CameraManagement';
import { AIModelManagement } from './components/department/AIModelManagement';
import { InvestigationWorkspace } from './components/department/InvestigationWorkspace';
import { EvidenceCenter } from './components/department/EvidenceCenter';
import { ReportGenerator } from './components/department/ReportGenerator';
import { OperatorManagement } from './components/department/OperatorManagement';
import { DepartmentSettings } from './components/department/DepartmentSettings';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { mode } = useEmberlyStore();
  const { fetchCameras } = useCCTVStore();
  const [activeTab, setActiveTab] = useState('State Command Center');

  // Initialize CCTV feeds
  useEffect(() => {
    fetchCameras();
    const interval = setInterval(fetchCameras, 300000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, [fetchCameras]);

  // Reset tab when mode changes
  useEffect(() => {
    setActiveTab(mode === 'CENTRAL' ? 'State Command Center' : 'Dashboard');
  }, [mode]);

  const renderContent = () => {
    if (mode === 'CENTRAL') {
      switch (activeTab) {
        case 'State Command Center':
        case 'Command Center':
          return <CentralCommand />;
        case 'State Camera Grid':
          return <StateCameraGrid />;
        case 'Departments':
          return <DepartmentsView />;
        case 'AI Marketplace':
          return <AIMarketplace />;
        case 'Model Studio':
          return <ModelStudio />;
        case 'Model Registry':
          return <ModelRegistry />;
        case 'Deployment Control':
          return <DeploymentControl />;
        case 'Analytics':
          return <StatewideAnalytics />;
        case 'Settings':
          return <CentralSettings />;
        default:
          return <CentralCommand />;
      }
    } else {
      switch (activeTab) {
        case 'Dashboard': return <DepartmentDashboard />;
        case 'Live Monitoring': return <LiveMonitoring />;
        case 'Cameras': return <CameraManagement />;
        case 'AI Models': return <AIModelManagement />;
        case 'Alerts': return <AlertCenter />;
        case 'Investigations': return <InvestigationWorkspace />;
        case 'Evidence': return <EvidenceCenter />;
        case 'Reports': return <ReportGenerator />;
        case 'Operators': return <OperatorManagement />;
        case 'Settings': return <DepartmentSettings />;
        default: return <DepartmentDashboard />;
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)] selection:bg-[color-mix(in_srgb,var(--color-accent)_35%,transparent)]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="h-full p-[var(--sp-6)] max-w-[1440px]"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
