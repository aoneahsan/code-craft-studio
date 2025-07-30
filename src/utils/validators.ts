import { QRType, QRData } from '../types';

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string is a valid phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic validation for international phone numbers
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Validates if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Validates if a number is a valid QR code size
 */
export function isValidQRSize(size: number): boolean {
  return size >= 50 && size <= 1000;
}

/**
 * Validates QR data based on type
 */
export function validateQRData(type: QRType, data: QRData): boolean {
  const dataAny = data as any;
  switch (type) {
    case QRType.TEXT:
      return Boolean(dataAny.text && dataAny.text.length > 0);
      
    case QRType.WEBSITE:
      return Boolean(dataAny.url && isValidUrl(dataAny.url));
      
    case QRType.EMAIL:
      return Boolean(dataAny.to && isValidEmail(dataAny.to));
      
    case QRType.PHONE:
      return Boolean(dataAny.phoneNumber && isValidPhoneNumber(dataAny.phoneNumber));
      
    case QRType.SMS:
      return Boolean(dataAny.phoneNumber && isValidPhoneNumber(dataAny.phoneNumber));
      
    case QRType.WHATSAPP:
      return Boolean(dataAny.phoneNumber && isValidPhoneNumber(dataAny.phoneNumber));
      
    case QRType.WIFI:
      return Boolean(dataAny.ssid && dataAny.ssid.length > 0);
      
    case QRType.VCARD:
      return Boolean(
        (dataAny.firstName || dataAny.lastName) &&
        (dataAny.phone || dataAny.email)
      );
      
    case QRType.LOCATION:
      return Boolean(
        typeof dataAny.latitude === 'number' &&
        typeof dataAny.longitude === 'number' &&
        dataAny.latitude >= -90 && dataAny.latitude <= 90 &&
        dataAny.longitude >= -180 && dataAny.longitude <= 180
      );
      
    case QRType.EVENT:
      return Boolean(
        dataAny.title && 
        dataAny.startDate &&
        isValidDate(dataAny.startDate)
      );
      
      
    case QRType.SOCIAL_MEDIA:
      return Boolean(
        dataAny.facebook || dataAny.instagram || dataAny.twitter ||
        dataAny.linkedin || dataAny.youtube || dataAny.tiktok
      );
      
    case QRType.PDF:
    case QRType.VIDEO:
    case QRType.MP3:
      return Boolean(dataAny.url && isValidUrl(dataAny.url));
      
    case QRType.FACEBOOK:
    case QRType.INSTAGRAM:
      return Boolean(
        (dataAny.pageUrl && isValidUrl(dataAny.pageUrl)) ||
        (dataAny.profileUrl && isValidUrl(dataAny.profileUrl))
      );
      
    case QRType.IMAGES:
      return Boolean(
        dataAny.images && 
        Array.isArray(dataAny.images) && 
        dataAny.images.length > 0
      );
      
    case QRType.MENU:
      return Boolean(
        dataAny.restaurantName &&
        dataAny.categories &&
        Array.isArray(dataAny.categories) &&
        dataAny.categories.length > 0
      );
      
    case QRType.BUSINESS:
      return Boolean(dataAny.name && dataAny.name.length > 0);
      
    case QRType.APPS:
      return Boolean(dataAny.appStoreUrl || dataAny.playStoreUrl);
      
    case QRType.LINKS_LIST:
      return Boolean(
        dataAny.links &&
        Array.isArray(dataAny.links) &&
        dataAny.links.length > 0
      );
      
    case QRType.COUPON:
      return Boolean(dataAny.code && dataAny.code.length > 0);
      
    default:
      return false;
  }
}

/**
 * Helper function to validate date strings
 */
function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validates EAN-13 barcode (13 digits with checksum)
 */
export function isValidEAN13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  
  const digits = code.split('').map(Number);
  const checksum = digits.pop()!;
  
  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);
  
  const calculatedChecksum = (10 - (sum % 10)) % 10;
  return calculatedChecksum === checksum;
}

/**
 * Validates EAN-8 barcode (8 digits with checksum)
 */
export function isValidEAN8(code: string): boolean {
  if (!/^\d{8}$/.test(code)) return false;
  
  const digits = code.split('').map(Number);
  const checksum = digits.pop()!;
  
  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 3 : 1);
  }, 0);
  
  const calculatedChecksum = (10 - (sum % 10)) % 10;
  return calculatedChecksum === checksum;
}

/**
 * Validates UPC-A barcode (12 digits with checksum)
 */
export function isValidUPCA(code: string): boolean {
  if (!/^\d{12}$/.test(code)) return false;
  
  const digits = code.split('').map(Number);
  const checksum = digits.pop()!;
  
  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 3 : 1);
  }, 0);
  
  const calculatedChecksum = (10 - (sum % 10)) % 10;
  return calculatedChecksum === checksum;
}

/**
 * Validates UPC-E barcode (8 digits, converts to UPC-A internally)
 */
export function isValidUPCE(code: string): boolean {
  return /^\d{8}$/.test(code);
}

