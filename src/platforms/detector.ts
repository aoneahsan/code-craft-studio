import type { PlatformDetector } from './types';

class PlatformDetectorImpl implements PlatformDetector {
  private _isCapacitor: boolean | null = null;

  isCapacitor(): boolean {
    if (this._isCapacitor === null) {
      this._isCapacitor = this.detectCapacitor();
    }
    return this._isCapacitor;
  }

  isWeb(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  isNative(): boolean {
    return this.isCapacitor() && (this.isIOS() || this.isAndroid());
  }

  getPlatformName(): string {
    if (this.isCapacitor()) {
      if (this.isIOS()) return 'ios';
      if (this.isAndroid()) return 'android';
      return 'capacitor-web';
    }
    return 'web';
  }

  private detectCapacitor(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check for Capacitor global
    if ('Capacitor' in window && (window as any).Capacitor) {
      return true;
    }

    // Check for @capacitor/core module dynamically
    try {
      // Use dynamic import check
      if (typeof window !== 'undefined' && (window as any).__capacitor_loaded__) {
        return true;
      }
    } catch {
      // Ignore errors
    }
    
    return false;
  }

  private isIOS(): boolean {
    if (!this.isCapacitor()) return false;
    
    // Check if we have Capacitor global
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      return (window as any).Capacitor.getPlatform() === 'ios';
    }
    
    return false;
  }

  private isAndroid(): boolean {
    if (!this.isCapacitor()) return false;
    
    // Check if we have Capacitor global
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      return (window as any).Capacitor.getPlatform() === 'android';
    }
    
    return false;
  }
}

export const platformDetector = new PlatformDetectorImpl();