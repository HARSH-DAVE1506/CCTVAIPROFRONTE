import { create } from 'zustand';
import { SystemMode, Camera, DiscoveredDevice } from './types';
import { CAMERAS, DISCOVERED_DEVICES } from './data';

interface EmberlyState {
  mode: SystemMode;
  department: string;
  cameras: Camera[];
  discoveredDevices: DiscoveredDevice[];
  isOnboardingOpen: boolean;
  selectedCameraDetail: Camera | null;
  setMode: (mode: SystemMode) => void;
  setDepartment: (dept: string) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setSelectedCameraDetail: (camera: Camera | null) => void;
  addCamera: (camera: Camera) => void;
  updateCamera: (id: string, updates: Partial<Camera>) => void;
  deleteCamera: (id: string) => void;
  removeDiscoveredDevice: (id: string) => void;
}

const generateSentinelCameras = (): Camera[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const id = `cam${(i + 1).toString().padStart(2, '0')}`;
    return {
      id,
      name: `Sentinel node ${id.toUpperCase()}`,
      department: 'STATE SURVEILLANCE',
      location: `VADODARA SECTOR ${(i % 5) + 1}`,
      group: 'STRATEGIC INFRASTRUCTURE',
      status: 'ONLINE',
      aiModels: ['Vehicle Intel', 'Crowd Density', 'Object Trace'],
      thumbnailUrl: `/api/surveillance/${id}/thumbnail.jpg`,
      resolution: '4K',
      health: 98,
      lastSeen: 'Live Now',
      coordinates: { 
        lat: 22.3072 + (Math.random() - 0.5) * 0.05, 
        lng: 73.1812 + (Math.random() - 0.5) * 0.05 
      },
      fps: 30,
      protocol: 'HTTPS (HLS)',
      streamUrl: `/api/surveillance/${id}/index.m3u8`,
      substreamUrl: `rtsp://103.250.160.189:8554/stream/${id}`,
      vendor: 'Sentinel Grid'
    };
  });
};

const ONBOARDED_STORAGE_KEY = 'sentinel_onboarded_cameras';

const loadStoredCameras = (): Camera[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(ONBOARDED_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('[Emberly Store] Failed to load stored cameras:', e);
    return [];
  }
};

const saveStoredCameras = (cameras: Camera[]) => {
  if (typeof window === 'undefined') return;
  try {
    // Only persist custom/onboarded cameras that are not part of standard base set
    const customCameras = cameras.filter(c => !c.id.match(/^cam(0[1-9]|[12][0-9]|30)$/));
    localStorage.setItem(ONBOARDED_STORAGE_KEY, JSON.stringify(customCameras));
  } catch (e) {
    console.warn('[Emberly Store] Failed to save cameras:', e);
  }
};

export const useEmberlyStore = create<EmberlyState>((set) => ({
  mode: 'CENTRAL',
  department: 'STATE CONTROL',
  cameras: [...loadStoredCameras(), ...generateSentinelCameras()],
  discoveredDevices: DISCOVERED_DEVICES,
  isOnboardingOpen: false,
  selectedCameraDetail: null,
  setMode: (mode) => set({ mode, department: mode === 'CENTRAL' ? 'STATE CONTROL' : 'POLICE' }),
  setDepartment: (department) => set({ department }),
  setIsOnboardingOpen: (isOnboardingOpen) => set({ isOnboardingOpen }),
  setSelectedCameraDetail: (selectedCameraDetail) => set({ selectedCameraDetail }),
  addCamera: (newCamera) =>
    set((state) => {
      const updated = [newCamera, ...state.cameras.filter(c => c.id !== newCamera.id)];
      saveStoredCameras(updated);
      return {
        cameras: updated,
        discoveredDevices: state.discoveredDevices.filter(d => d.ipAddress !== newCamera.ipAddress),
      };
    }),
  updateCamera: (id, updates) =>
    set((state) => {
      const updated = state.cameras.map((cam) =>
        cam.id === id ? { ...cam, ...updates } : cam
      );
      saveStoredCameras(updated);
      return { cameras: updated };
    }),
  deleteCamera: (id) =>
    set((state) => {
      const updated = state.cameras.filter((cam) => cam.id !== id);
      saveStoredCameras(updated);
      return {
        cameras: updated,
        selectedCameraDetail: state.selectedCameraDetail?.id === id ? null : state.selectedCameraDetail,
      };
    }),
  removeDiscoveredDevice: (id) =>
    set((state) => ({
      discoveredDevices: state.discoveredDevices.filter((d) => d.id !== id),
    })),
}));

