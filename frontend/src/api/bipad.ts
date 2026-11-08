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

export interface DhmStation {
  station_id: string;
  station_name_np: string;
  station_name_en: string;
  basin: string;
  elevation_m: number;
  lat: number;
  lng: number;
  current_water_level_m: number;
  warning_level_m: number;
  danger_level_m: number;
  trend: 'rising' | 'falling' | 'steady';
  trend_speed_cm_hr: number;
  discharge_cumecs: number;
  rainfall_24h_mm: number;
  rainfall_1h_mm: number;
  status: 'normal' | 'warning' | 'danger';
  status_label_np: string;
  last_reading_time: string;
  last_reading_bs: string;
  transmission_type: string;
}

export interface DhmTelemetryResponse {
  success: boolean;
  source: string;
  national_portal_reference: string;
  count: number;
  fetched_at: string;
  stations: DhmStation[];
}

export interface SecurityForceUnit {
  unit_id: string;
  agency: string;
  battalion: string;
  contact_callsign: string;
  hotline: string;
  readiness_level: string;
  air_assets: string;
  water_assets: string;
  medical_team: string;
  grid_location: string;
}

export interface SecurityDispatchEntry {
  dispatch_id: string;
  timestamp_bs: string;
  requesting_tier: string;
  target_agency: string;
  hazard_type: string;
  mission: string;
  status: string;
  status_label_np: string;
  units_deployed: string;
}

export interface SecurityForcesResponse {
  success: boolean;
  total_units: number;
  units: SecurityForceUnit[];
  recent_dispatches: SecurityDispatchEntry[];
}

export interface DataStandardModule {
  module_name: string;
  standard: string;
  compliance_pct: number;
  status: string;
  notes: string;
}

export interface DataStandardComplianceResponse {
  standard_version: string;
  overall_compliance_score: number;
  status: string;
  modules: DataStandardModule[];
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

  getDhmTelemetry: async (): Promise<DhmTelemetryResponse> => {
    const res: any = await api.get('/bipad/dhm-telemetry');
    return res?.data || res;
  },

  getSecurityForces: async (): Promise<SecurityForcesResponse> => {
    const res: any = await api.get('/bipad/security-forces');
    return res?.data || res;
  },

  requestSecurityDispatch: async (payload: {
    requesting_tier: string;
    target_agency: string;
    hazard_type: string;
    mission: string;
    units_deployed?: string;
  }): Promise<{ success: boolean; dispatch_id: string; message: string; entry: SecurityDispatchEntry }> => {
    const res: any = await api.post('/bipad/security-dispatch', payload);
    return res?.data || res;
  },

  getDataStandardCompliance: async (): Promise<DataStandardComplianceResponse> => {
    const res: any = await api.get('/bipad/standard-compliance');
    return res?.data || res;
  },

  getCapAlerts: async (): Promise<any> => {
    const res: any = await api.get('/bipad/cap-alerts');
    return res?.data || res;
  },
};


