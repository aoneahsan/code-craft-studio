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
  switch (type) {
    case QRType.TEXT:
      return Boolean(data.text && data.text.length > 0);
      
    case QRType.WEBSITE:
      return Boolean(data.url && isValidUrl(data.url));
      
    case QRType.EMAIL:
      return Boolean(data.to && isValidEmail(data.to));
      
    case QRType.PHONE:
      return Boolean(data.phoneNumber && isValidPhoneNumber(data.phoneNumber));
      
    case QRType.SMS:
      return Boolean(data.phoneNumber && isValidPhoneNumber(data.phoneNumber));
      
    case QRType.WHATSAPP:
      return Boolean(data.phoneNumber && isValidPhoneNumber(data.phoneNumber));
      
    case QRType.WIFI:
      return Boolean(data.ssid && data.ssid.length > 0);
      
    case QRType.VCARD:
    case QRType.MECARD:
      return Boolean(
        (data.firstName || data.lastName) &&
        (data.phone || data.email)
      );
      
    case QRType.LOCATION:
      return Boolean(
        typeof data.latitude === 'number' &&
        typeof data.longitude === 'number' &&
        data.latitude >= -90 && data.latitude <= 90 &&
        data.longitude >= -180 && data.longitude <= 180
      );
      
    case QRType.EVENT:
      return Boolean(
        data.title && 
        data.startDate &&
        isValidDate(data.startDate)
      );
      
    case QRType.CRYPTO:
      return Boolean(data.address && data.address.length > 0);
      
    case QRType.SOCIAL_MEDIA:
      return Boolean(
        data.facebook || data.instagram || data.twitter ||
        data.linkedin || data.youtube || data.tiktok
      );
      
    case QRType.PDF:
    case QRType.VIDEO:
    case QRType.MP3:
      return Boolean(data.url && isValidUrl(data.url));
      
    case QRType.FACEBOOK:
    case QRType.INSTAGRAM:
      return Boolean(
        (data.pageUrl && isValidUrl(data.pageUrl)) ||
        (data.profileUrl && isValidUrl(data.profileUrl))
      );
      
    case QRType.IMAGES:
      return Boolean(
        data.images && 
        Array.isArray(data.images) && 
        data.images.length > 0
      );
      
    case QRType.MENU:
      return Boolean(
        data.restaurantName &&
        data.categories &&
        Array.isArray(data.categories) &&
        data.categories.length > 0
      );
      
    case QRType.BUSINESS:
      return Boolean(data.name && data.name.length > 0);
      
    case QRType.APPS:
      return Boolean(data.appStoreUrl || data.playStoreUrl);
      
    case QRType.LINKS_LIST:
      return Boolean(
        data.links &&
        Array.isArray(data.links) &&
        data.links.length > 0
      );
      
    case QRType.COUPON:
      return Boolean(data.code && data.code.length > 0);
      
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