export type SystemMode = 'CENTRAL' | 'DEPARTMENT';

export type CameraFormFactor = 'PTZ' | 'BULLET' | 'DOME' | 'PANORAMIC' | 'THERMAL' | 'ANPR_LANE';
export type StreamProtocol = 'RTSP' | 'ONVIF' | 'WebRTC' | 'SRT' | 'HTTPS (HLS)';

export interface Camera {
  id: string;
  name?: string;
  department: string;
  location: string;
  group?: string;
  zone?: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'CONNECTING';
  aiModels: string[];
  resolution: string;
  health: number;
  lastSeen: string;
  coordinates: { lat: number; lng: number };
  streamUrl?: string;
  substreamUrl?: string;
  protocol?: StreamProtocol;
  formFactor?: CameraFormFactor;
  ipAddress?: string;
  port?: number;
  codec?: string;
  fps?: number;
  bitrate?: string;
  latency?: string;
  thumbnailUrl?: string;
  vendor?: string;
  macAddress?: string;
  computeTarget?: 'EDGE_GATEWAY' | 'CENTRAL_GPU';
  modelConfigs?: Record<string, Record<string, string | number | boolean>>;
  addedAt?: string;
}

export interface DiscoveredDevice {
  id: string;
  name: string;
  vendor: string;
  ipAddress: string;
  macAddress: string;
  protocol: StreamProtocol;
  modelNumber: string;
  port: number;
  firmware: string;
  suggestedLocation: string;
  suggestedGroup: string;
  resolution: string;
  fps: number;
  codec: string;
  thumbnailUrl: string;
}

export interface StreamDiagnostics {
  pingMs: number;
  socketStatus: 'CONNECTED' | 'FAILED' | 'PROBING';
  rtspHandshake: 'SUCCESS' | 'FAILED' | 'PENDING';
  authMethod: 'DIGEST' | 'BASIC' | 'NONE';
  detectedCodec: string;
  detectedResolution: string;
  detectedFps: number;
  measuredBitrate: string;
  packetLoss: string;
  jitter: string;
  keyframeInterval: string;
  streamHealthScore: number;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  status: 'APPROVED' | 'BETA' | 'PRODUCTION';
  accuracy: string;
  latency: string;
  deployments: number;
  compatible: string;
  capabilities: string[];
  description: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cameraId: string;
  location: string;
  timestamp: string;
  confidence: number;
  status: 'NEW' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'INVESTIGATING' | 'RESOLVED';
  description: string;
  associatedEntity?: string;
}

export interface Investigation {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'AWAITING_REPORT' | 'CLOSED';
  owner: string;
  timestamp: string;
  entities: string[];
  timeline: { time: string; event: string; camera: string }[];
}

export interface Evidence {
  id: string;
  cameraId: string;
  timestamp: string;
  type: 'FRAME' | 'CLIP' | 'SNAPSHOT';
  model: string;
  modelVersion: string;
  confidence: number;
  imageUrl: string;
}

export interface Operator {
  id: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'INVESTIGATOR' | 'VIEWER';
  status: 'ACTIVE' | 'OFFLINE';
  lastActive: string;
  avatar: string;
}

export interface DistrictRegion {
  id: string;
  name: string;
  hindiName?: string;
  cameras: number;
  online: number;
  health: number;
  alerts: number;
  aiDeployments: number;
  activeIncidents: number;
  coordinates: { lat: number; lng: number };
  departmentsActive: string[];
}

export interface StateDepartment {
  id: string;
  name: string;
  code: string;
  cameras: number;
  online: number;
  degraded: number;
  offline: number;
  alerts: number;
  aiDeployments: number;
  eventsToday: number;
  status: 'ACTIVE' | 'PROVISIONING' | 'MAINTENANCE';
  activeCapabilities: {
    name: string;
    version: string;
    status: 'DEPLOYED' | 'AVAILABLE' | 'RESTRICTED';
    camerasActive: number;
  }[];
  districtsCovered: string[];
  headquarters: string;
  complianceScore: number;
}

export interface ModelStudioProject {
  id: string;
  name: string;
  version: string;
  category: string;
  stage: 'IDEA' | 'DATASET' | 'TRAINING' | 'EVALUATION' | 'VALIDATION' | 'PACKAGING' | 'APPROVAL' | 'REGISTRY' | 'MARKETPLACE';
  precision: number;
  recall: number;
  f1Score: number;
  inferenceMs: number;
  datasetFrames: number;
  epochs: number;
  backbone: string;
  computeTarget: string;
  lastTrained: string;
  status: 'ACTIVE' | 'QUEUED' | 'READY_FOR_APPROVAL' | 'SUBMITTED';
}

export interface ModelRegistryItem {
  id: string;
  name: string;
  version: string;
  category: string;
  status: 'DRAFT' | 'TESTING' | 'VALIDATION' | 'APPROVAL' | 'PUBLISHED' | 'DEPLOYED' | 'DEPRECATED' | 'RETIRED';
  deployedCameras: number;
  sha256Hash: string;
  releaseDate: string;
  testedDataset: string;
  approvedBy: string;
  associatedDepartments: string[];
  eventsGenerated: number;
}

export interface DeploymentTreeItem {
  modelName: string;
  modelVersion: string;
  totalCameras: number;
  status: 'ACTIVE' | 'DEPLOYING' | 'DEGRADED' | 'FAILED' | 'QUEUED';
  departments: {
    name: string;
    districts: {
      name: string;
      cameras: number;
      health: number;
    }[];
  }[];
}

export interface StateAlertEvent {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  department: string;
  district: string;
  cameraId: string;
  cameraLocation: string;
  model: string;
  modelVersion: string;
  timeAgo: string;
  timestamp: string;
  confidence: number;
  evidenceSnapshot: string;
  description: string;
}
