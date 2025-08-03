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
import { QRType } from '../../definitions';
import { WebStorageAdapter } from '../storage/web-storage';
import QrScanner from 'qr-scanner';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { 
  validateQRCodeData,
  validateBarcodeData
} from '../../utils/validation';
import { formatQRData } from '../../utils/qr-formatter';
import { logger } from '../../utils/logger';

export class WebPlatformAdapter implements PlatformAdapter {
  readonly name = 'web';
  readonly capabilities: PlatformCapabilities = {
    hasNativeScanning: false,
    hasNativeGeneration: false,
    hasOfflineStorage: true,
    hasFileAccess: true,
    hasCameraAccess: true,
    supportedBarcodeFormats: [
      'EAN_13', 'EAN_8', 'UPC_A', 'UPC_E', 'CODE_128',
      'CODE_39', 'CODE_93', 'ITF', 'CODABAR', 'QR_CODE',
      'DATA_MATRIX', 'PDF_417', 'AZTEC'
    ] as BarcodeFormat[],
    supportedExportFormats: ['PNG', 'JPG', 'SVG', 'PDF', 'JSON', 'WEBP']
  };
  readonly storage: StorageAdapter;

  private qrScanner: QrScanner | null = null;
  private barcodeReader: BrowserMultiFormatReader | null = null;
  private currentStream: MediaStream | null = null;

  constructor(storage?: StorageAdapter) {
    this.storage = storage || new WebStorageAdapter();
  }

  async scanQRCode(_options?: { formats?: string[] }): Promise<ScanResult> {
    try {
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);

      let scanResolve: ((result: ScanResult) => void) | null = null;
      
      this.qrScanner = new QrScanner(video, result => {
        if (scanResolve) {
          scanResolve({
            content: result.data,
            format: 'QR_CODE' as BarcodeFormat,
            type: QRType.TEXT,
            timestamp: Date.now()
          });
          this.stopScanning();
          document.body.removeChild(video);
        }
      }, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });

