import { QRType, QRData } from '../../definitions';
import { logger } from '../../utils/logger';

export class QRValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'QRValidationError';
  }
}

export const validators: Record<QRType, (data: any) => void> = {
  [QRType.WEBSITE]: (data) => {
    if (!data.url) throw new QRValidationError('URL is required', 'url');
    if (!isValidUrl(data.url)) throw new QRValidationError('Invalid URL format', 'url');
  },

  [QRType.PDF]: (data) => {
    if (!data.url) throw new QRValidationError('PDF URL is required', 'url');
    if (!isValidUrl(data.url)) throw new QRValidationError('Invalid URL format', 'url');
    if (!data.url.toLowerCase().endsWith('.pdf') && !data.url.includes('pdf')) {
      logger.warn('URL does not appear to be a PDF file');
    }
  },

  [QRType.IMAGES]: (data) => {
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      throw new QRValidationError('At least one image is required', 'images');
    }
    data.images.forEach((img: any, index: number) => {
      if (!img.url) throw new QRValidationError(`Image ${index + 1} URL is required`, `images[${index}].url`);
      if (!isValidUrl(img.url)) throw new QRValidationError(`Invalid URL format for image ${index + 1}`, `images[${index}].url`);
    });
  },

  [QRType.VIDEO]: (data) => {
    if (!data.url) throw new QRValidationError('Video URL is required', 'url');
    if (!isValidUrl(data.url)) throw new QRValidationError('Invalid URL format', 'url');
  },

  [QRType.WIFI]: (data) => {
    if (!data.ssid) throw new QRValidationError('Network name (SSID) is required', 'ssid');
    if (!data.security) throw new QRValidationError('Security type is required', 'security');
    if (!['WEP', 'WPA', 'WPA2', 'WPA3', 'nopass'].includes(data.security)) {
      throw new QRValidationError('Invalid security type', 'security');
    }
    if (data.security !== 'nopass' && !data.password) {
      throw new QRValidationError('Password is required for secured networks', 'password');
    }
  },

  [QRType.MENU]: (data) => {
    if (!data.restaurantName) throw new QRValidationError('Restaurant name is required', 'restaurantName');
    if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
      throw new QRValidationError('At least one menu category is required', 'categories');
    }
    data.categories.forEach((cat: any, catIndex: number) => {
      if (!cat.name) throw new QRValidationError(`Category ${catIndex + 1} name is required`, `categories[${catIndex}].name`);
      if (!cat.items || !Array.isArray(cat.items) || cat.items.length === 0) {
        throw new QRValidationError(`Category "${cat.name}" must have at least one item`, `categories[${catIndex}].items`);
      }
      cat.items.forEach((item: any, itemIndex: number) => {
        if (!item.name) throw new QRValidationError(`Item name is required`, `categories[${catIndex}].items[${itemIndex}].name`);
        if (!item.price) throw new QRValidationError(`Item price is required`, `categories[${catIndex}].items[${itemIndex}].price`);
      });
    });
  },

  [QRType.BUSINESS]: (data) => {
    if (!data.name) throw new QRValidationError('Business name is required', 'name');
    if (data.email && !isValidEmail(data.email)) {
      throw new QRValidationError('Invalid email format', 'email');
    }
    if (data.website && !isValidUrl(data.website)) {
      throw new QRValidationError('Invalid website URL', 'website');
    }
  },

  [QRType.VCARD]: (data) => {
    if (!data.firstName && !data.lastName && !data.organization) {
      throw new QRValidationError('At least one of firstName, lastName, or organization is required');
    }
    if (data.email && !isValidEmail(data.email)) {
      throw new QRValidationError('Invalid email format', 'email');
    }
    if (data.website && !isValidUrl(data.website)) {
      throw new QRValidationError('Invalid website URL', 'website');
    }
  },

  [QRType.MP3]: (data) => {
    if (!data.url) throw new QRValidationError('Audio URL is required', 'url');
    if (!isValidUrl(data.url)) throw new QRValidationError('Invalid URL format', 'url');
  },

  [QRType.APPS]: (data) => {
    if (!data.appStoreUrl && !data.playStoreUrl && !data.windowsStoreUrl && !data.customUrl) {
      throw new QRValidationError('At least one app store URL is required');
    }
    if (data.appStoreUrl && !isValidUrl(data.appStoreUrl)) {
      throw new QRValidationError('Invalid App Store URL', 'appStoreUrl');
    }
    if (data.playStoreUrl && !isValidUrl(data.playStoreUrl)) {
      throw new QRValidationError('Invalid Play Store URL', 'playStoreUrl');
    }
    if (data.windowsStoreUrl && !isValidUrl(data.windowsStoreUrl)) {
      throw new QRValidationError('Invalid Windows Store URL', 'windowsStoreUrl');
    }
    if (data.customUrl && !isValidUrl(data.customUrl)) {
      throw new QRValidationError('Invalid custom URL', 'customUrl');
    }
  },

  [QRType.LINKS_LIST]: (data) => {
    if (!data.links || !Array.isArray(data.links) || data.links.length === 0) {
      throw new QRValidationError('At least one link is required', 'links');
    }
    data.links.forEach((link: any, index: number) => {
      if (!link.title) throw new QRValidationError(`Link ${index + 1} title is required`, `links[${index}].title`);
      if (!link.url) throw new QRValidationError(`Link ${index + 1} URL is required`, `links[${index}].url`);
      if (!isValidUrl(link.url)) throw new QRValidationError(`Invalid URL format for link ${index + 1}`, `links[${index}].url`);
    });
  },

  [QRType.COUPON]: (data) => {
    if (!data.code) throw new QRValidationError('Coupon code is required', 'code');
    if (data.validUntil && !isValidDate(data.validUntil)) {
      throw new QRValidationError('Invalid date format for validUntil', 'validUntil');
    }
  },

  [QRType.FACEBOOK]: (data) => {
    if (!data.pageUrl) throw new QRValidationError('Facebook page URL is required', 'pageUrl');
    if (!isValidUrl(data.pageUrl) || !data.pageUrl.includes('facebook.com')) {
      throw new QRValidationError('Invalid Facebook URL', 'pageUrl');
    }
  },

  [QRType.INSTAGRAM]: (data) => {
    if (!data.profileUrl) throw new QRValidationError('Instagram profile URL is required', 'profileUrl');
    if (!isValidUrl(data.profileUrl) || !data.profileUrl.includes('instagram.com')) {
      throw new QRValidationError('Invalid Instagram URL', 'profileUrl');
    }
  },

  [QRType.SOCIAL_MEDIA]: (data) => {
    const socialNetworks = Object.keys(data).filter(key => data[key]);
    if (socialNetworks.length === 0) {
      throw new QRValidationError('At least one social media link is required');
    }
    socialNetworks.forEach(network => {
      if (data[network] && !isValidUrl(data[network])) {
        throw new QRValidationError(`Invalid URL for ${network}`, network);
      }
    });
  },

  [QRType.WHATSAPP]: (data) => {
    if (!data.phoneNumber) throw new QRValidationError('Phone number is required', 'phoneNumber');
    if (!isValidPhoneNumber(data.phoneNumber)) {
      throw new QRValidationError('Invalid phone number format', 'phoneNumber');
    }
  },

  [QRType.TEXT]: (data) => {
    if (!data.text) throw new QRValidationError('Text content is required', 'text');
    if (data.text.length > 2000) {
      throw new QRValidationError('Text is too long (max 2000 characters)', 'text');
    }
  },

  [QRType.EMAIL]: (data) => {
    if (!data.to) throw new QRValidationError('Recipient email is required', 'to');
    if (!isValidEmail(data.to)) throw new QRValidationError('Invalid email format', 'to');
    if (data.cc && !isValidEmail(data.cc)) {
      throw new QRValidationError('Invalid CC email format', 'cc');
    }
    if (data.bcc && !isValidEmail(data.bcc)) {
      throw new QRValidationError('Invalid BCC email format', 'bcc');
    }
  },

  [QRType.SMS]: (data) => {
    if (!data.phoneNumber) throw new QRValidationError('Phone number is required', 'phoneNumber');
    if (!isValidPhoneNumber(data.phoneNumber)) {
      throw new QRValidationError('Invalid phone number format', 'phoneNumber');
    }
  },

  [QRType.PHONE]: (data) => {
    if (!data.phoneNumber) throw new QRValidationError('Phone number is required', 'phoneNumber');
    if (!isValidPhoneNumber(data.phoneNumber)) {
      throw new QRValidationError('Invalid phone number format', 'phoneNumber');
    }
  },

  [QRType.LOCATION]: (data) => {
    if (typeof data.latitude !== 'number') {
      throw new QRValidationError('Latitude must be a number', 'latitude');
    }
    if (typeof data.longitude !== 'number') {
      throw new QRValidationError('Longitude must be a number', 'longitude');
    }
    if (data.latitude < -90 || data.latitude > 90) {
      throw new QRValidationError('Latitude must be between -90 and 90', 'latitude');
    }
    if (data.longitude < -180 || data.longitude > 180) {
      throw new QRValidationError('Longitude must be between -180 and 180', 'longitude');
    }
  },

  [QRType.EVENT]: (data) => {
    if (!data.title) throw new QRValidationError('Event title is required', 'title');
    if (!data.startDate) throw new QRValidationError('Start date is required', 'startDate');
    if (!isValidDate(data.startDate)) {
      throw new QRValidationError('Invalid start date format', 'startDate');
    }
    if (data.endDate && !isValidDate(data.endDate)) {
      throw new QRValidationError('Invalid end date format', 'endDate');
    }
    if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      throw new QRValidationError('End date must be after start date', 'endDate');
    }
  },
};

export function validateQRData(type: QRType, data: QRData): void {
  const validator = validators[type];
  if (!validator) {
    throw new QRValidationError(`Unknown QR type: ${type}`);
  }
  validator(data);
}

// Helper validation functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone: string): boolean {
  // Basic phone validation - accepts digits, spaces, +, -, (, )
  const phoneRegex = /^[\d\s+\-()]+$/;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return phoneRegex.test(phone) && cleaned.length >= 7 && cleaned.length <= 15;
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}