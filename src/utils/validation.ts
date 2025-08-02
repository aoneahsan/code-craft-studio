import type { QRCodeData, BarcodeFormat, ValidationResult } from '../definitions';
import { QRType } from '../definitions';

export function validateQRCodeData(data: QRCodeData): ValidationResult {
  const errors: string[] = [];
  
  switch (data.type) {
    case QRType.WEBSITE:
    case QRType.PDF:
    case QRType.VIDEO:
    case 'audio':
    case QRType.MP3:
      if (!data.url || !validateURL(data.url)) {
        errors.push('Invalid URL');
      }
      break;
      
    case QRType.MENU:
      if (!data.restaurantName) {
        errors.push('Restaurant name is required');
      }
      if (!data.categories || data.categories.length === 0) {
        errors.push('At least one category is required');
      }
      break;
      
    case QRType.EMAIL:
      if (!data.to || !validateEmail(data.to)) {
        errors.push('Invalid email address');
      }
      break;
      
    case QRType.SMS:
    case QRType.PHONE:
    case QRType.WHATSAPP:
      if (!data.phoneNumber || !validatePhoneNumber(data.phoneNumber)) {
        errors.push('Invalid phone number');
      }
      break;
      
    case QRType.LOCATION:
      if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
        errors.push('Invalid coordinates');
      }
      break;
      
    case QRType.WIFI:
      if (!data.ssid) errors.push('SSID is required');
      if (!data.password) errors.push('Password is required');
      break;
      
    case QRType.EVENT:
      if (!data.title) errors.push('Event title is required');
      if (!data.startDate) errors.push('Start date is required');
      if (!data.endDate) errors.push('End date is required');
      break;
      
    case QRType.VCARD:
      if (!data.firstName && !data.lastName) {
        errors.push('Name is required');
      }
      break;
      
    case QRType.TEXT:
      if (!data.text) errors.push('Text is required');
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

export function validateBarcodeData(data: string, format: BarcodeFormat): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!data) {
    errors.push('Data is required');
    return { isValid: false, errors, warnings };
  }
  
  switch (format) {
    case 'EAN_13':
      if (!/^\d{13}$/.test(data)) {
        errors.push('EAN-13 must be exactly 13 digits');
      } else if (!verifyEAN13Checksum(data)) {
        errors.push('Invalid EAN-13 checksum');
      }
      break;
      
    case 'EAN_8':
      if (!/^\d{8}$/.test(data)) {
        errors.push('EAN-8 must be exactly 8 digits');
      } else if (!verifyEAN8Checksum(data)) {
        errors.push('Invalid EAN-8 checksum');
      }
      break;
      
    case 'UPC_A':
      if (!/^\d{12}$/.test(data)) {
        errors.push('UPC-A must be exactly 12 digits');
      } else if (!verifyUPCAChecksum(data)) {
        errors.push('Invalid UPC-A checksum');
      }
      break;
      
    case 'UPC_E':
      if (!/^\d{8}$/.test(data)) {
        errors.push('UPC-E must be exactly 8 digits');
      }
      break;
      
    case 'CODE_128':
      if (data.length > 80) {
        warnings.push('Code 128 data is very long, may not scan well');
      }
      break;
      
    case 'CODE_39':
      if (!/^[A-Z0-9\-\.\$\/\+\%\s]+$/.test(data)) {
        errors.push('Code 39 can only contain uppercase letters, numbers, and - . $ / + % space');
      }
      break;
      
    case 'ITF':
      if (!/^\d+$/.test(data) || data.length % 2 !== 0) {
        errors.push('ITF must contain an even number of digits');
      }
      break;
      
    case 'CODABAR':
      if (!/^[0-9\-\$\:\/\.\+]+$/.test(data)) {
        errors.push('Codabar can only contain digits and - $ : / . +');
      }
      break;
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}

// Validation helper functions
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Checksum calculation functions
export function calculateEAN13Checksum(data: string): string {
  const digits = data.slice(0, 12).split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }
  return String((10 - (sum % 10)) % 10);
}

export function calculateEAN8Checksum(data: string): string {
  const digits = data.slice(0, 7).split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += digits[i] * (i % 2 === 0 ? 3 : 1);
  }
  return String((10 - (sum % 10)) % 10);
}

export function calculateUPCAChecksum(data: string): string {
  const digits = data.slice(0, 11).split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    sum += digits[i] * (i % 2 === 0 ? 3 : 1);
  }
  return String((10 - (sum % 10)) % 10);
}

export function calculateUPCEChecksum(data: string): string {
  // UPC-E checksum is calculated from the expanded UPC-A
  return calculateUPCAChecksum(expandUPCE(data));
}

export function calculateCode128Checksum(data: string): number {
  // Simplified Code 128 checksum
  let sum = 104; // Start code B
  for (let i = 0; i < data.length; i++) {
    sum += (data.charCodeAt(i) - 32) * (i + 1);
  }
  return sum % 103;
}

export function calculateCode39Checksum(data: string): string {
  const code39Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
  let sum = 0;
  for (const char of data) {
    sum += code39Chars.indexOf(char);
  }
  return code39Chars[sum % 43];
}

export function calculateCode93Checksum(_data: string): string {
  // Simplified Code 93 checksum
  return 'XX'; // Placeholder for two check characters
}

export function calculateITFChecksum(_data: string): string {
  // ITF doesn't typically use checksums, but some variants do
  return '';
}

export function calculateCodabarChecksum(_data: string): string {
  // Codabar doesn't use checksums
  return '';
}

// Verification functions
function verifyEAN13Checksum(data: string): boolean {
  const checkDigit = data.slice(-1);
  const calculated = calculateEAN13Checksum(data);
  return checkDigit === calculated;
}

function verifyEAN8Checksum(data: string): boolean {
  const checkDigit = data.slice(-1);
  const calculated = calculateEAN8Checksum(data);
  return checkDigit === calculated;
}

function verifyUPCAChecksum(data: string): boolean {
  const checkDigit = data.slice(-1);
  const calculated = calculateUPCAChecksum(data);
  return checkDigit === calculated;
}

function expandUPCE(upce: string): string {
  // Simplified UPC-E to UPC-A expansion
  if (upce.length !== 8) return '000000000000';
  
  const manufacturer = upce.slice(1, 4);
  const product = upce.slice(4, 6);
  const check = upce.slice(-1);
  
  return '0' + manufacturer + '00000' + product + check;
}