      const result = await new Promise<ScanResult>((resolve, reject) => {
        if (!this.qrScanner) {
          reject(new Error('Scanner not initialized'));
          return;
        }

        scanResolve = resolve;
        this.qrScanner.start().catch(reject);
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to scan QR code: ${error}`);
    }
  }

  async generateQRCode(data: QRCodeData, options?: QRCodeOptions): Promise<{ dataUrl: string }> {
    try {
      const formattedData = formatQRData(data);
      
      const qrOptions = {
        errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        type: 'image/png' as const,
        quality: options?.quality || 0.92,
        margin: options?.margin || 1,
        color: {
          dark: options?.color || '#000000',
          light: options?.backgroundColor || '#FFFFFF'
        },
        width: options?.width || 256,
      };

      const dataUrl = await QRCode.toDataURL(formattedData, qrOptions);
      
      if (options?.logo) {
        // Add logo overlay logic here if needed
      }

      return { dataUrl };
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  async validateQRData(data: QRCodeData): Promise<ValidationResult> {
    return validateQRCodeData(data);
  }

  async scanBarcode(_options?: { formats?: BarcodeFormat[] }): Promise<ScanResult> {
    try {
      if (!this.barcodeReader) {
        this.barcodeReader = new BrowserMultiFormatReader();
      }

      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId;

      const video = document.createElement('video');
      video.style.position = 'fixed';
      video.style.top = '0';
      video.style.left = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.zIndex = '9999';
      document.body.appendChild(video);

      const result = await new Promise<any>((resolve, reject) => {
        this.barcodeReader!.decodeFromVideoDevice(
          selectedDeviceId,
          video,
          (result, _error) => {
            if (result) {
              this.stopScanning();
              document.body.removeChild(video);
              resolve(result);
            }
          }
        ).catch(reject);
      });

      return {
        content: result.getText(),
        format: result.getBarcodeFormat().toString() as BarcodeFormat,
        type: QRType.TEXT,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to scan barcode: ${error}`);
    }
  }

  async generateBarcode(data: string, format: BarcodeFormat, options?: BarcodeOptions): Promise<{ dataUrl: string }> {
    try {
      const canvas = document.createElement('canvas');
      
      const barcodeOptions = {
        format: this.mapBarcodeFormat(format),
        width: options?.width || 2,
        height: options?.height || 100,
        displayValue: options?.showText !== false,
        text: data,
        fontSize: options?.fontSize || 20,
        textMargin: options?.textMargin || 2,
        margin: options?.margin || 10,
        background: options?.backgroundColor || '#FFFFFF',
        lineColor: options?.color || '#000000'
      };

      JsBarcode(canvas, data, barcodeOptions);
      
      const dataUrl = canvas.toDataURL('image/png');
      return { dataUrl };
    } catch (error) {
      throw new Error(`Failed to generate barcode: ${error}`);
    }
  }

  async validateBarcode(data: string, format: BarcodeFormat): Promise<ValidationResult> {
    return validateBarcodeData(data, format);
  }

  async saveToHistory(item: HistoryItem): Promise<void> {
    try {
      const historyJson = await this.storage.get('history');
      const history = historyJson ? JSON.parse(historyJson) : [];
      history.unshift(item);
      
      // Keep only last 100 items
      if (history.length > 100) {
        history.length = 100;
      }
      
      await this.storage.set('history', JSON.stringify(history));
    } catch (error) {
      logger.error('Failed to save to history:', error);
      throw error;
    }
  }

  async getHistory(options?: { limit?: number; type?: string }): Promise<HistoryItem[]> {
    try {
      const historyJson = await this.storage.get('history');
      let history = historyJson ? JSON.parse(historyJson) : [];
      
      if (options?.type) {
        history = history.filter((item: HistoryItem) => item.type === options.type);
      }
      
      if (options?.limit) {
        history = history.slice(0, options.limit);
      }
      
      return history;
    } catch (error) {
      logger.error('Failed to get history:', error);
      return [];
    }
  }

  async clearHistory(): Promise<void> {
    await this.storage.remove('history');
  }

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const analyticsJson = await this.storage.get('analytics');
      return analyticsJson ? JSON.parse(analyticsJson) : {
        totalScans: 0,
        totalGenerations: 0,
        scansByType: {},
        generationsByType: {},
        exportsByFormat: {},
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to get analytics:', error);
      return {
        totalScans: 0,
        totalGenerations: 0,
        scansByType: {},
        generationsByType: {},
        exportsByFormat: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }

  async exportCode(dataUrl: string, options: ExportOptions): Promise<{ filePath?: string; blob?: Blob }> {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (options.format === 'png' || options.format === 'jpg' || options.format === 'webp') {
        // Convert if needed
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = dataUrl;
        });
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const convertedBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, `image/${options.format.toLowerCase()}`);
        });
        
        return { blob: convertedBlob };
      }
      
      return { blob };
    } catch (error) {
      throw new Error(`Failed to export code: ${error}`);
    }
  }

  async checkPermissions(): Promise<{ camera?: string; storage?: string }> {
    const permissions: { camera?: string; storage?: string } = {};
    
    try {
      const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      permissions.camera = cameraResult.state;
    } catch (_error) {
      permissions.camera = 'prompt';
    }
    
    permissions.storage = 'granted'; // Always granted for localStorage
    
    return permissions;
  }

  async requestPermissions(): Promise<{ camera?: string; storage?: string }> {
    const permissions: { camera?: string; storage?: string } = {};
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      permissions.camera = 'granted';
    } catch (_error) {
      permissions.camera = 'denied';
    }
    
    permissions.storage = 'granted';
    
    return permissions;
  }

  private stopScanning(): void {
    if (this.qrScanner) {
      this.qrScanner.stop();
      this.qrScanner.destroy();
      this.qrScanner = null;
    }
    
    if (this.barcodeReader) {
      // Reset barcode reader if needed
      this.barcodeReader = null;
    }
    
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
  }

  private mapBarcodeFormat(format: BarcodeFormat): string {
    const formatMap: Record<string, string> = {
      'EAN_13': 'EAN13',
      'EAN_8': 'EAN8',
      'UPC_A': 'UPC',
      'UPC_E': 'UPC_E',
      'CODE_128': 'CODE128',
      'CODE_39': 'CODE39',
      'CODE_93': 'CODE93',
      'ITF': 'ITF',
      'CODABAR': 'codabar',
      'QR_CODE': 'qrcode',
      'DATA_MATRIX': 'datamatrix',
      'PDF_417': 'pdf417',
      'AZTEC': 'aztec'
    };
    
    return formatMap[format] || format.toLowerCase();
  }
}