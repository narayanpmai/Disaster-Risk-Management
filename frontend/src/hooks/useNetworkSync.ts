import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  offlineStorageService,
  type OfflineQueueItem,
  type CachedOfflineBundle,
} from '../services/offlineStorageService';
import { offlineSyncApi } from '../api/offlineSync';
import { useDisasterScope } from '../context/DisasterScopeContext';

export interface UseNetworkSyncReturn {
  isOnline: boolean;
  queuedItems: OfflineQueueItem[];
  pendingCount: number;
  isSyncing: boolean;
  lastSyncTime: string | null;
  cachedBundle: CachedOfflineBundle | null;
  storageInfo: { quotaMB: number; usageMB: number; percentage: number };
  refreshQueue: () => Promise<void>;
  enqueueItem: (
    recordType: OfflineQueueItem['recordType'],
    title: string,
    wardNumber: number,
    data: Record<string, any>
  ) => Promise<OfflineQueueItem>;
  triggerManualSync: () => Promise<number>;
  clearSyncedRecords: () => Promise<number>;
  deleteRecord: (localId: string) => Promise<void>;
  downloadOfflineBundle: () => Promise<void>;
  exportVaultData: () => Promise<void>;
  importVaultData: (file: File) => Promise<number>;
}

export const useNetworkSync = (): UseNetworkSyncReturn => {
  const { currentPalika } = useDisasterScope();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queuedItems, setQueuedItems] = useState<OfflineQueueItem[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [cachedBundle, setCachedBundle] = useState<CachedOfflineBundle | null>(null);
  const [storageInfo, setStorageInfo] = useState({ quotaMB: 500, usageMB: 1.2, percentage: 0.2 });

  const isSyncingRef = useRef(false);

  // Load current queue & bundle from IndexedDB
  const refreshQueue = useCallback(async () => {
    try {
      const items = await offlineStorageService.getAllQueueItems();
      setQueuedItems(items);
      const pending = items.filter((i) => i.syncStatus === 'PENDING' || i.syncStatus === 'FAILED');
      setPendingCount(pending.length);

      const bundle = await offlineStorageService.getCachedOfflineBundle();
      if (bundle) setCachedBundle(bundle);

      const est = await offlineStorageService.estimateStorageUsage();
      setStorageInfo(est);
    } catch (e) {
      console.warn('Notice reading IndexedDB queue:', e);
    }
  }, []);

  // Perform background or manual sync of pending items
  const triggerManualSync = useCallback(async (): Promise<number> => {
    if (isSyncingRef.current) return 0;

    const pending = await offlineStorageService.getPendingQueueItems();
    if (pending.length === 0) {
      toast.success('सबै रेकर्डहरू पहिले नै सिङ्क भइसकेका छन् (No pending records).', { id: 'sync-status' });
      return 0;
    }

    if (!navigator.onLine) {
      toast.error('इन्टरनेट जडान छैन! कृपया नेटवर्क जोडिएपछि पुनः प्रयास गर्नुहोस्।', { id: 'sync-offline' });
      return 0;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);
    toast.loading(`अफलाइन कतारका ${pending.length} वटा रेकर्ड सिङ्क गरिँदैछ...`, { id: 'sync-progress' });

    try {
      // Mark as SYNCING in IndexedDB
      for (const item of pending) {
        await offlineStorageService.updateItemStatus(item.localId, 'SYNCING');
      }
      await refreshQueue();

      const payload = {
        tenant_id: currentPalika?.id || 'panchpokhari',
        device_id: typeof window !== 'undefined' ? `PWA-CLIENT-${window.navigator.userAgent.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '')}` : 'PWA-CLIENT',
        synced_by: 'LEOC Field Responder',
        items: pending.map((item) => ({
          local_id: item.localId,
          record_type: item.recordType,
          data: item.data,
          offline_timestamp: item.offlineTimestamp,
        })),
      };

      const res = await offlineSyncApi.syncBatchQueue(payload);

      // Mark returned IDs as SYNCED
      const syncedIds = new Set(res.synced_ids || []);
      for (const item of pending) {
        if (syncedIds.has(item.localId)) {
          await offlineStorageService.updateItemStatus(item.localId, 'SYNCED');
        } else {
          await offlineStorageService.updateItemStatus(item.localId, 'FAILED', 'Server did not acknowledge ID');
        }
      }

      setLastSyncTime(new Date().toLocaleTimeString('ne-NP'));
      toast.success(
        `सफलतापूर्वक ${res.synced_count} वटा अफलाइन रेकर्ड केन्द्रीय प्रणालीमा सिङ्क भयो!`,
        { id: 'sync-progress', duration: 4000 }
      );

      await refreshQueue();
      return res.synced_count;
    } catch (err: any) {
      console.error('Batch sync error:', err);
      // Mark as FAILED
      for (const item of pending) {
        await offlineStorageService.updateItemStatus(item.localId, 'FAILED', err?.message || 'Sync Network Error');
      }
      toast.error(`सिङ्क असफल: ${err?.message || 'सर्भर सम्पर्क हुन सकेन'}`, { id: 'sync-progress' });
      await refreshQueue();
      return 0;
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [currentPalika?.id, refreshQueue]);

  // Network Listeners & Auto-Sync
  useEffect(() => {
    refreshQueue();

    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🌐 इन्टरनेट जडान पुनः स्थापित भयो! पृष्ठभूमि सिङ्क सुरु हुँदैछ...', { id: 'net-status' });
      // Trigger background sync after slight delay
      setTimeout(() => {
        triggerManualSync();
      }, 1200);
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast('🟠 इन्टरनेट विच्छेद भयो। स्थानीय IndexedDB भण्डार सक्रिय छ।', {
        id: 'net-status',
        icon: '📡',
        duration: 4000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshQueue, triggerManualSync]);

  // Enqueue Item
  const enqueueItem = async (
    recordType: OfflineQueueItem['recordType'],
    title: string,
    wardNumber: number,
    data: Record<string, any>
  ): Promise<OfflineQueueItem> => {
    const item = await offlineStorageService.enqueueItem(recordType, title, wardNumber, data);
    await refreshQueue();

    // If online, attempt background sync immediately
    if (navigator.onLine && !isSyncingRef.current) {
      setTimeout(() => {
        triggerManualSync();
      }, 800);
    }

    return item;
  };

  // Clear Synced
  const clearSyncedRecords = async (): Promise<number> => {
    const count = await offlineStorageService.clearSyncedItems();
    await refreshQueue();
    toast.success(`${count} वटा सिङ्क भइसकेका रेकर्ड कतारबाट हटाइयो।`);
    return count;
  };

  // Delete Record
  const deleteRecord = async (localId: string): Promise<void> => {
    await offlineStorageService.deleteQueueItem(localId);
    await refreshQueue();
    toast.success('रेकर्ड कतारबाट हटाइयो।');
  };

  // Pre-cache bundle
  const downloadOfflineBundle = async (): Promise<void> => {
    try {
      toast.loading('पालिका अफलाइन डाटाबन्डल डाउनलोड गरिँदैछ...', { id: 'bundle-dl' });
      const bundle = await offlineSyncApi.fetchOfflineBundle(currentPalika?.id || 'panchpokhari');
      await offlineStorageService.saveOfflineBundle(bundle);
      setCachedBundle(bundle);
      await refreshQueue();
      toast.success(
        `डाटाबन्डल सुरक्षित भयो! ${bundle.total_records || 8} वटा आपतकालीन रेकर्डहरू इन्टरनेट नहुँदा पनि उपलब्ध छन्।`,
        { id: 'bundle-dl', duration: 4500 }
      );
    } catch (e: any) {
      toast.error(`डाटाबन्डल डाउनलोड असफल: ${e?.message}`, { id: 'bundle-dl' });
    }
  };

  // Export JSON
  const exportVaultData = async (): Promise<void> => {
    try {
      const jsonStr = await offlineStorageService.exportVaultJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nepal-drrm-offline-vault-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('अफलाइन डाटा JSON फाइल डाउनलोड भयो (USB/VHF ब्याकअपको लागि तयार)!');
    } catch (e: any) {
      toast.error(`डाटा निर्यात गर्न सकिएन: ${e?.message}`);
    }
  };

  // Import JSON
  const importVaultData = async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const count = await offlineStorageService.importVaultJSON(content);
          await refreshQueue();
          toast.success(`सफलतापूर्वक ${count} वटा रेकर्ड आयात गरियो!`);
          resolve(count);
        } catch (err: any) {
          toast.error(`डाटा आयात असफल: ${err?.message}`);
          reject(err);
        }
      };
      reader.onerror = () => {
        toast.error('फाइल पढ्न सकिएन।');
        reject(new Error('File read error'));
      };
      reader.readAsText(file);
    });
  };

  return {
    isOnline,
    queuedItems,
    pendingCount,
    isSyncing,
    lastSyncTime,
    cachedBundle,
    storageInfo,
    refreshQueue,
    enqueueItem,
    triggerManualSync,
    clearSyncedRecords,
    deleteRecord,
    downloadOfflineBundle,
    exportVaultData,
    importVaultData,
  };
};

export default useNetworkSync;