/**
 * Validates Code 128 barcode (alphanumeric with ASCII 0-127)
 */
export function isValidCode128(code: string): boolean {
  // Code 128 can encode all ASCII characters from 0 to 127
  if (code.length === 0 || code.length > 80) return false;
  
  for (let i = 0; i < code.length; i++) {
    if (code.charCodeAt(i) > 127) return false;
  }
  return true;
}

/**
 * Validates Code 39 barcode (uppercase letters, digits, and special characters)
 */
export function isValidCode39(code: string): boolean {
  // Code 39 allows uppercase letters, digits, space, and - . $ / + %
  const code39Regex = /^[A-Z0-9\s\-\.\$\/\+\%]+$/;
  return code.length > 0 && code.length <= 48 && code39Regex.test(code);
}

/**
 * Validates Code 93 barcode (similar to Code 39 but more compact)
 */
export function isValidCode93(code: string): boolean {
  // Code 93 allows uppercase letters, digits, space, and special characters
  const code93Regex = /^[A-Z0-9\s\-\.\$\/\+\%]+$/;
  return code.length > 0 && code.length <= 48 && code93Regex.test(code);
}

/**
 * Validates ITF (Interleaved 2 of 5) barcode (even number of digits)
 */
export function isValidITF(code: string): boolean {
  return /^\d+$/.test(code) && code.length % 2 === 0 && code.length >= 2;
}

/**
 * Validates Codabar barcode (digits and special start/stop characters)
 */
export function isValidCodabar(code: string): boolean {
  // Codabar allows digits 0-9 and special characters - $ : / . +
  // Must start and end with A, B, C, or D
  const codabarRegex = /^[ABCD][0-9\-\$\:\/\.\+]+[ABCD]$/;
  return code.length >= 3 && codabarRegex.test(code);
}

/**
 * Validates barcode data based on format
 */
export function validateBarcodeData(format: string, data: string): boolean {
  switch (format) {
    case 'EAN_13':
      return isValidEAN13(data);
    case 'EAN_8':
      return isValidEAN8(data);
    case 'UPC_A':
      return isValidUPCA(data);
    case 'UPC_E':
      return isValidUPCE(data);
    case 'CODE_128':
      return isValidCode128(data);
    case 'CODE_39':
      return isValidCode39(data);
    case 'CODE_93':
      return isValidCode93(data);
    case 'ITF':
    case 'ITF_14':
      return isValidITF(data);
    case 'CODABAR':
      return isValidCodabar(data);
    case 'QR_CODE':
    case 'DATA_MATRIX':
    case 'AZTEC':
    case 'PDF_417':
      // 2D barcodes can contain any data
      return data.length > 0;
    default:
      return false;
  }
}

/**
 * Gets barcode format constraints
 */
export function getBarcodeConstraints(format: string): { 
  minLength?: number; 
  maxLength?: number; 
  fixedLength?: number;
  pattern?: string;
  description: string;
} {
  switch (format) {
    case 'EAN_13':
      return { fixedLength: 13, pattern: '^\\d{13}$', description: 'Exactly 13 digits' };
    case 'EAN_8':
      return { fixedLength: 8, pattern: '^\\d{8}$', description: 'Exactly 8 digits' };
    case 'UPC_A':
      return { fixedLength: 12, pattern: '^\\d{12}$', description: 'Exactly 12 digits' };
    case 'UPC_E':
      return { fixedLength: 8, pattern: '^\\d{8}$', description: 'Exactly 8 digits' };
    case 'CODE_128':
      return { minLength: 1, maxLength: 80, description: 'ASCII characters (1-80 chars)' };
    case 'CODE_39':
      return { minLength: 1, maxLength: 48, pattern: '^[A-Z0-9\\s\\-\\.\\$\\/\\+\\%]+$', description: 'Uppercase letters, digits, and - . $ / + % space' };
    case 'CODE_93':
      return { minLength: 1, maxLength: 48, pattern: '^[A-Z0-9\\s\\-\\.\\$\\/\\+\\%]+$', description: 'Uppercase letters, digits, and special characters' };
    case 'ITF':
    case 'ITF_14':
      return { minLength: 2, pattern: '^\\d+$', description: 'Even number of digits' };
    case 'CODABAR':
      return { minLength: 3, pattern: '^[ABCD][0-9\\-\\$\\:\\/\\.\\+]+[ABCD]$', description: 'Start/end with A-D, digits and - $ : / . + in between' };
    case 'QR_CODE':
      return { minLength: 1, maxLength: 4296, description: 'Any text up to 4296 characters' };
    case 'DATA_MATRIX':
      return { minLength: 1, maxLength: 2335, description: 'Any text up to 2335 characters' };
    case 'AZTEC':
      return { minLength: 1, maxLength: 3832, description: 'Any text up to 3832 characters' };
    case 'PDF_417':
      return { minLength: 1, maxLength: 1850, description: 'Any text up to 1850 characters' };
    default:
      return { minLength: 1, description: 'Any text' };
  }
}