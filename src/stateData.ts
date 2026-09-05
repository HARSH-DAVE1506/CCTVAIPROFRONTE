import { 
  DistrictRegion, 
  StateDepartment, 
  ModelStudioProject, 
  ModelRegistryItem, 
  DeploymentTreeItem, 
  StateAlertEvent,
  AIModel
} from './types';

export const STATE_OVERVIEW_METRICS = {
  cameras: {
    total: 80000,
    online: 72431,
    offline: 6218,
    degraded: 1351,
  },
  aiDeployments: {
    active: 12842,
    degraded: 412,
    failed: 37,
    total: 13291,
  },
  intelligence: {
    eventsToday: 124832,
    alerts: 2381,
    high: 143,
    critical: 28,
  }
};

export const GUJARAT_DISTRICTS: DistrictRegion[] = [
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    hindiName: 'अमदावाद',
    cameras: 24650,
    online: 22890,
    health: 96,
    alerts: 892,
    aiDeployments: 4820,
    activeIncidents: 14,
    coordinates: { lat: 23.0225, lng: 72.5714 },
    departmentsActive: ['Police', 'Municipal Corporation', 'GSRTC', 'Health']
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    hindiName: 'वडोदरा',
    cameras: 18420,
    online: 17120,
    health: 94,
    alerts: 540,
    aiDeployments: 3120,
    activeIncidents: 7,
    coordinates: { lat: 22.3072, lng: 73.1812 },
    departmentsActive: ['Police', 'GSRTC', 'Municipal Corporation', 'Health']
  },
  {
    id: 'surat',
    name: 'Surat',
    hindiName: 'सूरत',
    cameras: 19800,
    online: 18100,
    health: 93,
    alerts: 598,
    aiDeployments: 2950,
    activeIncidents: 9,
    coordinates: { lat: 21.1702, lng: 72.8311 },
    departmentsActive: ['Police', 'Municipal Corporation', 'GSRTC']
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    hindiName: 'राजकोट',
    cameras: 9240,
    online: 8210,
    health: 90,
    alerts: 214,
    aiDeployments: 1140,
    activeIncidents: 4,
    coordinates: { lat: 22.3039, lng: 70.8022 },
    departmentsActive: ['Police', 'Health', 'GSRTC']
  },
  {
    id: 'gandhinagar',
    name: 'Gandhinagar',
    hindiName: 'गांधीनगर',
    cameras: 5400,
    online: 4980,
    health: 97,
    alerts: 98,
    aiDeployments: 680,
    activeIncidents: 2,
    coordinates: { lat: 23.2156, lng: 72.6369 },
    departmentsActive: ['Police', 'Panchayat', 'Municipal Corporation']
  },
  {
    id: 'bhavnagar',
    name: 'Bhavnagar',
    hindiName: 'भावनगर',
    cameras: 2490,
    online: 2131,
    health: 88,
    alerts: 39,
    aiDeployments: 132,
    activeIncidents: 1,
    coordinates: { lat: 21.7645, lng: 72.1519 },
    departmentsActive: ['Police', 'GSRTC', 'Panchayat']
  }
];

