import { api } from './client';

export interface BipadConfig {
  palika_code: string;
  palika_name_np: string;
  palika_name_en: string;
  district: string;
  province: string;
  bipad_api_endpoint: string;
  dhm_hydromet_endpoint: string;
  sync_mode: string;
}

export interface BipadSyncState {
  lastSyncedAt: string;
  lastSyncedBs: string;
  totalPalikaIncidents: number;
  totalSyncedIncidents: number;
  pendingSync: number;
  gatewayStatus: string;
  lastHttpStatus: string;
}

export interface BipadStatusResponse {
  status: string;
  config: BipadConfig;
  syncState: BipadSyncState;
  nationalAdvisoriesCount: number;
}

export interface NationalAdvisory {
  id: string;
  issuing_authority: string;
  hazard_type: string;
  severity: string;
  river_basins: string[];
  districts_affected: string[];
  headline_np: string;
  description_np: string;
  valid_until_bs: string;
  risk_level_code: string;
}

export interface NationalAlertsResponse {
  total: number;
  advisories: NationalAdvisory[];
  source: string;
  fetchedAt: string;
}

export interface BipadSyncResult {
  success: boolean;
  message: string;
  syncedRecordsCount: number;
  syncedAtBs: string;
  targetGateway: string;
  records: any[];
}

export const bipadApi = {
  getStatus: async (): Promise<BipadStatusResponse> => {
    const res: any = await api.get('/bipad/status');
    return res?.data || res;
  },

  getNationalAlerts: async (): Promise<NationalAlertsResponse> => {
    const res: any = await api.get('/bipad/national-alerts');
    return res?.data || res;
  },

  syncIncidents: async (): Promise<BipadSyncResult> => {
    const res: any = await api.post('/bipad/sync-incidents');
    return res?.data || res;
  },

  exportGeoJson: async (): Promise<any> => {
    const res: any = await api.get('/bipad/export-geojson');
    return res?.data || res;
  },
};

