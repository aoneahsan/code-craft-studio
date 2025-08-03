import type { StorageAdapter } from '../types';
import { logger } from '../../utils/logger';

export class WebStorageAdapter implements StorageAdapter {
  private storage: Storage;
  private prefix: string;

  constructor(useSessionStorage = false, prefix = 'code-craft-studio-') {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.prefix = prefix;
  }

  async get(key: string): Promise<string | null> {
    try {
      return this.storage.getItem(this.prefix + key);
    } catch (error) {
      logger.error('WebStorageAdapter: Error getting item', error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      this.storage.setItem(this.prefix + key, value);
    } catch (error) {
      logger.error('WebStorageAdapter: Error setting item', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      this.storage.removeItem(this.prefix + key);
    } catch (error) {
      logger.error('WebStorageAdapter: Error removing item', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => this.storage.removeItem(key));
    } catch (error) {
      logger.error('WebStorageAdapter: Error clearing storage', error);
      throw error;
    }
  }
}