export const LIVE_STATE_INTELLIGENCE: StateAlertEvent[] = [
  {
    id: 'ALERT-STATE-01',
    title: 'Weapon & Threat Detection',
    severity: 'CRITICAL',
    department: 'Police',
    district: 'Ahmedabad',
    cameraId: 'CAM-023',
    cameraLocation: 'Kalupur Central Railway Concourse',
    model: 'Weapon & Threat Intelligence',
    modelVersion: 'v1.0.0',
    timeAgo: '2 min ago',
    timestamp: '14:48:12 IST',
    confidence: 98.4,
    evidenceSnapshot: 'https://images.unsplash.com/photo-1595062584113-47ba1900f11d?q=80&w=600&auto=format&fit=crop',
    description: 'Concealed firearm geometry detected in Zone 1. Person tracking #9021 flagged with temporal persistence across 3 consecutive frames.'
  },
  {
    id: 'ALERT-STATE-02',
    title: 'Vehicle Identity Mismatch',
    severity: 'HIGH',
    department: 'Municipal Corporation',
    district: 'Surat',
    cameraId: 'CAM-421',
    cameraLocation: 'Varachha Flyover ANPR Gantry 02',
    model: 'Vehicle Identity & Registration Intelligence',
    modelVersion: 'v1.0.0',
    timeAgo: '5 min ago',
    timestamp: '14:45:09 IST',
    confidence: 96.1,
    evidenceSnapshot: 'https://images.unsplash.com/photo-1542128962-9d50ad7bfd14?q=80&w=600&auto=format&fit=crop',
    description: 'Physical optical profile indicates white SUV, but Vahan database lookup returns commercial auto-rickshaw registration GJ-05-BZ-8812.'
  },
  {
    id: 'ALERT-STATE-03',
    title: 'Abandoned Object Detection',
    severity: 'HIGH',
    department: 'GSRTC',
    district: 'Vadodara',
    cameraId: 'CAM-118',
    cameraLocation: 'Vadodara Central Bus Depot - Bay 06',
    model: 'Abandoned Object Intelligence',
    modelVersion: 'v1.1.0',
    timeAgo: '7 min ago',
    timestamp: '14:43:22 IST',
    confidence: 92.8,
    evidenceSnapshot: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600&auto=format&fit=crop',
    description: 'Black duffel luggage left unattended for > 180 seconds without associated owner within 12-meter bounding perimeter.'
  },
  {
    id: 'ALERT-STATE-04',
    title: 'Anomalous Patient Corridor Loitering',
    severity: 'MEDIUM',
    department: 'Health',
    district: 'Rajkot',
    cameraId: 'CAM-088',
    cameraLocation: 'Civil Hospital - Emergency Ward Gate 3',
    model: 'VLM Intelligence',
    modelVersion: 'v1.0.0',
    timeAgo: '12 min ago',
    timestamp: '14:38:40 IST',
    confidence: 89.5,
    evidenceSnapshot: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
    description: 'Multiple unidentified individuals gathered in sterile ambulance turnaround bay blocking emergency transit corridor.'
  },
  {
    id: 'ALERT-STATE-05',
    title: 'Perimeter Intrusion Detection',
    severity: 'MEDIUM',
    department: 'Panchayat',
    district: 'Gandhinagar',
    cameraId: 'CAM-309',
    cameraLocation: 'Koba Rural Water Treatment Facility',
    model: 'Weapon & Threat Intelligence',
    modelVersion: 'v1.0.0',
    timeAgo: '18 min ago',
    timestamp: '14:32:15 IST',
    confidence: 91.2,
    evidenceSnapshot: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=600&auto=format&fit=crop',
    description: 'Person scaled south boundary fence outside approved maintenance shift hours.'
  }
];

