import React, { useState } from 'react';
import { MODEL_STUDIO_PROJECTS } from '../../stateData';
import { ModelStudioProject } from '../../types';
import { cn } from '../../lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Palette, 
  Play, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  SlidersHorizontal,
  X,
  FileCode,
  Sparkle,
  UploadSimple
} from '@phosphor-icons/react';

const LIFECYCLE_STAGES = [
  'IDEA', 
  'DATASET', 
  'TRAINING', 
  'EVALUATION', 
  'VALIDATION', 
  'PACKAGING', 
  'APPROVAL', 
  'REGISTRY', 
  'MARKETPLACE'
];

const MOCK_TRAINING_LOSS = [
  { epoch: 10, loss: 0.84, mAP: 0.42 },
  { epoch: 30, loss: 0.52, mAP: 0.68 },
  { epoch: 60, loss: 0.31, mAP: 0.81 },
  { epoch: 90, loss: 0.22, mAP: 0.89 },
  { epoch: 120, loss: 0.16, mAP: 0.94 }
];

export const ModelStudio: React.FC = () => {
  const [projects, setProjects] = useState<ModelStudioProject[]>(MODEL_STUDIO_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ModelStudioProject>(MODEL_STUDIO_PROJECTS[0]);
  const [activeTab, setActiveTab] = useState<'EVALUATION' | 'DATASET' | 'TRAINING' | 'PACKAGING'>('EVALUATION');
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionSuccess, setPromotionSuccess] = useState(false);

  const handlePromoteToRegistry = () => {
    setIsPromoting(true);
    setTimeout(() => {
      setIsPromoting(false);
      setPromotionSuccess(true);
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...p, status: 'SUBMITTED', stage: 'APPROVAL' } : p
      ));
      setSelectedProject(prev => ({ ...prev, status: 'SUBMITTED', stage: 'APPROVAL' }));
    }, 1200);
  };

  return (
    <div className="space-y-[var(--sp-6)] max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] mb-1">Model Studio</h2>
            <span className="badge badge-accent font-[var(--font-mono)]">
              ENGINEERING & VALIDATION
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-ink-secondary)]">
            Build, train, evaluate, and benchmark government AI capabilities before registry certification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="badge badge-secondary px-4 py-2 font-[var(--font-mono)] text-[11px] uppercase tracking-wider">
            Cluster Target: <strong className="text-[var(--color-ink)]">NVIDIA H100 (Gandhinagar Node 01)</strong>
          </div>
        </div>
      </header>

      {/* Model Lifecycle Pipeline Stepper */}
      <div className="panel p-[var(--sp-6)] bg-[var(--color-surface-raised)]">
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow uppercase tracking-widest block">
            Model Development Lifecycle · Stage Progression
          </span>
          <span className="text-[12px] font-[var(--font-mono)] text-[var(--color-ember)] font-bold">
            CURRENT: {selectedProject.stage}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const currentIdx = LIFECYCLE_STAGES.indexOf(selectedProject.stage);
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={stage} className="flex items-center gap-3 flex-1 min-w-[120px]">
                <div className={cn(
                  "flex-1 p-2.5 rounded-[var(--r-md)] text-center border transition-all",
                  isCurrent ? "bg-[var(--color-ember)] text-white border-transparent font-bold shadow-[0_4px_12px_rgba(234,88,12,0.3)]" :
                  isCompleted ? "bg-[color-mix(in_srgb,var(--color-online)_10%,transparent)] border-[var(--color-online)]/30 text-[var(--color-online)] font-semibold" :
                  "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-ink-muted)] opacity-50"
                )}>
                  <span className="text-[9px] block uppercase font-[var(--font-mono)] tracking-wider">{stage}</span>
                </div>
                {idx < LIFECYCLE_STAGES.length - 1 && (
                  <ArrowRight size={14} className={isCompleted ? "text-[var(--color-online)]/50" : "text-[var(--color-hairline)]"} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout: Projects Sidebar + Studio Workspace */}
      <div className="grid grid-cols-12 gap-[var(--sp-6)] items-start">
        {/* Left: Project Selector List */}
        <div className="col-span-4 panel p-[var(--sp-6)] bg-[var(--color-surface-raised)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-4">
            <h3 className="text-[14px] font-semibold text-[var(--color-ink)] uppercase tracking-wider">Active projects</h3>
            <span className="badge badge-secondary">{projects.length} Development</span>
          </div>

          <div className="space-y-[var(--sp-3)] max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProject(proj);
                  setPromotionSuccess(false);
                }}
                className={cn(
                  "p-[var(--sp-4)] rounded-[var(--r-md)] border transition-all cursor-pointer space-y-3",
                  selectedProject.id === proj.id 
                    ? "bg-[var(--color-surface)] border-[var(--color-ember)] shadow-sm" 
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)]"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[14px] font-semibold text-[var(--color-ink)]">{proj.name}</h4>
                    <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-ink-muted)] uppercase tracking-wide">v{proj.version} · {proj.category}</span>
                  </div>
                  <span className={cn(
                    "badge",
                    proj.stage === 'APPROVAL' || proj.status === 'READY_FOR_APPROVAL' 
                      ? "badge-online" 
                      : "badge-secondary"
                  )}>
                    {proj.stage}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[12px] pt-3 border-t border-[var(--color-hairline)]">
                  <div>
                    <span className="eyebrow uppercase block text-[9px] mb-0.5">F1-score</span>
                    <span className="text-[13px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{proj.f1Score}%</span>
                  </div>
                  <div>
                    <span className="eyebrow uppercase block text-[9px] mb-0.5">Frames</span>
                    <span className="text-[13px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{(proj.datasetFrames / 1000).toFixed(0)}k</span>
                  </div>
                  <div>
                    <span className="eyebrow uppercase block text-[9px] mb-0.5">Latency</span>
                    <span className="text-[13px] font-semibold text-[var(--color-online)] font-[var(--font-mono)]">{proj.inferenceMs}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Studio Interactive Workspace */}
        <div className="col-span-8 panel flex flex-col justify-between bg-[var(--color-surface-raised)] min-h-[700px]">
          <div>
            {/* Top Project Bar */}
            <div className="panel-header bg-[var(--color-surface)]">
              <div>
                <span className="eyebrow text-[var(--color-ember)] uppercase tracking-widest block mb-0.5">Engineering Bench</span>
                <h3 className="panel-title">{selectedProject.name} (v{selectedProject.version})</h3>
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5 font-semibold">
                  BACKBONE: {selectedProject.backbone} · TARGET: {selectedProject.computeTarget}
                </p>
              </div>

              {/* Action: Promote / Submit to Registry */}
              <button
                onClick={handlePromoteToRegistry}
                disabled={isPromoting || promotionSuccess || selectedProject.status === 'SUBMITTED'}
                className={cn(
                  "btn min-w-[220px]",
                  promotionSuccess || selectedProject.status === 'SUBMITTED'
                    ? "btn-secondary text-[var(--color-online)]"
                    : "btn-ember"
                )}
              >
                {isPromoting ? (
                  <span>Certifying Package...</span>
                ) : promotionSuccess || selectedProject.status === 'SUBMITTED' ? (
                  <>
                    <CheckCircle size={16} weight="fill" />
                    <span>Submitted to Registry</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} weight="bold" />
                    <span>Promote to Registry</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation Tabs inside Studio */}
            <div className="panel-body flex items-center gap-2 border-b border-[var(--color-hairline)] bg-[var(--color-surface)] py-3">
              {(['EVALUATION', 'DATASET', 'TRAINING', 'PACKAGING'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "btn btn-sm",
                    activeTab === tab ? "btn-ember" : "btn-secondary"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Workspace Content according to active tab */}
            <div className="panel-body">
              {activeTab === 'EVALUATION' && (
                <div className="space-y-[var(--sp-6)] animate-fade-in">
                  {/* Benchmarks Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                      <span className="eyebrow uppercase block mb-1">Precision @ 0.5 IoU</span>
                      <span className="text-[24px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{selectedProject.precision}%</span>
                      <span className="text-[11px] text-[var(--color-online)] font-semibold block">+2.4% vs Baseline</span>
                    </div>
                    <div className="p-4 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                      <span className="eyebrow uppercase block mb-1">Recall @ 0.5 IoU</span>
                      <span className="text-[24px] font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">{selectedProject.recall}%</span>
                      <span className="text-[11px] text-[var(--color-online)] font-semibold block">+1.8% vs Baseline</span>
                    </div>
                    <div className="p-4 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                      <span className="eyebrow uppercase block mb-1">F1 Composite score</span>
                      <span className="text-[24px] font-semibold text-[var(--color-ember)] font-[var(--font-mono)]">{selectedProject.f1Score}%</span>
                      <span className="text-[11px] text-[var(--color-ember)] font-semibold block">Audit Pass &gt; 90%</span>
                    </div>
                    <div className="p-4 rounded-[var(--r-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-1">
                      <span className="eyebrow uppercase block mb-1">Inference frame latency</span>
                      <span className="text-[24px] font-semibold text-[var(--color-online)] font-[var(--font-mono)]">{selectedProject.inferenceMs} ms</span>
                      <span className="text-[11px] text-[var(--color-ink-muted)] font-semibold block">FP16 TensorRT</span>
                    </div>
                  </div>

                  {/* Chart: Loss & mAP progression */}
                  <div className="p-[var(--sp-5)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow uppercase tracking-wider text-[var(--color-ink)]">
                        Training Loss & Validation mAP Progression (120 Epochs)
                      </span>
                      <div className="flex items-center gap-4 text-[10px] font-[var(--font-mono)] font-bold">
                        <span className="flex items-center gap-1.5 text-[var(--color-ember)]">
                          <div className="w-2 h-2 rounded-full bg-[var(--color-ember)]" /> mAP@50
                        </span>
                        <span className="flex items-center gap-1.5 text-[var(--color-accent)]">
                          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" /> Val Loss
                        </span>
                      </div>
                    </div>

                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_TRAINING_LOSS}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
                          <XAxis dataKey="epoch" stroke="var(--color-ink-muted)" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="var(--color-ink-muted)" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'var(--color-surface-raised)', 
                              borderColor: 'var(--color-hairline-strong)', 
                              fontSize: '11px',
                              borderRadius: 'var(--r-md)',
                              color: 'var(--color-ink)'
                            }} 
                          />
                          <Line type="monotone" dataKey="mAP" stroke="var(--color-ember)" strokeWidth={2.5} dot={{ fill: 'var(--color-ember)', r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="loss" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ fill: 'var(--color-accent)', r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'DATASET' && (
                <div className="space-y-[var(--sp-4)] animate-fade-in">
                  <div className="p-[var(--sp-6)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-4">
                    <h4 className="text-[14px] font-semibold text-[var(--color-ink)] uppercase tracking-wider">State CCTV Ground Truth Collection</h4>
                    <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed">
                      Curated from Gujarat highway checkpoints, city concourses, and night vision feeds. Split: 80% Train ({Math.round(selectedProject.datasetFrames * 0.8).toLocaleString()} frames), 10% Validation, 10% Test.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <span className="badge badge-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide">Augmentation: Rain + Lens Flare</span>
                      <span className="badge badge-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide">Annotation: Bounding Box + Keypoint Pose</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'TRAINING' && (
                <div className="space-y-[var(--sp-4)] animate-fade-in">
                  <div className="p-[var(--sp-6)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-5">
                    <h4 className="text-[14px] font-semibold text-[var(--color-ink)] uppercase tracking-wider">Distributed Node Cluster Settings</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[13px] text-[var(--color-ink-secondary)]">
                      <div className="flex justify-between border-b border-[var(--color-hairline)] pb-2">
                        <span className="text-[var(--color-ink-muted)] eyebrow uppercase text-[10px]">Hardware</span>
                        <strong className="text-[var(--color-ink)]">8x NVIDIA H100 SXM5 (80GB)</strong>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-hairline)] pb-2">
                        <span className="text-[var(--color-ink-muted)] eyebrow uppercase text-[10px]">Framework</span>
                        <strong className="text-[var(--color-ink)]">PyTorch 2.4 + CUDA 12.4</strong>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-hairline)] pb-2">
                        <span className="text-[var(--color-ink-muted)] eyebrow uppercase text-[10px]">Batch Size</span>
                        <strong className="text-[var(--color-ink)] font-[var(--font-mono)]">128</strong>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-hairline)] pb-2">
                        <span className="text-[var(--color-ink-muted)] eyebrow uppercase text-[10px]">Optimizer</span>
                        <strong className="text-[var(--color-ink)]">AdamW (lr=0.001)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PACKAGING' && (
                <div className="space-y-[var(--sp-4)] animate-fade-in">
                  <div className="p-[var(--sp-6)] rounded-[var(--r-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] space-y-5">
                    <h4 className="text-[14px] font-semibold text-[var(--color-ink)] uppercase tracking-wider">Runtime Serialization & Security Audit</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[13px] text-[var(--color-online)] font-semibold p-3 bg-[color-mix(in_srgb,var(--color-online)_8%,transparent)] rounded-[var(--r-md)] border border-[var(--color-online)]/20">
                        <CheckCircle size={18} weight="fill" />
                        <span>ONNX Runtime Export Verified</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-[var(--color-online)] font-semibold p-3 bg-[color-mix(in_srgb,var(--color-online)_8%,transparent)] rounded-[var(--r-md)] border border-[var(--color-online)]/20">
                        <CheckCircle size={18} weight="fill" />
                        <span>TensorRT 10.2 FP16 Engine Generated</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-[var(--color-online)] font-semibold p-3 bg-[color-mix(in_srgb,var(--color-online)_8%,transparent)] rounded-[var(--r-md)] border border-[var(--color-online)]/20">
                        <CheckCircle size={18} weight="fill" />
                        <span>Security & Adversarial Perturbation Scan: Clean (0 CVEs)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Promotion Notification */}
          <div className="panel-body bg-[var(--color-surface)] border-t border-[var(--color-hairline)]">
            {promotionSuccess ? (
              <div className="p-[var(--sp-4)] rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--color-online)_10%,transparent)] border border-[var(--color-online)]/30 flex items-center justify-between animate-fade-in">
                <span className="text-[var(--color-online)] font-bold flex items-center gap-3">
                  <CheckCircle size={20} weight="fill" />
                  Successfully certified and promoted to Model Registry as Candidate Build!
                </span>
                <span className="text-[var(--color-ink-muted)] font-[var(--font-mono)] font-bold text-[11px] uppercase tracking-wider">Ready for Review Board</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-[var(--color-ink-muted)] font-semibold uppercase tracking-widest px-2">
                <span>Awaiting state certification</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-hairline-strong)] animate-pulse" />
                  <span>Validation active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
