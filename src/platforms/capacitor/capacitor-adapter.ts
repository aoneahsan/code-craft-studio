import type { 
  PlatformAdapter, 
  PlatformCapabilities, 
  StorageAdapter 
} from '../types';
import type {
  QRCodeData,
  QRCodeOptions,
  ScanResult,
  BarcodeFormat,
  BarcodeOptions,
  HistoryItem,
  AnalyticsData,
  ValidationResult,
  ExportOptions
} from '../../definitions';
import { CapacitorStorageAdapter } from '../storage/capacitor-storage';
import { WebPlatformAdapter } from '../web/web-adapter';
import { logger } from '../../utils/logger';

export class CapacitorPlatformAdapter implements PlatformAdapter {
  readonly name = 'capacitor';
  readonly capabilities: PlatformCapabilities;
  readonly storage: StorageAdapter;
  
  private webAdapter: WebPlatformAdapter;
  private plugin: any;
  private capacitorCore: any;

  constructor(storage?: StorageAdapter) {
    this.storage = storage || new CapacitorStorageAdapter();
    this.webAdapter = new WebPlatformAdapter(this.storage);
    
    // Start with web capabilities, will be updated after plugin loads
    this.capabilities = {
      ...this.webAdapter.capabilities,
      hasNativeScanning: false,
      hasNativeGeneration: false
    };
    
    this.loadCapacitorPlugin();
  }

  private async loadCapacitorPlugin(): Promise<void> {
    try {
      // Dynamically import Capacitor
      const { registerPlugin, Capacitor } = await import('@capacitor/core');
      this.capacitorCore = { registerPlugin, Capacitor };
      
      // Set flag for detector
      if (typeof window !== 'undefined') {
        (window as any).__capacitor_loaded__ = true;
      }
      
      // Check if we're on a native platform
      const platform = Capacitor.getPlatform();
      const isNative = platform === 'ios' || platform === 'android';
      
      if (isNative) {
        // Update capabilities for native platform
        this.capabilities.hasNativeScanning = true;
        this.capabilities.hasNativeGeneration = true;
        
        // Register the plugin
        this.plugin = registerPlugin('QRCodeStudio', {
          web: () => this.webAdapter
        });
      }
    } catch (error) {
      logger.warn('CapacitorPlatformAdapter: Failed to load Capacitor plugin, using web fallback', error);
    }
  }

  async scanQRCode(options?: { formats?: string[] }): Promise<ScanResult> {
    if (this.plugin && this.capabilities.hasNativeScanning) {
      try {
        return await this.plugin.scanQRCode(options);
      } catch (error) {
        logger.warn('Native QR scanning failed, falling back to web', error);
      }
    }
    return this.webAdapter.scanQRCode(options);
  }

  async generateQRCode(data: QRCodeData, options?: QRCodeOptions): Promise<{ dataUrl: string }> {
    if (this.plugin && this.capabilities.hasNativeGeneration) {
      try {
        return await this.plugin.generateQRCode({ data, options });
      } catch (error) {
        logger.warn('Native QR generation failed, falling back to web', error);
      }
    }
    return this.webAdapter.generateQRCode(data, options);
  }

  async validateQRData(data: QRCodeData): Promise<ValidationResult> {
    if (this.plugin && this.plugin.validateQRData) {
      try {
        return await this.plugin.validateQRData({ data });
      } catch (error) {
        logger.warn('Native validation failed, falling back to web', error);
      }
    }
    return this.webAdapter.validateQRData(data);
  }

  async scanBarcode(options?: { formats?: BarcodeFormat[] }): Promise<ScanResult> {
    if (this.plugin && this.capabilities.hasNativeScanning) {
      try {
        return await this.plugin.scanBarcode(options);
      } catch (error) {
        logger.warn('Native barcode scanning failed, falling back to web', error);
      }
    }
    return this.webAdapter.scanBarcode(options);
  }

  async generateBarcode(data: string, format: BarcodeFormat, options?: BarcodeOptions): Promise<{ dataUrl: string }> {
    if (this.plugin && this.capabilities.hasNativeGeneration) {
      try {
        return await this.plugin.generateBarcode({ data, format, options });
      } catch (error) {
        logger.warn('Native barcode generation failed, falling back to web', error);
      }
    }
    return this.webAdapter.generateBarcode(data, format, options);
  }

  async validateBarcode(data: string, format: BarcodeFormat): Promise<ValidationResult> {
    if (this.plugin && this.plugin.validateBarcode) {
      try {
        return await this.plugin.validateBarcode({ data, format });
      } catch (error) {
        logger.warn('Native barcode validation failed, falling back to web', error);
      }
    }
    return this.webAdapter.validateBarcode(data, format);
  }

  async saveToHistory(item: HistoryItem): Promise<void> {
    if (this.plugin && this.plugin.saveToHistory) {
      try {
        return await this.plugin.saveToHistory({ item });
      } catch (error) {
        logger.warn('Native history save failed, falling back to web', error);
      }
    }
    return this.webAdapter.saveToHistory(item);
  }

  async getHistory(options?: { limit?: number; type?: string }): Promise<HistoryItem[]> {
    if (this.plugin && this.plugin.getHistory) {
      try {
        const result = await this.plugin.getHistory(options);
        return result.items || [];
      } catch (error) {
        logger.warn('Native history retrieval failed, falling back to web', error);
      }
    }
    return this.webAdapter.getHistory(options);
  }

  async clearHistory(): Promise<void> {
    if (this.plugin && this.plugin.clearHistory) {
      try {
        return await this.plugin.clearHistory();
      } catch (error) {
        logger.warn('Native history clear failed, falling back to web', error);
      }
    }
    return this.webAdapter.clearHistory();
  }

  async getAnalytics(): Promise<AnalyticsData> {
    if (this.plugin && this.plugin.getAnalytics) {
      try {
        return await this.plugin.getAnalytics();
      } catch (error) {
        logger.warn('Native analytics failed, falling back to web', error);
      }
    }
    return this.webAdapter.getAnalytics();
  }

  async exportCode(dataUrl: string, options: ExportOptions): Promise<{ filePath?: string; blob?: Blob }> {
    if (this.plugin && this.plugin.exportCode && this.capacitorCore) {
      try {
        const { Filesystem } = await import('@capacitor/filesystem');
        
        // Convert data URL to base64
        const base64Data = dataUrl.split(',')[1];
        
        // Generate filename
        const timestamp = new Date().getTime();
        const extension = options.format.toLowerCase();
        const fileName = `${options.fileName || 'code'}_${timestamp}.${extension}`;
        
        // Save to device
        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: (Filesystem as any).Directory.Documents
        });
        
        return { filePath: result.uri };
      } catch (error) {
        logger.warn('Native export failed, falling back to web', error);
      }
    }
    return this.webAdapter.exportCode(dataUrl, options);
  }

  async checkPermissions(): Promise<{ camera?: string; storage?: string }> {
    if (this.plugin && this.plugin.checkPermissions) {
      try {
        return await this.plugin.checkPermissions();
      } catch (error) {
        logger.warn('Native permission check failed, falling back to web', error);
      }
    }
    return this.webAdapter.checkPermissions();
  }

  async requestPermissions(): Promise<{ camera?: string; storage?: string }> {
    if (this.plugin && this.plugin.requestPermissions) {
      try {
        return await this.plugin.requestPermissions();
      } catch (error) {
        logger.warn('Native permission request failed, falling back to web', error);
      }
    }
    return this.webAdapter.requestPermissions();
  }
}