export const STATE_DEPARTMENTS: StateDepartment[] = [
  {
    id: 'police',
    name: 'Police Department',
    code: 'POL',
    cameras: 24820,
    online: 22104,
    degraded: 1820,
    offline: 896,
    alerts: 1248,
    aiDeployments: 4210,
    eventsToday: 82421,
    status: 'ACTIVE',
    headquarters: 'State Police HQ, Gandhinagar',
    districtsCovered: ['Ahmedabad', 'Vadodara', 'Surat', 'Rajkot', 'Gandhinagar', 'Bhavnagar'],
    complianceScore: 99.2,
    activeCapabilities: [
      { name: 'Vehicle Intelligence', version: 'v1.2.0', status: 'DEPLOYED', camerasActive: 1980 },
      { name: 'Abandoned Object Intelligence', version: 'v1.1.0', status: 'DEPLOYED', camerasActive: 840 },
      { name: 'Weapon & Threat Intelligence', version: 'v1.0.0', status: 'DEPLOYED', camerasActive: 690 },
      { name: 'Vehicle Identity & Registration', version: 'v1.0.0', status: 'DEPLOYED', camerasActive: 700 },
      { name: 'VLM Intelligence', version: 'v1.0.0', status: 'AVAILABLE', camerasActive: 0 }
    ]
  },
  {
    id: 'gsrtc',
    name: 'GSRTC (Gujarat State Road Transport)',
    code: 'GSRTC',
    cameras: 18420,
    online: 17901,
    degraded: 340,
    offline: 179,
    alerts: 421,
    aiDeployments: 2890,
    eventsToday: 24190,
    status: 'ACTIVE',
    headquarters: 'Central Transport Bhavan, Ahmedabad',
    districtsCovered: ['Ahmedabad', 'Vadodara', 'Surat', 'Rajkot', 'Bhavnagar'],
    complianceScore: 97.8,
    activeCapabilities: [
      { name: 'Abandoned Object Intelligence', version: 'v1.1.0', status: 'DEPLOYED', camerasActive: 1620 },
      { name: 'Vehicle Intelligence', version: 'v1.2.0', status: 'DEPLOYED', camerasActive: 1140 },
      { name: 'Weapon & Threat Intelligence', version: 'v1.0.0', status: 'AVAILABLE', camerasActive: 130 },
      { name: 'VLM Intelligence', version: 'v1.0.0', status: 'AVAILABLE', camerasActive: 0 }
    ]
  },
  {
    id: 'municipal',
    name: 'Municipal Corporation (Urban Local Bodies)',
    code: 'ULB',
    cameras: 20100,
    online: 18402,
    degraded: 1108,
    offline: 590,
    alerts: 542,
    aiDeployments: 3410,
    eventsToday: 15420,
    status: 'ACTIVE',
    headquarters: 'Urban Development Mission, Gandhinagar',
    districtsCovered: ['Ahmedabad', 'Vadodara', 'Surat', 'Rajkot', 'Gandhinagar'],
    complianceScore: 96.5,
    activeCapabilities: [
      { name: 'Vehicle Intelligence', version: 'v1.2.0', status: 'DEPLOYED', camerasActive: 1820 },
      { name: 'Vehicle Identity & Registration', version: 'v1.0.0', status: 'DEPLOYED', camerasActive: 1240 },
      { name: 'Abandoned Object Intelligence', version: 'v1.1.0', status: 'DEPLOYED', camerasActive: 350 },
      { name: 'VLM Intelligence', version: 'v1.0.0', status: 'AVAILABLE', camerasActive: 0 }
    ]
  },
  {
    id: 'health',
    name: 'Health & Family Welfare Department',
    code: 'HFWD',
    cameras: 9210,
    online: 8920,
    degraded: 190,
    offline: 100,
    alerts: 89,
    aiDeployments: 1200,
    eventsToday: 1840,
    status: 'ACTIVE',
    headquarters: 'Swasthya Bhavan, Gandhinagar',
    districtsCovered: ['Ahmedabad', 'Vadodara', 'Rajkot'],
    complianceScore: 98.4,
    activeCapabilities: [
      { name: 'VLM Intelligence', version: 'v1.0.0', status: 'DEPLOYED', camerasActive: 520 },
      { name: 'Abandoned Object Intelligence', version: 'v1.1.0', status: 'DEPLOYED', camerasActive: 680 },
      { name: 'Weapon & Threat Intelligence', version: 'v1.0.0', status: 'RESTRICTED', camerasActive: 0 }
    ]
  },
  {
    id: 'panchayat',
    name: 'Panchayat & Rural Development',
    code: 'PRD',
    cameras: 7450,
    online: 6980,
    degraded: 310,
    offline: 160,
    alerts: 81,
    aiDeployments: 1132,
    eventsToday: 960,
    status: 'ACTIVE',
    headquarters: 'Panchayat Bhavan, Gandhinagar',
    districtsCovered: ['Gandhinagar', 'Bhavnagar', 'Vadodara'],
    complianceScore: 95.1,
    activeCapabilities: [
      { name: 'Weapon & Threat Intelligence', version: 'v1.0.0', status: 'DEPLOYED', camerasActive: 610 },
      { name: 'Vehicle Intelligence', version: 'v1.2.0', status: 'DEPLOYED', camerasActive: 522 },
      { name: 'VLM Intelligence', version: 'v1.0.0', status: 'AVAILABLE', camerasActive: 0 }
    ]
  }
];

