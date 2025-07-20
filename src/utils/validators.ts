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