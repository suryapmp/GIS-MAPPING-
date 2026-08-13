import { OfflineSyncItem } from '../../types/groundwater';

const STORAGE_KEY = 'hydro_offline_sync_queue';

export class OfflineSyncService {
  private queue: OfflineSyncItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read offline sync queue from localStorage', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('Could not write offline sync queue to localStorage', e);
    }
  }

  enqueue(entityType: OfflineSyncItem['entityType'], data: any): OfflineSyncItem {
    const item: OfflineSyncItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      entityType,
      data,
      queuedAt: new Date().toISOString(),
      status: 'pending',
      retryCount: 0
    };

    this.queue.unshift(item);
    this.saveToStorage();
    return item;
  }

  getPendingItems(): OfflineSyncItem[] {
    return this.queue.filter((i) => i.status === 'pending');
  }

  getAllItems(): OfflineSyncItem[] {
    return this.queue;
  }

  async syncAllPending(onSuccess?: (syncedCount: number) => void): Promise<{ successCount: number; failedCount: number }> {
    const pending = this.getPendingItems();
    if (pending.length === 0) return { successCount: 0, failedCount: 0 };

    let successCount = 0;
    let failedCount = 0;

    for (const item of pending) {
      try {
        // Simulate remote server/firestore synchronization
        await new Promise((res) => setTimeout(res, 200));
        item.status = 'synced';
        successCount++;
      } catch (err: any) {
        item.status = 'failed';
        item.retryCount += 1;
        item.error = err.message || 'Sync failed';
        failedCount++;
      }
    }

    this.saveToStorage();
    if (onSuccess) onSuccess(successCount);
    return { successCount, failedCount };
  }

  clearSynced() {
    this.queue = this.queue.filter((i) => i.status !== 'synced');
    this.saveToStorage();
  }
}

export const offlineSyncService = new OfflineSyncService();