export const MARKETPLACE_CAPABILITIES = [
  {
    id: 'cap-01',
    code: '01',
    name: 'Vehicle Intelligence',
    category: 'Vehicle',
    version: 'v1.2.0',
    status: 'APPROVED',
    accuracy: '95.4%',
    latency: '36 ms/frame',
    deployments: 4942,
    compatible: 'CCTV / RTSP (Edge / GPU)',
    capabilities: [
      'Automatic Number Plate Recognition (ANPR)',
      'Vehicle Classification (Make / Model / Color)',
      'Cross-Camera Journey Mapping',
      'Velocity & Wrong-Way Trajectory Estimation',
      'Congestion & Queue Density Measurement'
    ],
    description: 'Enterprise vehicle perception suite capable of multi-lane plate OCR, kinematic vehicle tracking, and state-wide cross-camera journey reconstruction.',
    performance: { precision: 95.4, recall: 94.8, f1Score: 95.1, inferenceMs: 36 },
    availableTo: ['Police', 'Municipal Corporation', 'GSRTC', 'Panchayat']
  },
  {
    id: 'cap-02',
    code: '02',
    name: 'Abandoned Object Intelligence',
    category: 'Object',
    version: 'v1.1.0',
    status: 'APPROVED',
    accuracy: '93.8%',
    latency: '48 ms/frame',
    deployments: 3490,
    compatible: 'CCTV / RTSP (Edge / GPU)',
    capabilities: [
      'Person-to-Object Bounding Association',
      'Abandonment State Machine (>180s threshold)',
      'Luggage & Package Volumetric Tracking',
      'Evidence Frame & Video Clip Isolation',
      'False-Positive Filtering for Seated Passengers'
    ],
    description: 'Temporal state-machine monitoring stationary items in public transit hubs, concourses, and squares with automated carrier disassociation alerts.',
    performance: { precision: 93.8, recall: 92.4, f1Score: 93.1, inferenceMs: 48 },
    availableTo: ['Police', 'GSRTC', 'Municipal Corporation', 'Health']
  },
  {
    id: 'cap-03',
    code: '03',
    name: 'Weapon & Threat Intelligence',
    category: 'Security',
    version: 'v1.0.0',
    status: 'APPROVED',
    accuracy: '94.2%',
    latency: '42 ms/frame',
    deployments: 1430,
    compatible: 'CCTV / RTSP (Central GPU / Edge)',
    capabilities: [
      'Weapon Detection (Firearms & Edged Weapons)',
      'Person Association & Kinematic Threat Posture',
      'Temporal Verification (Multi-frame agreement)',
      'Multi-tiered Threat Severity Scoring',
      'Zone-based Sensitive Perimeter Rules',
      'Automated Evidence Package Compilation',
      'Cross-Camera Re-Identification (Re-ID)'
    ],
    description: 'High-reliability tactical computer vision framework detecting visible weapons, hostile physical gestures, and restricted perimeter breach dynamics.',
    performance: { precision: 94.2, recall: 91.8, f1Score: 92.9, inferenceMs: 42 },
    availableTo: ['Police', 'Panchayat']
  },
  {
    id: 'cap-04',
    code: '04',
    name: 'Vehicle Identity & Registration Intelligence',
    category: 'Analytics',
    version: 'v1.0.0',
    status: 'APPROVED',
    accuracy: '96.2%',
    latency: '52 ms/frame',
    deployments: 1940,
    compatible: 'CCTV / RTSP (Edge / GPU)',
    capabilities: [
      'Optical Character Plate Extraction',
      'Live Vahan / Sarathi Database Synchronization',
      'Physical Vehicle Geometry vs. Paper Match',
      'Stolen Vehicle Hotlist Cross-Matching',
      'Fake / Altered Plate Flagging'
    ],
    description: 'Integrates optical OCR with state vehicle registries to instantly expose counterfeit plates, mismatched vehicle body types, and flagged fugitive vehicles.',
    performance: { precision: 96.2, recall: 95.1, f1Score: 95.6, inferenceMs: 52 },
    availableTo: ['Police', 'Municipal Corporation']
  },
  {
    id: 'cap-05',
    code: '05',
    name: 'VLM Intelligence',
    category: 'VLM',
    version: 'v1.0.0',
    status: 'APPROVED',
    accuracy: '97.6%',
    latency: '~1.8 s/query',
    deployments: 520,
    compatible: 'Central GPU Cluster',
    capabilities: [
      'Natural Language Video Q&A ("Find blue truck at 14:20")',
      'Temporal Event Grounding & Incident Summarization',
      'Cross-Camera Multi-View Visual Reasoning',
      'Semantic Action & Behavior Categorization',
      'Automated Investigation Narrative Drafting'
    ],
    description: 'State-of-the-art multimodal vision-language model allowing investigators to search hundreds of hours of multi-camera CCTV footage using plain speech queries.',
    performance: { precision: 97.6, recall: 96.2, f1Score: 96.9, inferenceMs: 1800 },
    availableTo: ['Police', 'Health', 'Municipal Corporation']
  }
];

