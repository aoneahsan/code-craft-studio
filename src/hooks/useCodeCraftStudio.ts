import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPlatform, platformDetector } from '../platforms';
import type { PlatformAdapter, PlatformCapabilities } from '../platforms';
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

export interface UseCodeCraftStudioOptions {
  autoInitialize?: boolean;
  onError?: (error: Error) => void;
}

export interface UseCodeCraftStudioReturn {
  // Platform info
  isReady: boolean;
  platform: PlatformAdapter | null;
  capabilities: PlatformCapabilities | null;
  isCapacitor: boolean;
  isWeb: boolean;
  isNative: boolean;
  
  // QR Code methods
  scanQRCode: (options?: { formats?: string[] }) => Promise<ScanResult>;
  generateQRCode: (data: QRCodeData, options?: QRCodeOptions) => Promise<{ dataUrl: string }>;
  validateQRData: (data: QRCodeData) => Promise<ValidationResult>;
  
  // Barcode methods
  scanBarcode: (options?: { formats?: BarcodeFormat[] }) => Promise<ScanResult>;
  generateBarcode: (data: string, format: BarcodeFormat, options?: BarcodeOptions) => Promise<{ dataUrl: string }>;
  validateBarcode: (data: string, format: BarcodeFormat) => Promise<ValidationResult>;
  
  // History methods
  saveToHistory: (item: HistoryItem) => Promise<void>;
  getHistory: (options?: { limit?: number; type?: string }) => Promise<HistoryItem[]>;
  clearHistory: () => Promise<void>;
  
  // Analytics
  getAnalytics: () => Promise<AnalyticsData>;
  
  // Export
  exportCode: (dataUrl: string, options: ExportOptions) => Promise<{ filePath?: string; blob?: Blob }>;
  
  // Permissions
  checkPermissions: () => Promise<{ camera?: string; storage?: string }>;
  requestPermissions: () => Promise<{ camera?: string; storage?: string }>;
  
  // Error state
  error: Error | null;
}

export function useCodeCraftStudio(options: UseCodeCraftStudioOptions = {}): UseCodeCraftStudioReturn {
  const { autoInitialize = true, onError } = options;
  
  const [platform, setPlatform] = useState<PlatformAdapter | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Platform detection
  const isCapacitor = useMemo(() => platformDetector.isCapacitor(), []);
  const isWeb = useMemo(() => platformDetector.isWeb(), []);
  const isNative = useMemo(() => platformDetector.isNative(), []);
  
  // Initialize platform
  useEffect(() => {
    if (!autoInitialize) return;
    
    let mounted = true;
    
    const init = async () => {
      try {
        const platformAdapter = await getPlatform();
        if (mounted) {
          setPlatform(platformAdapter);
          setIsReady(true);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize platform');
        if (mounted) {
          setError(error);
          onError?.(error);
        }
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, [autoInitialize, onError]);
  
  // Method wrappers with error handling
  const wrapMethod = useCallback(<T extends any[], R>(
    method: (...args: T) => Promise<R>
  ): (...args: T) => Promise<R> => {
    return async (...args: T): Promise<R> => {
      if (!platform) {
        throw new Error('Platform not initialized. Make sure useCodeCraftStudio is properly initialized.');
      }
      
      try {
        return await method.apply(platform, args);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Operation failed');
        setError(error);
        onError?.(error);
        throw error;
      }
    };
  }, [platform, onError]);
  
  // Wrapped methods
  const scanQRCode = useMemo(
    () => wrapMethod(platform?.scanQRCode.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const generateQRCode = useMemo(
    () => wrapMethod(platform?.generateQRCode.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const validateQRData = useMemo(
    () => wrapMethod(platform?.validateQRData.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const scanBarcode = useMemo(
    () => wrapMethod(platform?.scanBarcode.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const generateBarcode = useMemo(
    () => wrapMethod(platform?.generateBarcode.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const validateBarcode = useMemo(
    () => wrapMethod(platform?.validateBarcode.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const saveToHistory = useMemo(
    () => wrapMethod(platform?.saveToHistory.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const getHistory = useMemo(
    () => wrapMethod(platform?.getHistory.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const clearHistory = useMemo(
    () => wrapMethod(platform?.clearHistory.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const getAnalytics = useMemo(
    () => wrapMethod(platform?.getAnalytics.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const exportCode = useMemo(
    () => wrapMethod(platform?.exportCode.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const checkPermissions = useMemo(
    () => wrapMethod(platform?.checkPermissions.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  const requestPermissions = useMemo(
    () => wrapMethod(platform?.requestPermissions.bind(platform) || (async () => { throw new Error('Not initialized'); })),
    [platform, wrapMethod]
  );
  
  return {
    // Platform info
    isReady,
    platform,
    capabilities: platform?.capabilities || null,
    isCapacitor,
    isWeb,
    isNative,
    
    // Methods
    scanQRCode,
    generateQRCode,
    validateQRData,
    scanBarcode,
    generateBarcode,
    validateBarcode,
    saveToHistory,
    getHistory,
    clearHistory,
    getAnalytics,
    exportCode,
    checkPermissions,
    requestPermissions,
    
    // Error state
    error
  };
}