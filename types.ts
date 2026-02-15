
export interface ScanResult {
  url: string;
  ipAddress: string;
  serverLocation: string;
  hostingProvider: string;
  techStack: string[];
  performanceScore: number;
  loadInfo: {
    avgResponseTime: string;
    trafficVolume: string;
    serverStatus: string;
    pageSize: string;
  };
  securityAnalysis: string;
  summary: string;
  sources: { title: string; uri: string }[];
  sslDetails: string;
  mxRecords: string[];
  subdomains: string[];
  vulnerabilities: string[];
  ddosResilience: number;
  openPorts: string[];
  // New deep info fields
  cdnProvider: string;
  dnsPropagation: { region: string; status: 'resolved' | 'pending' | 'failed' }[];
  securityHeaders: { name: string; status: 'present' | 'missing' }[];
  globalNodes: string[];
  whoisData: { created: string; expiry: string; registrar: string };
}

export enum AppStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  STRESS_TESTING = 'STRESS_TESTING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