export const MODEL_STUDIO_PROJECTS: ModelStudioProject[] = [
  {
    id: 'proj-01',
    name: 'Weapon & Threat Intelligence',
    version: 'v1.1.0',
    category: 'Security',
    stage: 'EVALUATION',
    precision: 94.2,
    recall: 91.8,
    f1Score: 92.9,
    inferenceMs: 42,
    datasetFrames: 148200,
    epochs: 120,
    backbone: 'YOLO-v10x + ViT Pose',
    computeTarget: 'NVIDIA H100 Node Cluster',
    lastTrained: 'Today at 10:14 IST',
    status: 'READY_FOR_APPROVAL'
  },
  {
    id: 'proj-02',
    name: 'Vehicle Intelligence (Night Vision)',
    version: 'v1.3.0-rc1',
    category: 'Vehicle',
    stage: 'VALIDATION',
    precision: 96.1,
    recall: 94.9,
    f1Score: 95.5,
    inferenceMs: 38,
    datasetFrames: 210000,
    epochs: 150,
    backbone: 'Swin-Transformer ANPR',
    computeTarget: 'NVIDIA H100 Node Cluster',
    lastTrained: 'Yesterday at 22:30 IST',
    status: 'ACTIVE'
  },
  {
    id: 'proj-03',
    name: 'Abandoned Object Intelligence',
    version: 'v1.2.0',
    category: 'Object',
    stage: 'TRAINING',
    precision: 91.4,
    recall: 89.2,
    f1Score: 90.3,
    inferenceMs: 45,
    datasetFrames: 98000,
    epochs: 80,
    backbone: 'CenterNet Temporal FSM',
    computeTarget: 'NVIDIA A100 Cluster',
    lastTrained: '2 days ago',
    status: 'ACTIVE'
  },
  {
    id: 'proj-04',
    name: 'Crowd Panic & Stampede Precursor',
    version: 'v0.9.0',
    category: 'Analytics',
    stage: 'DATASET',
    precision: 88.5,
    recall: 84.1,
    f1Score: 86.2,
    inferenceMs: 65,
    datasetFrames: 64000,
    epochs: 45,
    backbone: 'Optical Flow Vector Net',
    computeTarget: 'NVIDIA L40S Cluster',
    lastTrained: '3 days ago',
    status: 'ACTIVE'
  }
];

