import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { useEmberlyStore } from '../../../store';
import { DiscoveredDevice } from '../../../types';
import { 
  WifiHigh, 
  ArrowsClockwise, 
  CheckCircle, 
  Warning, 
  ArrowRight, 
  Cpu, 
  VideoCamera, 
  SlidersHorizontal,
  Plus,
  Broadcast
} from '@phosphor-icons/react';

interface NetworkDiscoveryScannerProps {
  onSelectDevice: (device: DiscoveredDevice) => void;
}

export const NetworkDiscoveryScanner: React.FC<NetworkDiscoveryScannerProps> = ({ onSelectDevice }) => {
  const { discoveredDevices } = useEmberlyStore();
  const [isScanning, setIsScanning] = useState(false);
  const [subnet, setSubnet] = useState('192.168.40.0/24');
  const [scanProgress, setScanProgress] = useState(100);
  const [scannedCount, setScannedCount] = useState(4);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Scanner Header & Control */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Broadcast size={22} weight="fill" className={cn(isScanning && "animate-pulse text-orange-400")} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Sentinel Subnet Scanner</h4>
              <p className="text-[11px] text-white/40">
                Auto-discover ONVIF Profile S/T and RTSP video streams across the municipal network.
              </p>
            </div>
          </div>

          <button
            onClick={startScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
          >
            <ArrowsClockwise size={16} weight="bold" className={cn(isScanning && "animate-spin")} />
            {isScanning ? 'Probing Subnet...' : 'Scan Subnet'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1">Target Subnet Range</label>
            <input
              type="text"
              value={subnet}
              onChange={(e) => setSubnet(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500/50 font-mono"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1">Protocol Filter</label>
            <div className="flex items-center gap-2 py-1">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/80">ONVIF 2.4+</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/80">RTSP :554</span>
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1">Discovery Status</label>
            <div className="flex items-center gap-2 py-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-bold text-white/70">
                {isScanning ? `Scanning ${scanProgress}%` : `${discoveredDevices.length} Devices Unclaimed`}
              </span>
            </div>
          </div>
        </div>

        {isScanning && (
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-orange-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(234,88,12,0.8)]"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Discovered Cameras Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Discovered Hardware Signals ({discoveredDevices.length})
          </span>
          <span className="text-[10px] text-white/30 font-medium">Click device to prefill onboarding configuration</span>
        </div>

        {discoveredDevices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <CheckCircle size={32} className="text-green-500 mx-auto" weight="fill" />
            <p className="text-sm font-bold text-white">All Discovered Devices Onboarded</p>
            <p className="text-xs text-white/40">Run a new scan to discover recently connected IP cameras on the gateway.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {discoveredDevices.map((device) => (
              <div
                key={device.id}
                onClick={() => onSelectDevice(device)}
                className="p-4 rounded-2xl bg-[#13151f] border border-white/5 hover:border-orange-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-orange-600/5 relative overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-12 rounded-lg bg-black/50 border border-white/10 overflow-hidden relative shrink-0">
                    <img
                      src={device.thumbnailUrl}
                      alt={device.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[7px] font-bold text-orange-400 uppercase">
                      {device.protocol}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h5 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                        {device.name}
                      </h5>
                      <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[8px] font-bold uppercase">
                        READY
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 truncate">{device.vendor} · {device.modelNumber}</p>
                    <p className="text-[9px] font-mono text-orange-500/80 mt-1">{device.ipAddress}:{device.port}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[9px]">
                  <div>
                    <span className="text-white/30 block">Resolution</span>
                    <span className="text-white/70 font-semibold">{device.resolution}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block">Framerate</span>
                    <span className="text-white/70 font-semibold">{device.fps} FPS</span>
                  </div>
                  <div>
                    <span className="text-white/30 block">Codec</span>
                    <span className="text-white/70 font-semibold truncate">{device.codec.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-white/30 font-mono">MAC: {device.macAddress}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                    <span>Onboard</span>
                    <ArrowRight size={12} weight="bold" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
