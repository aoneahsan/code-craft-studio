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
} from '../definitions';

export interface PlatformCapabilities {
  hasNativeScanning: boolean;
  hasNativeGeneration: boolean;
  hasOfflineStorage: boolean;
  hasFileAccess: boolean;
  hasCameraAccess: boolean;
  supportedBarcodeFormats: BarcodeFormat[];
  supportedExportFormats: string[];
}

export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface PlatformAdapter {
  readonly name: string;
  readonly capabilities: PlatformCapabilities;
  readonly storage: StorageAdapter;

  // QR Code methods
  scanQRCode(options?: { formats?: string[] }): Promise<ScanResult>;
  generateQRCode(data: QRCodeData, options?: QRCodeOptions): Promise<{ dataUrl: string }>;
  validateQRData(data: QRCodeData): Promise<ValidationResult>;

  // Barcode methods
  scanBarcode(options?: { formats?: BarcodeFormat[] }): Promise<ScanResult>;
  generateBarcode(data: string, format: BarcodeFormat, options?: BarcodeOptions): Promise<{ dataUrl: string }>;
  validateBarcode(data: string, format: BarcodeFormat): Promise<ValidationResult>;

  // History and Analytics
  saveToHistory(item: HistoryItem): Promise<void>;
  getHistory(options?: { limit?: number; type?: string }): Promise<HistoryItem[]>;
  clearHistory(): Promise<void>;
  getAnalytics(): Promise<AnalyticsData>;

  // Export functionality
  exportCode(dataUrl: string, options: ExportOptions): Promise<{ filePath?: string; blob?: Blob }>;

  // Utility methods
  checkPermissions(): Promise<{ camera?: string; storage?: string }>;
  requestPermissions(): Promise<{ camera?: string; storage?: string }>;
}

export interface PlatformDetector {
  isCapacitor(): boolean;
  isWeb(): boolean;
  isNative(): boolean;
  getPlatformName(): string;
}