export const MODEL_REGISTRY_ENTRIES: ModelRegistryItem[] = [
  {
    id: 'reg-01',
    name: 'Vehicle Intelligence',
    version: 'v1.2.0',
    category: 'Vehicle Perception',
    status: 'DEPLOYED',
    deployedCameras: 4942,
    sha256Hash: 'sha256:7f9a88c2e104b6b291dc4f16b228987dafe00912cb849120ba4',
    releaseDate: '2026-06-15',
    testedDataset: 'Gujarat Statewide ANPR Benchmark v3.2 (250k frames)',
    approvedBy: 'Directorate of Forensic Science & State IT Ministry',
    associatedDepartments: ['Police', 'Municipal Corporation', 'GSRTC', 'Panchayat'],
    eventsGenerated: 1249820
  },
  {
    id: 'reg-02',
    name: 'Abandoned Object Intelligence',
    version: 'v1.1.0',
    category: 'Public Safety',
    status: 'DEPLOYED',
    deployedCameras: 3490,
    sha256Hash: 'sha256:4a11be89fc103982da91a0c8842188ef7721bda091104eab841',
    releaseDate: '2026-07-02',
    testedDataset: 'Transit Terminal Luggage Abandonment Dataset (120k frames)',
    approvedBy: 'State Security & Transport Oversight Committee',
    associatedDepartments: ['GSRTC', 'Police', 'Municipal Corporation'],
    eventsGenerated: 24120
  },
  {
    id: 'reg-03',
    name: 'Weapon & Threat Intelligence',
    version: 'v1.0.0',
    category: 'Tactical Defense',
    status: 'DEPLOYED',
    deployedCameras: 1430,
    sha256Hash: 'sha256:1904ea88c71bfa98214de801b69123feaa81923cb98201a4bc2',
    releaseDate: '2026-07-28',
    testedDataset: 'Tactical Arms & Edge Threat Defense Test Bed (180k frames)',
    approvedBy: 'State Police Technical Evaluation Board',
    associatedDepartments: ['Police', 'Panchayat'],
    eventsGenerated: 3821
  },
  {
    id: 'reg-04',
    name: 'Weapon & Threat Intelligence',
    version: 'v1.1.0',
    category: 'Tactical Defense',
    status: 'VALIDATION',
    deployedCameras: 0,
    sha256Hash: 'sha256:99cfa12e88701aa892bbef0119284ba10294e01928bc182948a',
    releaseDate: '2026-09-01',
    testedDataset: 'Low-light tactical simulation suite (148k frames)',
    approvedBy: 'Pending Central Evaluation Board',
    associatedDepartments: ['Police'],
    eventsGenerated: 0
  },
  {
    id: 'reg-05',
    name: 'Vehicle Identity & Registration Intelligence',
    version: 'v1.0.0',
    category: 'Forensic Registry',
    status: 'DEPLOYED',
    deployedCameras: 1940,
    sha256Hash: 'sha256:88fa01bc91726aab1029fe88321049baef881029abce88192aa',
    releaseDate: '2026-08-04',
    testedDataset: 'Sarathi / Vahan Registry Cross-Match Benchmark v1.0',
    approvedBy: 'State Transport Commissionerate',
    associatedDepartments: ['Police', 'Municipal Corporation'],
    eventsGenerated: 18240
  },
  {
    id: 'reg-06',
    name: 'VLM Intelligence',
    version: 'v1.0.0',
    category: 'Multimodal VLM',
    status: 'PUBLISHED',
    deployedCameras: 520,
    sha256Hash: 'sha256:55ab09fe102948bacce781920ba881726fa00192847bbac1092',
    releaseDate: '2026-08-14',
    testedDataset: 'Multi-Camera Spatio-Temporal Video Q&A Evaluation Suite',
    approvedBy: 'State Chief Information Officer & AI Ethics Panel',
    associatedDepartments: ['Police', 'Health'],
    eventsGenerated: 4821
  }
];

