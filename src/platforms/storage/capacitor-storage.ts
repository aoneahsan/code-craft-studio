import type { StorageAdapter } from '../types';

export class CapacitorStorageAdapter implements StorageAdapter {
  private preferences: any;
  private prefix: string;

  constructor(prefix = 'code-craft-studio-') {
    this.prefix = prefix;
    this.loadPreferences();
  }

  private async loadPreferences() {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      this.preferences = Preferences;
    } catch (error) {
      console.warn('CapacitorStorageAdapter: @capacitor/preferences not available, falling back to localStorage');
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.preferences) {
      return localStorage.getItem(this.prefix + key);
    }

    try {
      const result = await this.preferences.get({ key: this.prefix + key });
      return result.value || null;
    } catch (error) {
      console.error('CapacitorStorageAdapter: Error getting item', error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    if (!this.preferences) {
      localStorage.setItem(this.prefix + key, value);
      return;
    }

    try {
      await this.preferences.set({ key: this.prefix + key, value });
    } catch (error) {
      console.error('CapacitorStorageAdapter: Error setting item', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    if (!this.preferences) {
      localStorage.removeItem(this.prefix + key);
      return;
    }

    try {
      await this.preferences.remove({ key: this.prefix + key });
    } catch (error) {
      console.error('CapacitorStorageAdapter: Error removing item', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    if (!this.preferences) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return;
    }

    try {
      const { keys } = await this.preferences.keys();
      const keysToRemove = keys.filter((key: string) => key.startsWith(this.prefix));
      await Promise.all(keysToRemove.map((key: string) => this.preferences.remove({ key })));
    } catch (error) {
      console.error('CapacitorStorageAdapter: Error clearing storage', error);
      throw error;
    }
  }
}