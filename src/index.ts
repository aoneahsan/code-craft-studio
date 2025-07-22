import { registerPlugin } from '@capacitor/core';

import type { QRCodeStudioPlugin } from './definitions';

const QRCodeStudio = registerPlugin<QRCodeStudioPlugin>('QRCodeStudio', {
  web: () => import('./web').then(m => new m.QRCodeStudioWeb()),
});

export * from './definitions';
export * from './components';
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