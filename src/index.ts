import type { QRCodeStudioPlugin } from './definitions';
import { getPlatform } from './platforms';

// Create a proxy that implements the plugin interface using platform abstraction
const QRCodeStudio: QRCodeStudioPlugin = new Proxy({} as QRCodeStudioPlugin, {
  get(_target, prop: string) {
    return async (...args: any[]) => {
      const platform = await getPlatform();
      const method = (platform as any)[prop];
      if (typeof method === 'function') {
        return method.apply(platform, args);
      }
      throw new Error(`Method ${prop} not found on platform adapter`);
    };
  }
});

// Export platform utilities for advanced users
export { getPlatform, platformDetector } from './platforms';
export type { PlatformAdapter, PlatformCapabilities } from './platforms';

export * from './definitions';
export * from './components';
export * from './hooks';
export { QRCodeStudio };

// Export validators for advanced users
export { validateQRData, QRValidationError } from './core/validators/qr-validators';

// Export utility validators
export { 
  isValidUrl, 
  isValidEmail, 
  isValidPhoneNumber, 
  isValidHexColor, 
  isValidQRSize 
} from './utils/validators';

// Export form utilities
export { qrFormFields, qrTypeInfo } from './utils/qr-forms';
export type { FormFieldProps } from './utils/qr-forms';