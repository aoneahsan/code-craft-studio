import { describe, it, expect } from 'vitest';
import { 
  isValidUrl, 
  isValidEmail, 
  isValidPhoneNumber,
  isValidHexColor,
  isValidQRSize,
  validateQRData,
  isValidEAN13,
  isValidEAN8,
  isValidUPCA,
  isValidUPCE,
  isValidCode128,
  isValidCode39,
  isValidCode93,
  isValidITF,
  isValidCodabar,
  validateBarcodeData,
  getBarcodeConstraints
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

  describe('isValidEAN13', () => {
    it('should validate correct EAN-13 codes', () => {
      expect(isValidEAN13('5901234123457')).toBe(true);
      expect(isValidEAN13('4006381333931')).toBe(true);
      expect(isValidEAN13('9788498387087')).toBe(true);
    });

    it('should reject invalid EAN-13 codes', () => {
      expect(isValidEAN13('5901234123456')).toBe(false); // Wrong checksum
      expect(isValidEAN13('590123412345')).toBe(false); // Too short
      expect(isValidEAN13('59012341234567')).toBe(false); // Too long
      expect(isValidEAN13('590123412345A')).toBe(false); // Contains letter
      expect(isValidEAN13('')).toBe(false);
    });
  });

  describe('isValidEAN8', () => {
    it('should validate correct EAN-8 codes', () => {
      expect(isValidEAN8('96385074')).toBe(true);
      expect(isValidEAN8('65833254')).toBe(true);
    });

    it('should reject invalid EAN-8 codes', () => {
      expect(isValidEAN8('96385073')).toBe(false); // Wrong checksum
      expect(isValidEAN8('9638507')).toBe(false); // Too short
      expect(isValidEAN8('963850741')).toBe(false); // Too long
      expect(isValidEAN8('9638507A')).toBe(false); // Contains letter
      expect(isValidEAN8('')).toBe(false);
    });
  });

  describe('isValidUPCA', () => {
    it('should validate correct UPC-A codes', () => {
      expect(isValidUPCA('042100005264')).toBe(true);
      expect(isValidUPCA('036000291452')).toBe(true);
    });

    it('should reject invalid UPC-A codes', () => {
      expect(isValidUPCA('042100005263')).toBe(false); // Wrong checksum
      expect(isValidUPCA('04210000526')).toBe(false); // Too short
      expect(isValidUPCA('0421000052641')).toBe(false); // Too long
      expect(isValidUPCA('04210000526A')).toBe(false); // Contains letter
      expect(isValidUPCA('')).toBe(false);
    });
  });

  describe('isValidUPCE', () => {
    it('should validate correct UPC-E codes', () => {
      expect(isValidUPCE('01234567')).toBe(true);
      expect(isValidUPCE('12345678')).toBe(true);
    });

    it('should reject invalid UPC-E codes', () => {
      expect(isValidUPCE('0123456')).toBe(false); // Too short
      expect(isValidUPCE('012345678')).toBe(false); // Too long
      expect(isValidUPCE('0123456A')).toBe(false); // Contains letter
      expect(isValidUPCE('')).toBe(false);
    });
  });

  describe('isValidCode128', () => {
    it('should validate correct Code 128 codes', () => {
      expect(isValidCode128('ABC-123')).toBe(true);
      expect(isValidCode128('Test123!@#')).toBe(true);
      expect(isValidCode128('1234567890')).toBe(true);
      expect(isValidCode128(' ')).toBe(true); // Single space is valid
    });

    it('should reject invalid Code 128 codes', () => {
      expect(isValidCode128('')).toBe(false); // Empty string
      expect(isValidCode128('A'.repeat(81))).toBe(false); // Too long
      expect(isValidCode128('Test\u0080')).toBe(false); // Non-ASCII character
      expect(isValidCode128('Test\u00A0')).toBe(false); // Non-ASCII space
    });
  });

  describe('isValidCode39', () => {
    it('should validate correct Code 39 codes', () => {
      expect(isValidCode39('ABC123')).toBe(true);
      expect(isValidCode39('TEST-CODE')).toBe(true);
      expect(isValidCode39('$100.00')).toBe(true);
      expect(isValidCode39('A B C')).toBe(true); // Spaces allowed
      expect(isValidCode39('A/B+C%D')).toBe(true); // Special chars
    });

    it('should reject invalid Code 39 codes', () => {
      expect(isValidCode39('')).toBe(false); // Empty string
      expect(isValidCode39('abc123')).toBe(false); // Lowercase not allowed
      expect(isValidCode39('A'.repeat(49))).toBe(false); // Too long
      expect(isValidCode39('A@B')).toBe(false); // @ not allowed
      expect(isValidCode39('A#B')).toBe(false); // # not allowed
    });
  });

  describe('isValidCode93', () => {
    it('should validate correct Code 93 codes', () => {
      expect(isValidCode93('ABC123')).toBe(true);
      expect(isValidCode93('TEST-CODE')).toBe(true);
      expect(isValidCode93('$100.00')).toBe(true);
    });

    it('should reject invalid Code 93 codes', () => {
      expect(isValidCode93('')).toBe(false); // Empty string
      expect(isValidCode93('abc123')).toBe(false); // Lowercase not allowed
      expect(isValidCode93('A'.repeat(49))).toBe(false); // Too long
    });
  });

  describe('isValidITF', () => {
    it('should validate correct ITF codes', () => {
      expect(isValidITF('12')).toBe(true);
      expect(isValidITF('1234')).toBe(true);
      expect(isValidITF('123456')).toBe(true);
      expect(isValidITF('12345678901234')).toBe(true); // ITF-14
    });

    it('should reject invalid ITF codes', () => {
      expect(isValidITF('1')).toBe(false); // Odd length
      expect(isValidITF('123')).toBe(false); // Odd length
      expect(isValidITF('')).toBe(false); // Empty
      expect(isValidITF('12A4')).toBe(false); // Contains letter
      expect(isValidITF('12 34')).toBe(false); // Contains space
    });
  });

  describe('isValidCodabar', () => {
    it('should validate correct Codabar codes', () => {
      expect(isValidCodabar('A123456B')).toBe(true);
      expect(isValidCodabar('C12-34D')).toBe(true);
      expect(isValidCodabar('A$100.50B')).toBe(true);
      expect(isValidCodabar('D123:456A')).toBe(true);
    });

    it('should reject invalid Codabar codes', () => {
      expect(isValidCodabar('123456')).toBe(false); // No start/stop chars
      expect(isValidCodabar('A123456')).toBe(false); // No stop char
      expect(isValidCodabar('123456B')).toBe(false); // No start char
      expect(isValidCodabar('E123456F')).toBe(false); // Invalid start/stop
      expect(isValidCodabar('AB')).toBe(false); // Too short
      expect(isValidCodabar('')).toBe(false);
    });
  });

  describe('validateBarcodeData', () => {
    it('should validate based on format', () => {
      expect(validateBarcodeData('EAN_13', '5901234123457')).toBe(true);
      expect(validateBarcodeData('EAN_8', '96385074')).toBe(true);
      expect(validateBarcodeData('UPC_A', '042100005264')).toBe(true);
      expect(validateBarcodeData('UPC_E', '01234567')).toBe(true);
      expect(validateBarcodeData('CODE_128', 'ABC-123')).toBe(true);
      expect(validateBarcodeData('CODE_39', 'ABC123')).toBe(true);
      expect(validateBarcodeData('CODE_93', 'ABC123')).toBe(true);
      expect(validateBarcodeData('ITF', '1234')).toBe(true);
      expect(validateBarcodeData('ITF_14', '12345678901234')).toBe(true);
      expect(validateBarcodeData('CODABAR', 'A123456B')).toBe(true);
      expect(validateBarcodeData('QR_CODE', 'Any text')).toBe(true);
      expect(validateBarcodeData('DATA_MATRIX', 'Any text')).toBe(true);
      expect(validateBarcodeData('AZTEC', 'Any text')).toBe(true);
      expect(validateBarcodeData('PDF_417', 'Any text')).toBe(true);
    });

    it('should reject invalid data', () => {
      expect(validateBarcodeData('EAN_13', '123')).toBe(false);
      expect(validateBarcodeData('CODE_39', 'abc')).toBe(false);
      expect(validateBarcodeData('UNKNOWN', 'test')).toBe(false);
      expect(validateBarcodeData('QR_CODE', '')).toBe(false);
    });
  });

  describe('getBarcodeConstraints', () => {
    it('should return correct constraints for EAN-13', () => {
      const constraints = getBarcodeConstraints('EAN_13');
      expect(constraints.fixedLength).toBe(13);
      expect(constraints.pattern).toBe('^\\d{13}$');
      expect(constraints.description).toBe('Exactly 13 digits');
    });

    it('should return correct constraints for Code 128', () => {
      const constraints = getBarcodeConstraints('CODE_128');
      expect(constraints.minLength).toBe(1);
      expect(constraints.maxLength).toBe(80);
      expect(constraints.description).toBe('ASCII characters (1-80 chars)');
    });

    it('should return correct constraints for ITF', () => {
      const constraints = getBarcodeConstraints('ITF');
      expect(constraints.minLength).toBe(2);
      expect(constraints.pattern).toBe('^\\d+$');
      expect(constraints.description).toBe('Even number of digits');
    });

    it('should return default constraints for unknown format', () => {
      const constraints = getBarcodeConstraints('UNKNOWN');
      expect(constraints.minLength).toBe(1);
      expect(constraints.description).toBe('Any text');
    });
  });
});