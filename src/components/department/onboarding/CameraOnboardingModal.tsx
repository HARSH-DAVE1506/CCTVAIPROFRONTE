import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { useEmberlyStore } from '../../../store';
import { Camera, CameraFormFactor, StreamProtocol, DiscoveredDevice } from '../../../types';
import { VADODARA_PRESET_LOCATIONS, CAMERA_GROUPS, MODELS } from '../../../data';
import { NetworkDiscoveryScanner } from './NetworkDiscoveryScanner';
import { StreamProbeTester } from './StreamProbeTester';
import { MapView } from '../../map/MapView';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  VideoCamera, 
  WifiHigh, 
  Cpu, 
  ShieldCheck, 
  MapPin, 
  SlidersHorizontal, 
  Sparkle, 
  Broadcast, 
  Cube, 
  Sliders, 
  CheckCircle,
  Plus,
  Buildings,
  LockKey
} from '@phosphor-icons/react';

interface CameraOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraOnboardingModal: React.FC<CameraOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { addCamera, department, cameras } = useEmberlyStore();

  const [onboardingMode, setOnboardingMode] = useState<'DISCOVERY' | 'MANUAL' | 'CATALOGUE'>('MANUAL');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [commissionSuccess, setCommissionSuccess] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Sayaji Baug - Main Gate Pavilion PTZ',
    id: `CAM-VAD-${String(cameras.length + 1).padStart(3, '0')}`,
    department: department || 'Police',
    group: 'Heritage & Public Squares',
    zone: 'Zone 1 - Central Heritage',
    location: 'Sayaji Baug Main Pavilion',
    formFactor: 'PTZ' as CameraFormFactor,
    coordinates: { lat: 22.3129, lng: 73.1883 },
    protocol: 'RTSP' as StreamProtocol,
    streamUrl: `rtsp://103.250.160.189:8554/stream/cam01`,
    substreamUrl: `rtsp://103.250.160.189:8554/stream/cam01`,
    ipAddress: '103.250.160.189',
    port: 554,
    transport: 'TCP',
    username: 'admin_emberly',
    password: '••••••••••••',
    authMethod: 'DIGEST',
    resolution: '4K (3840x2160)',
    fps: 30,
    codec: 'H.265 High Profile',
    bitrate: '8.4 Mbps',
    computeTarget: 'EDGE_GATEWAY' as 'EDGE_GATEWAY' | 'CENTRAL_GPU',
    selectedAiModels: ['Vehicle Intelligence', 'Abandoned Object'] as string[],
    thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=600&h=400&auto=format&fit=crop',
    vendor: 'Axis Communications Q6135-LE',
    roiEnabled: true,
    privacyMasking: false,
    confidenceThreshold: 85
  });

  if (!isOpen) return null;

  const handleSelectDiscoveredDevice = (device: DiscoveredDevice) => {
    setFormData((prev) => ({
      ...prev,
      name: `${device.suggestedLocation} - ${device.vendor.split(' ')[0]}`,
      id: `CAM-${device.id.replace('DISC-', 'VAD-')}`,
      location: device.suggestedLocation,
      group: device.suggestedGroup,
      ipAddress: device.ipAddress,
      port: device.port,
      protocol: device.protocol,
      codec: device.codec,
      resolution: device.resolution,
      fps: device.fps,
      vendor: `${device.vendor} ${device.modelNumber}`,
      thumbnailUrl: device.thumbnailUrl,
      streamUrl: `rtsp://${device.ipAddress}:${device.port}/live/main`
    }));
    setOnboardingMode('MANUAL');
    setCurrentStep(2); // Jump directly to stream config or probe
  };

  const handleSelectCataloguePreset = (preset: typeof VADODARA_PRESET_LOCATIONS[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: `${preset.name} Surveillance`,
      location: preset.name,
      group: preset.group,
      coordinates: { lat: preset.lat, lng: preset.lng },
      streamUrl: `rtsp://stream.vadodara.gov.in:554/live/${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/main`
    }));
    setOnboardingMode('MANUAL');
  };

  const toggleAiModel = (modelName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedAiModels.includes(modelName);
      if (exists) {
        return { ...prev, selectedAiModels: prev.selectedAiModels.filter((m) => m !== modelName) };
      } else {
        return { ...prev, selectedAiModels: [...prev.selectedAiModels, modelName] };
      }
    });
  };

  const handleCommissionCamera = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newCam: Camera = {
        id: formData.id,
        name: formData.name,
        department: formData.department,
        location: formData.location,
        group: formData.group,
        zone: formData.zone,
        status: 'ONLINE',
        aiModels: formData.selectedAiModels,
        resolution: formData.resolution,
        health: 98,
        lastSeen: 'Live Now (30 FPS)',
        coordinates: formData.coordinates,
        protocol: formData.protocol,
        streamUrl: formData.streamUrl,
        substreamUrl: formData.substreamUrl,
        formFactor: formData.formFactor,
        ipAddress: formData.ipAddress,
        port: formData.port,
        codec: formData.codec,
        fps: formData.fps,
        bitrate: formData.bitrate,
        latency: '38 ms',
        vendor: formData.vendor,
        computeTarget: formData.computeTarget,
        thumbnailUrl: formData.thumbnailUrl,
        addedAt: new Date().toISOString().split('T')[0]
      };

      addCamera(newCam);
      setIsSubmitting(false);
      setCommissionSuccess(true);

      setTimeout(() => {
        setCommissionSuccess(false);
        onClose();
      }, 1400);
    }, 1000);
  };

  const steps = [
    { num: 1, label: 'Identity & Geo' },
    { num: 2, label: 'Stream & Auth' },
    { num: 3, label: 'Diagnostics & Probe' },
    { num: 4, label: 'AI Binding' },
    { num: 5, label: 'Commission' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e1017] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
              <VideoCamera size={22} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">CCTV Onboarding Module</h3>
                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-wider font-mono">
                  DEPARTMENT SURVEILLANCE NODE
                </span>
              </div>
              <p className="text-[11px] text-white/40">
                Register new municipal streams, verify RTSP/ONVIF handshake, and bind approved AI capabilities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher Buttons */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => { setOnboardingMode('MANUAL'); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  onboardingMode === 'MANUAL' ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-white/50 hover:text-white"
                )}
              >
                Wizard Entry
              </button>
              <button
                onClick={() => { setOnboardingMode('DISCOVERY'); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                  onboardingMode === 'DISCOVERY' ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-white/50 hover:text-white"
                )}
              >
                <Broadcast size={14} />
                Subnet Auto-Scan
              </button>
              <button
                onClick={() => { setOnboardingMode('CATALOGUE'); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                  onboardingMode === 'CATALOGUE' ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-white/50 hover:text-white"
                )}
              >
                <Buildings size={14} />
                Vadodara Hotspots
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors border border-white/5"
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        </div>

        {/* Wizard Step Progress Indicator (when in MANUAL mode) */}
        {onboardingMode === 'MANUAL' && (
          <div className="px-8 py-3 bg-black/40 border-b border-white/5 flex items-center justify-between">
            {steps.map((step, idx) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <React.Fragment key={step.num}>
                  <div 
                    onClick={() => setCurrentStep(step.num)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-all",
                      isPassed ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]" :
                      isCurrent ? "bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.5)]" :
                      "bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white/60"
                    )}>
                      {isPassed ? <Check size={14} weight="bold" /> : step.num}
                    </div>
                    <span className={cn(
                      "text-xs font-semibold tracking-wide transition-colors",
                      isCurrent ? "text-white" : isPassed ? "text-white/80" : "text-white/30"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-[1px] mx-4 transition-colors",
                      currentStep > idx + 1 ? "bg-green-500/40" : "bg-white/10"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* VIEW: DISCOVERY MODE */}
          {onboardingMode === 'DISCOVERY' && (
            <NetworkDiscoveryScanner onSelectDevice={handleSelectDiscoveredDevice} />
          )}

          {/* VIEW: CATALOGUE MODE */}
          {onboardingMode === 'CATALOGUE' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="text-sm font-bold text-white mb-1">Vadodara Municipal Camera Catalogue</h4>
                <p className="text-xs text-white/40">
                  Select a pre-indexed municipal surveillance point to fast-track onboarding with pre-calibrated geo-coordinates.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {VADODARA_PRESET_LOCATIONS.map((preset, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectCataloguePreset(preset)}
                    className="p-4 rounded-2xl bg-[#13151f] border border-white/5 hover:border-orange-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                        <MapPin size={18} weight="fill" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                          {preset.name}
                        </h5>
                        <span className="text-[10px] text-white/40">{preset.group}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-white/30">
                      <span>{preset.lat.toFixed(4)} N, {preset.lng.toFixed(4)} E</span>
                      <span className="text-orange-500 font-bold group-hover:translate-x-1 transition-transform">Select &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: MANUAL STEP-BY-STEP WIZARD */}
          {onboardingMode === 'MANUAL' && (
            <div>
              {/* STEP 1: IDENTITY & GEO */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Camera Basic Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                          Camera Display Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sayaji Baug North Pavilion PTZ"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Camera System ID
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={formData.id}
                              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Managing Department
                          </label>
                          <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full bg-[#13151f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                          >
                            <option value="Police">Vadodara Police</option>
                            <option value="Health">Department of Health</option>
                            <option value="GSRTC">GSRTC Transit Authority</option>
                            <option value="Municipal">Municipal Corporation (VMC)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Zone / Group
                          </label>
                          <select
                            value={formData.group}
                            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                            className="w-full bg-[#13151f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                          >
                            {CAMERA_GROUPS.filter(g => g !== 'All Cameras').map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Hardware Form Factor
                          </label>
                          <select
                            value={formData.formFactor}
                            onChange={(e) => setFormData({ ...formData, formFactor: e.target.value as CameraFormFactor })}
                            className="w-full bg-[#13151f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                          >
                            <option value="PTZ">PTZ 360 Speed Dome</option>
                            <option value="BULLET">Fixed 4K Bullet</option>
                            <option value="DOME">Vandal Dome</option>
                            <option value="PANORAMIC">Panoramic Fisheye 360</option>
                            <option value="ANPR_LANE">Dedicated ANPR LPR Lane</option>
                            <option value="THERMAL">Dual-Lens Thermal</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                          Hardware Vendor / Model
                        </label>
                        <input
                          type="text"
                          value={formData.vendor}
                          onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                        />
                      </div>
                    </div>

                    {/* Geo Location & Presets */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                          Physical Location Descriptor
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. Sayaji Baug Main Pavilion"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Latitude
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={formData.coordinates.lat}
                            onChange={(e) => setFormData({
                              ...formData,
                              coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Longitude
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={formData.coordinates.lng}
                            onChange={(e) => setFormData({
                              ...formData,
                              coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                      </div>

                      {/* Quick Vadodara Landmark Selector */}
                      <div className="p-4 rounded-2xl bg-[#13151f] border border-white/5 space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 block">
                          Quick Landmark Preset (Vadodara)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {VADODARA_PRESET_LOCATIONS.slice(0, 6).map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                location: preset.name,
                                group: preset.group,
                                coordinates: { lat: preset.lat, lng: preset.lng }
                              })}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-orange-600/20 hover:text-orange-400 border border-white/5 text-[10px] text-white/70 transition-colors"
                            >
                              {preset.name.split(' - ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Map Selector */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          Interactive Spatial Placement
                        </label>
                        <span className="text-[10px] text-orange-500 font-mono">
                          Click on map to precisely calibrate node
                        </span>
                      </div>
                      <div className="h-[240px] w-full rounded-2xl border border-white/10 overflow-hidden relative group">
                        <MapView 
                          center={[formData.coordinates.lng, formData.coordinates.lat]}
                          zoom={14}
                          markers={[{
                            id: 'preview',
                            lng: formData.coordinates.lng,
                            lat: formData.coordinates.lat,
                            color: 'var(--color-ember)'
                          }]}
                          onMapClick={(lng, lat) => setFormData({
                            ...formData,
                            coordinates: { lat, lng }
                          })}
                        />
                        <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/70">
                             {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: STREAM & NETWORK PROTOCOL */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Stream Protocols */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                          Ingestion Protocol
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {(['HTTPS (HLS)', 'RTSP', 'ONVIF', 'WebRTC', 'SRT'] as StreamProtocol[]).map((proto) => (
                            <button
                              key={proto}
                              type="button"
                              onClick={() => setFormData({ ...formData, protocol: proto })}
                              className={cn(
                                "py-2.5 rounded-xl border text-[10px] font-bold uppercase transition-all",
                                formData.protocol === proto 
                                  ? "bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/20" 
                                  : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                              )}
                            >
                              {proto}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                            Primary Monitoring Stream (HLS)
                          </label>
                          <button 
                            type="button"
                            onClick={() => {
                              const camId = formData.id.toLowerCase().replace(/[^a-z0-9]/g, '');
                              setFormData({
                                ...formData,
                                streamUrl: `/api/surveillance/${camId || 'cam01'}/index.m3u8`,
                                protocol: 'HTTPS (HLS)'
                              });
                            }}
                            className="text-[9px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-tight"
                          >
                            Sentinel Quick-Fill (HLS)
                          </button>
                        </div>
                        <input
                          type="text"
                          value={formData.streamUrl}
                          onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                          placeholder="/api/surveillance/cam01/index.m3u8"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                        />
                        <span className="text-[9px] text-white/30 mt-1 block">Used for real-time browser monitoring and dashboard tiles</span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                            AI Analytics Stream (RTSP)
                          </label>
                          <button 
                            type="button"
                            onClick={() => {
                              const email = encodeURIComponent('harsh.dave1506@gmail.com');
                              const pass = 'TYTW-7BJ4-E8LT';
                              const camId = formData.id.toLowerCase().replace(/[^a-z0-9]/g, '');
                              setFormData({
                                ...formData,
                                substreamUrl: `rtsp://${email}:${pass}@103.250.160.189:8554/stream/${camId || 'cam01'}`
                              });
                            }}
                            className="text-[9px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-tight"
                          >
                            Sentinel Quick-Fill (RTSP)
                          </button>
                        </div>
                        <input
                          type="text"
                          value={formData.substreamUrl}
                          onChange={(e) => setFormData({ ...formData, substreamUrl: e.target.value })}
                          placeholder="rtsp://email:password@103.250.160.189:8554/stream/cam01"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                        />
                        <span className="text-[9px] text-white/30 mt-1 block">Used for server-side AI inference, ANPR, and metadata extraction</span>
                      </div>
                    </div>

                    {/* Network & Authentication */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Device IP Address
                          </label>
                          <input
                            type="text"
                            value={formData.ipAddress}
                            onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
                            Port
                          </label>
                          <input
                            type="number"
                            value={formData.port}
                            onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 554 })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#13151f] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                          <LockKey size={16} className="text-orange-500" />
                          <span>Stream Security & Authentication</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-white/30 block mb-1">RTSP Username</label>
                            <input
                              type="text"
                              value={formData.username}
                              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/30 block mb-1">RTSP Password / Token</label>
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                          <span className="text-white/40">Transport Protocol:</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono">TCP Interleaved</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono">Digest Auth</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DIAGNOSTICS & PROBE */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <StreamProbeTester
                    streamUrl={formData.streamUrl}
                    protocol={formData.protocol}
                    ipAddress={formData.ipAddress}
                    port={formData.port}
                    previewImage={formData.thumbnailUrl}
                    onDiagnosticsComplete={(diag) => {
                      setFormData((prev) => ({
                        ...prev,
                        resolution: diag.detectedResolution,
                        codec: diag.detectedCodec,
                        bitrate: diag.measuredBitrate,
                        fps: diag.detectedFps
                      }));
                    }}
                  />
                </div>
              )}

              {/* STEP 4: AI CAPABILITIES BINDING */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Centrally Approved AI Models</h4>
                      <p className="text-xs text-white/40">
                        Bind department-licensed computer vision pipelines to execute on this camera feed.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, computeTarget: 'EDGE_GATEWAY' })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                          formData.computeTarget === 'EDGE_GATEWAY' ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-white/50"
                        )}
                      >
                        <Cpu size={14} />
                        Local Edge Gateway
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, computeTarget: 'CENTRAL_GPU' })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                          formData.computeTarget === 'CENTRAL_GPU' ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-white/50"
                        )}
                      >
                        <Cube size={14} />
                        Central GPU Cluster
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {MODELS.map((model) => {
                      const isSelected = formData.selectedAiModels.includes(model.name);
                      return (
                        <div
                          key={model.id}
                          onClick={() => toggleAiModel(model.name)}
                          className={cn(
                            "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden",
                            isSelected
                              ? "bg-orange-600/10 border-orange-500 shadow-xl shadow-orange-600/10"
                              : "bg-[#13151f] border-white/5 hover:border-white/20 opacity-70 hover:opacity-100"
                          )}
                        >
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-8 h-8 rounded-xl flex items-center justify-center border",
                                  isSelected ? "bg-orange-600 text-white border-orange-500" : "bg-white/5 text-white/40 border-white/10"
                                )}>
                                  <Cube size={18} weight="fill" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">{model.name}</h5>
                                  <span className="text-[9px] font-mono text-white/40">{model.version}</span>
                                </div>
                              </div>

                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center border transition-all",
                                isSelected ? "bg-orange-600 border-orange-500 text-white" : "border-white/20"
                              )}>
                                {isSelected && <Check size={12} weight="bold" />}
                              </div>
                            </div>

                            <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">
                              {model.description}
                            </p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-white/5 text-[10px]">
                            <div className="flex items-center justify-between text-white/40">
                              <span>Model Latency:</span>
                              <span className="text-white font-mono">{model.latency}</span>
                            </div>
                            <div className="flex items-center justify-between text-white/40">
                              <span>Precision Score:</span>
                              <span className="text-green-400 font-mono">{model.accuracy}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & COMMISSION */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Summary Card */}
                    <div className="col-span-7 p-6 rounded-2xl bg-[#13151f] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center">
                            <ShieldCheck size={24} weight="fill" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{formData.name}</h4>
                            <p className="text-[11px] text-white/40">{formData.id} · {formData.department} Department</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[9px] font-bold uppercase font-mono">
                          VERIFIED PROVISION
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Location:</span>
                            <span className="text-white font-semibold">{formData.location}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Zone Group:</span>
                            <span className="text-white font-semibold">{formData.group}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Coordinates:</span>
                            <span className="text-white font-mono">{formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Form Factor:</span>
                            <span className="text-orange-400 font-semibold">{formData.formFactor}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Protocol:</span>
                            <span className="text-white font-mono">{formData.protocol} : {formData.port}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Resolution:</span>
                            <span className="text-white font-semibold">{formData.resolution}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Bitrate & FPS:</span>
                            <span className="text-white font-mono">{formData.bitrate} @ {formData.fps} FPS</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/40">Compute:</span>
                            <span className="text-white font-semibold">{formData.computeTarget}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                          Bound AI Intelligence Modules ({formData.selectedAiModels.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedAiModels.map((m) => (
                            <span key={m} className="px-2.5 py-1 rounded-lg bg-orange-600/20 border border-orange-500/30 text-orange-400 text-xs font-bold">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Snapshot & Policy Confirmation */}
                    <div className="col-span-5 space-y-4">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 relative">
                        <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                            READY FOR INGESTION PIPELINE
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-[11px] text-white/50">
                        <div className="flex items-center gap-2 text-white/80 font-bold">
                          <ShieldCheck size={16} className="text-orange-500" />
                          <span>Audit & Compliance Checklist</span>
                        </div>
                        <p>Stream encryption verified. Retention policy adheres to 30-day municipal regulation. GPS location geo-locked.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
          {onboardingMode === 'MANUAL' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                  } else {
                    onClose();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white/70 hover:text-white transition-all border border-white/5"
              >
                <ArrowLeft size={16} />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex items-center gap-3">
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all shadow-lg shadow-orange-600/30"
                  >
                    <span>Continue: {steps[currentStep]?.label || 'Next'}</span>
                    <ArrowRight size={16} weight="bold" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCommissionCamera}
                    disabled={isSubmitting || commissionSuccess}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-xs font-bold text-white transition-all shadow-xl shadow-green-600/30 disabled:opacity-50"
                  >
                    {commissionSuccess ? (
                      <>
                        <CheckCircle size={18} weight="fill" />
                        <span>Commissioned to Department!</span>
                      </>
                    ) : isSubmitting ? (
                      <span>Activating Ingestion Node...</span>
                    ) : (
                      <>
                        <ShieldCheck size={18} weight="bold" />
                        <span>Commission Camera & Start Feed</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => setOnboardingMode('MANUAL')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all shadow-lg shadow-orange-600/30"
              >
                <span>Switch to Manual Wizard</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
