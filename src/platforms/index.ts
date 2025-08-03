import type { PlatformAdapter } from './types';
import { platformDetector } from './detector';
import { WebPlatformAdapter } from './web/web-adapter';
import { logger } from '../utils/logger';

class PlatformManager {
  private static instance: PlatformManager;
  private adapter: PlatformAdapter | null = null;
  private initPromise: Promise<PlatformAdapter> | null = null;

  private constructor() {}

  static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }
    return PlatformManager.instance;
  }

  async getAdapter(): Promise<PlatformAdapter> {
    if (this.adapter) {
      return this.adapter;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeAdapter();
    this.adapter = await this.initPromise;
    return this.adapter;
  }

  private async initializeAdapter(): Promise<PlatformAdapter> {
    // Check if we're in a Capacitor environment
    if (platformDetector.isCapacitor()) {
      try {
        // Dynamically import Capacitor adapter
        const { CapacitorPlatformAdapter } = await import('./capacitor/capacitor-adapter');
        return new CapacitorPlatformAdapter();
      } catch (error) {
        logger.warn('Failed to load Capacitor adapter, falling back to web', error);
      }
    }

    // Default to web adapter
    return new WebPlatformAdapter();
  }

  // Allow manual override for testing or specific use cases
  setAdapter(adapter: PlatformAdapter): void {
    this.adapter = adapter;
  }

  // Reset the platform manager (useful for testing)
  reset(): void {
    this.adapter = null;
    this.initPromise = null;
  }
}

// Export singleton instance methods
export const platformManager = PlatformManager.getInstance();

// Export platform detection utilities
export { platformDetector } from './detector';

// Export types
export type { 
  PlatformAdapter, 
  PlatformCapabilities, 
  StorageAdapter,
  PlatformDetector 
} from './types';

// Convenience function for getting the current platform adapter
export async function getPlatform(): Promise<PlatformAdapter> {
  return platformManager.getAdapter();
}

// Convenience functions for common operations
export async function scanQRCode(options?: { formats?: string[] }) {
  const platform = await getPlatform();
  return platform.scanQRCode(options);
}

export async function generateQRCode(data: any, options?: any) {
  const platform = await getPlatform();
  return platform.generateQRCode(data, options);
}

export async function scanBarcode(options?: { formats?: any[] }) {
  const platform = await getPlatform();
  return platform.scanBarcode(options);
}

export async function generateBarcode(data: string, format: any, options?: any) {
  const platform = await getPlatform();
  return platform.generateBarcode(data, format, options);
}