export const DEPLOYMENT_TREE: DeploymentTreeItem[] = [
  {
    modelName: 'Vehicle Intelligence',
    modelVersion: 'v1.2.0',
    totalCameras: 4942,
    status: 'ACTIVE',
    departments: [
      {
        name: 'Police Department',
        districts: [
          { name: 'Ahmedabad', cameras: 1420, health: 98 },
          { name: 'Surat', cameras: 980, health: 96 },
          { name: 'Vadodara', cameras: 640, health: 97 },
          { name: 'Rajkot', cameras: 410, health: 94 }
        ]
      },
      {
        name: 'GSRTC',
        districts: [
          { name: 'Ahmedabad', cameras: 890, health: 99 },
          { name: 'Rajkot', cameras: 420, health: 95 }
        ]
      },
      {
        name: 'Municipal Corporation',
        districts: [
          { name: 'Surat', cameras: 710, health: 95 },
          { name: 'Vadodara', cameras: 530, health: 98 }
        ]
      }
    ]
  },
  {
    modelName: 'Weapon & Threat Intelligence',
    modelVersion: 'v1.0.0',
    totalCameras: 1430,
    status: 'ACTIVE',
    departments: [
      {
        name: 'Police Department',
        districts: [
          { name: 'Ahmedabad', cameras: 820, health: 99 },
          { name: 'Vadodara', cameras: 340, health: 98 },
          { name: 'Surat', cameras: 510, health: 97 }
        ]
      }
    ]
  },
  {
    modelName: 'Abandoned Object Intelligence',
    modelVersion: 'v1.1.0',
    totalCameras: 3490,
    status: 'ACTIVE',
    departments: [
      {
        name: 'GSRTC',
        districts: [
          { name: 'Central Transit Hubs (Statewide)', cameras: 1620, health: 97 }
        ]
      },
      {
        name: 'Police Department',
        districts: [
          { name: 'Public Squares & Heritage Corridors', cameras: 840, health: 96 }
        ]
      }
    ]
  },
  {
    modelName: 'Vehicle Identity & Registration Intelligence',
    modelVersion: 'v1.0.0',
    totalCameras: 1940,
    status: 'ACTIVE',
    departments: [
      {
        name: 'Municipal Corporation',
        districts: [
          { name: 'Arterial Checkpoints', cameras: 1240, health: 98 }
        ]
      },
      {
        name: 'Police Department',
        districts: [
          { name: 'State Highway Gates', cameras: 700, health: 99 }
        ]
      }
    ]
  }
];

export const STATE_ANALYTICS_DATA = {
  eventsByModel: [
    { name: 'Vehicle Intelligence', count: 1249820, fill: '#ea580c' },
    { name: 'Abandoned Object', count: 24120, fill: '#f59e0b' },
    { name: 'Weapon & Threat', count: 3821, fill: '#ef4444' },
    { name: 'Vehicle Identity Mismatch', count: 18240, fill: '#3b82f6' },
    { name: 'VLM Intelligence', count: 4821, fill: '#8b5cf6' }
  ],
  departmentComparison: [
    { name: 'Police', cameras: 24820, onlinePct: 89.1, alertsToday: 1248, aiScore: 98 },
    { name: 'GSRTC', cameras: 18420, onlinePct: 97.2, alertsToday: 421, aiScore: 94 },
    { name: 'Municipal', cameras: 20100, onlinePct: 91.5, alertsToday: 542, aiScore: 92 },
    { name: 'Health', cameras: 9210, onlinePct: 96.8, alertsToday: 89, aiScore: 89 },
    { name: 'Panchayat', cameras: 7450, onlinePct: 93.7, alertsToday: 81, aiScore: 86 }
  ],
  hourlyStatewideVolume: [
    { hour: '00:00', events: 3420, alerts: 42 },
    { hour: '04:00', events: 1980, alerts: 18 },
    { hour: '08:00', events: 18400, alerts: 340 },
    { hour: '12:00', events: 28900, alerts: 680 },
    { hour: '16:00', events: 34100, alerts: 790 },
    { hour: '20:00', events: 24100, alerts: 410 },
    { hour: '23:59', events: 13932, alerts: 101 }
  ]
};
