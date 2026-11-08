import { api } from './client';

export interface RpoMetric {
  target: string;
  current_effective_rpo: string;
  status: string;
}

export interface RtoMetric {
  target: string;
  current_effective_rto: string;
  status: string;
}

export interface BackupStorageInfo {
  total_snapshots: number;
  total_size_mb: number;
  primary_storage: string;
  offsite_primary_dr: string;
  offsite_secondary_dr: string;
  encryption_protocol: string;
}

export interface BackupSchedule {
  frequency: string;
  scope: string;
  next_run_in: string;
  retention: string;
}

export interface BackupStatusResponse {
  status: string;
  dr_readiness_pct: number;
  rpo_metric: RpoMetric;
  rto_metric: RtoMetric;
  storage: BackupStorageInfo;
  schedules: BackupSchedule[];
  last_backup_time_bs: string;
  last_backup_time_utc: string;
}

export interface BackupSnapshot {
  snapshot_id: string;
  title_np: string;
  title_en: string;
  type: string;
  size_mb: number;
  record_count: number;
  timestamp_bs: string;
  timestamp_utc: string;
  sha256_checksum: string;
  encryption: string;
  storage_tier: string;
  status: string;
  status_label_np: string;
  retention_days: number;
}

export interface DrDrillRecord {
  drill_id: string;
  timestamp_bs: string;
  drill_type: string;
  recovery_point_minutes: number;
  recovery_time_seconds: number;
  data_loss_detected: string;
  integrity_check: string;
  conducted_by: string;
  status: string;
  status_label_np: string;
}

export interface BackupSnapshotsResponse {
  success: boolean;
  total_count: number;
  snapshots: BackupSnapshot[];
  recent_drills: DrDrillRecord[];
}

export const backupApi = {
  getStatus: async (): Promise<BackupStatusResponse> => {
    const res: any = await api.get('/backup/status');
    return res?.data || res;
  },

  getSnapshots: async (): Promise<BackupSnapshotsResponse> => {
    const res: any = await api.get('/backup/snapshots');
    return res?.data || res;
  },

  triggerBackup: async (): Promise<{ success: boolean; message: string; snapshot: BackupSnapshot }> => {
    const res: any = await api.post('/backup/trigger-now');
    return res?.data || res;
  },

  runDrill: async (): Promise<{ success: boolean; message: string; drill: DrDrillRecord }> => {
    const res: any = await api.post('/backup/restore-drill');
    return res?.data || res;
  },

  exportSnapshot: async (snapshotId: string): Promise<any> => {
    const res: any = await api.get(`/backup/export/${snapshotId}`);
    return res?.data || res;
  },
};

export default backupApi;
