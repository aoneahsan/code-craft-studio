import { describe, it, expect } from 'vitest';
import { 
  isValidUrl, 
  isValidEmail, 
  isValidPhoneNumber,
  isValidHexColor,
  isValidQRSize,
  validateQRData
} from '../../utils/validators';
import { QRType } from '../../types';

describe('validators', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('+1234567890')).toBe(true);
      expect(isValidPhoneNumber('+12345678901')).toBe(true);
      expect(isValidPhoneNumber('+919876543210')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('1234')).toBe(false);
      expect(isValidPhoneNumber('abc')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('++1234567890')).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate correct hex colors', () => {
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#FFFFFF')).toBe(true);
      expect(isValidHexColor('#123456')).toBe(true);
      expect(isValidHexColor('#ABC')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('000000')).toBe(false);
      expect(isValidHexColor('#GGGGGG')).toBe(false);
      expect(isValidHexColor('#12345')).toBe(false);
      expect(isValidHexColor('')).toBe(false);
    });
  });

  describe('isValidQRSize', () => {
    it('should validate correct QR sizes', () => {
      expect(isValidQRSize(100)).toBe(true);
      expect(isValidQRSize(300)).toBe(true);
      expect(isValidQRSize(1000)).toBe(true);
    });

    it('should reject invalid QR sizes', () => {
      expect(isValidQRSize(49)).toBe(false);
      expect(isValidQRSize(1001)).toBe(false);
      expect(isValidQRSize(-100)).toBe(false);
      expect(isValidQRSize(0)).toBe(false);
    });
  });

  describe('validateQRData', () => {
    it('should validate TEXT type', () => {
      expect(validateQRData(QRType.TEXT, { text: 'Hello' })).toBe(true);
      expect(validateQRData(QRType.TEXT, { text: '' })).toBe(false);
      expect(validateQRData(QRType.TEXT, {})).toBe(false);
    });

    it('should validate WEBSITE type', () => {
      expect(validateQRData(QRType.WEBSITE, { url: 'https://example.com' })).toBe(true);
      expect(validateQRData(QRType.WEBSITE, { url: 'invalid' })).toBe(false);
      expect(validateQRData(QRType.WEBSITE, {})).toBe(false);
    });

    it('should validate EMAIL type', () => {
      expect(validateQRData(QRType.EMAIL, { to: 'test@example.com' })).toBe(true);
      expect(validateQRData(QRType.EMAIL, { to: 'invalid' })).toBe(false);
      expect(validateQRData(QRType.EMAIL, {})).toBe(false);
    });

    it('should validate PHONE type', () => {
      expect(validateQRData(QRType.PHONE, { phoneNumber: '+1234567890' })).toBe(true);
      expect(validateQRData(QRType.PHONE, { phoneNumber: '123' })).toBe(false);
      expect(validateQRData(QRType.PHONE, {})).toBe(false);
    });

    it('should validate WIFI type', () => {
      expect(validateQRData(QRType.WIFI, { 
        ssid: 'MyNetwork', 
        security: 'WPA2' 
      })).toBe(true);
      expect(validateQRData(QRType.WIFI, { ssid: '' })).toBe(false);
      expect(validateQRData(QRType.WIFI, {})).toBe(false);
    });

    it('should validate LOCATION type', () => {
      expect(validateQRData(QRType.LOCATION, { 
        latitude: 40.7128, 
        longitude: -74.0060 
      })).toBe(true);
      expect(validateQRData(QRType.LOCATION, { latitude: 40.7128 })).toBe(false);
      expect(validateQRData(QRType.LOCATION, {})).toBe(false);
    });
  });
});