/**
 * Offline Sync API Client
 * Manages two-way synchronization between client-side IndexedDB Vault
 * and the Central FastAPI Disaster Backend.
 */

export interface SyncItemPayload {
  local_id: string;
  record_type: string;
  data: Record<string, any>;
  offline_timestamp: string;
}

export interface OfflineBatchSyncPayload {
  tenant_id: string;
  device_id: string;
  synced_by: string;
  items: SyncItemPayload[];
}

export interface OfflineBatchSyncResponse {
  status: 'success' | 'partial' | 'error';
  message: string;
  synced_count: number;
  total_received: number;
  synced_ids: string[];
  details: Array<{
    local_id: string;
    server_id?: string;
    type: string;
    status: 'SYNCED' | 'ERROR';
    error?: string;
  }>;
  device_id: string;
  synced_by: string;
  tenant_id: string;
  server_time: string;
}

export const offlineSyncApi = {
  /**
   * Fetch offline pre-cache package containing emergency shelters,
   * contacts, VHF frequencies, and hotspots.
   */
  async fetchOfflineBundle(tenantId = 'panchpokhari'): Promise<any> {
    const res = await fetch(`/api/v1/disaster/offline-bundle?tenant_id=${encodeURIComponent(tenantId)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch offline bundle (HTTP ${res.status})`);
    }
    return res.json();
  },

  /**
   * Post batch of queued records from IndexedDB to the central backend.
   */
  async syncBatchQueue(payload: OfflineBatchSyncPayload): Promise<OfflineBatchSyncResponse> {
    const res = await fetch('/api/v1/disaster/offline-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Offline sync failed (HTTP ${res.status}): ${errText}`);
    }

    return res.json();
  },
};

export default offlineSyncApi;
