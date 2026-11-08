import { api } from './client';

export interface MiningSite {
  id: string;
  name: string;
  operatorName: string;
  wardNumber: number;
  riverBasin: string;
  resourceType: string;
  ieeStatus: string;
  ieeRegistrationNo: string;
  approvedQuotaCuM: number;
  extractedVolumeCuM: number;
  contractPeriod: string;
  royaltyAmountNPR: number;
  riskLevel: string;
  monitoringStatus: string;
  crusherDistanceKm: number;
  gpsCoordinates: { lat: number; lng: number };
  lastInspectedBs: string;
  complianceScore: number;
}

export interface IeeComplianceRecord {
  id: string;
  projectTitle: string;
  proponent: string;
  consultant: string;
  approvalDateBs: string;
  monitoringAuthority: string;
  status: string;
  keyRecommendations: string;
  allocatedMitigationBudgetNPR: number;
  treePlantationTarget: number;
  treesPlanted: number;
}

export interface CommunityForestRecord {
  id: string;
  name: string;
  wardNumber: number;
  cfugName: string;
  areaHectares: number;
  totalHouseholds: number;
  conservationRole: string;
  forestFireRisk: string;
  patrolTeamCount: number;
  treeSpecies: string;
  status: string;
}

export interface EnvironmentalInspection {
  id: string;
  siteId: string;
  siteName: string;
  inspectionDateBs: string;
  inspectorName: string;
  violationsFound: string;
  actionTaken: string;
  status: string;
}

export interface EnvironmentalMiningStats {
  totalMiningSites: number;
  activeMiningSites: number;
  suspendedMiningSites: number;
  totalQuotaCuM: number;
  totalExtractedCuM: number;
  extractionPercent: number;
  totalRoyaltyNPR: number;
  totalIeeRecords: number;
  totalCommunityForests: number;
  totalForestAreaHectares: number;
  totalTreesPlanted: number;
  totalInspections: number;
}

export const environmentalMiningApi = {
  getStats: () => api.get<EnvironmentalMiningStats>('/environmental-mining/stats'),
  getMiningSites: (params?: { ward?: number; status_filter?: string; risk_level?: string; search?: string }) =>
    api.get<MiningSite[]>('/environmental-mining/mining-sites', { params }),
  createMiningSite: (data: Partial<MiningSite>) => api.post<MiningSite>('/environmental-mining/mining-sites', data),
  getIeeRecords: () => api.get<IeeComplianceRecord[]>('/environmental-mining/iee-records'),
  createIeeRecord: (data: Partial<IeeComplianceRecord>) => api.post<IeeComplianceRecord>('/environmental-mining/iee-records', data),
  getCommunityForests: () => api.get<CommunityForestRecord[]>('/environmental-mining/community-forests'),
  getInspections: () => api.get<EnvironmentalInspection[]>('/environmental-mining/inspections'),
  createInspection: (data: Partial<EnvironmentalInspection>) => api.post<EnvironmentalInspection>('/environmental-mining/inspections', data),
};
