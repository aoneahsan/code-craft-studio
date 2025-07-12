import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QRCodeStudioWeb } from '../web';
import { QRType } from '../types';

// Mock the qrcode library
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockdata'),
    toString: vi.fn().mockResolvedValue('<svg>mock</svg>'),
  },
}));

// Mock qr-scanner
vi.mock('qr-scanner', () => ({
  default: class QrScanner {
    static scanImage = vi.fn().mockResolvedValue({
      data: 'https://example.com',
    });
    static hasCamera = vi.fn().mockResolvedValue(true);
  },
}));

describe('QRCodeStudioWeb', () => {
  let plugin: QRCodeStudioWeb;

  beforeEach(() => {
    plugin = new QRCodeStudioWeb();
    vi.clearAllMocks();
  });

  describe('formatQRData', () => {
    it('should format TEXT type correctly', () => {
      const result = plugin['formatQRData'](QRType.TEXT, { text: 'Hello World' });
      expect(result).toBe('Hello World');
    });

    it('should format WEBSITE type correctly', () => {
      const result = plugin['formatQRData'](QRType.WEBSITE, { 
        url: 'https://example.com',
        title: 'Example' 
      });
      expect(result).toBe('https://example.com');
    });

    it('should format EMAIL type correctly', () => {
      const result = plugin['formatQRData'](QRType.EMAIL, {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body',
      });
      expect(result).toBe('mailto:test@example.com?subject=Test%20Subject&body=Test%20Body');
    });

    it('should format PHONE type correctly', () => {
      const result = plugin['formatQRData'](QRType.PHONE, {
        phoneNumber: '+1234567890',
      });
      expect(result).toBe('tel:+1234567890');
    });

    it('should format SMS type correctly', () => {
      const result = plugin['formatQRData'](QRType.SMS, {
        phoneNumber: '+1234567890',
        message: 'Hello',
      });
      expect(result).toBe('sms:+1234567890?body=Hello');
    });

    it('should format WIFI type correctly', () => {
      const result = plugin['formatQRData'](QRType.WIFI, {
        ssid: 'MyNetwork',
        password: 'MyPassword',
        security: 'WPA2',
        hidden: false,
      });
      expect(result).toBe('WIFI:T:WPA2;S:MyNetwork;P:MyPassword;H:false;;');
    });

    it('should format VCARD type correctly', () => {
      const result = plugin['formatQRData'](QRType.VCARD, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        organization: 'Example Corp',
      });
      expect(result).toContain('BEGIN:VCARD');
      expect(result).toContain('VERSION:3.0');
      expect(result).toContain('FN:John Doe');
      expect(result).toContain('TEL:+1234567890');
      expect(result).toContain('EMAIL:john@example.com');
      expect(result).toContain('ORG:Example Corp');
      expect(result).toContain('END:VCARD');
    });

    it('should format LOCATION type correctly', () => {
      const result = plugin['formatQRData'](QRType.LOCATION, {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY',
      });
      expect(result).toBe('geo:40.7128,-74.0060?q=New%20York%2C%20NY');
    });

    it('should format EVENT type correctly', () => {
      const result = plugin['formatQRData'](QRType.EVENT, {
        title: 'Meeting',
        startDate: '2024-07-15T10:00:00',
        endDate: '2024-07-15T11:00:00',
        location: 'Conference Room',
        description: 'Team meeting',
      });
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('SUMMARY:Meeting');
      expect(result).toContain('DTSTART:20240715T100000');
      expect(result).toContain('DTEND:20240715T110000');
      expect(result).toContain('LOCATION:Conference Room');
      expect(result).toContain('DESCRIPTION:Team meeting');
      expect(result).toContain('END:VEVENT');
    });

    it('should format WHATSAPP type correctly', () => {
      const result = plugin['formatQRData'](QRType.WHATSAPP, {
        phoneNumber: '+1234567890',
        message: 'Hello from QR',
      });
      expect(result).toBe('https://wa.me/1234567890?text=Hello%20from%20QR');
    });

    it('should format SOCIAL_MEDIA type correctly', () => {
      const result = plugin['formatQRData'](QRType.SOCIAL_MEDIA, {
        facebook: 'https://facebook.com/user',
        instagram: 'https://instagram.com/user',
        twitter: 'https://twitter.com/user',
      });
      const parsed = JSON.parse(result);
      expect(parsed.type).toBe('social_media');
      expect(parsed.facebook).toBe('https://facebook.com/user');
      expect(parsed.instagram).toBe('https://instagram.com/user');
      expect(parsed.twitter).toBe('https://twitter.com/user');
    });

    it('should format MENU type correctly', () => {
      const result = plugin['formatQRData'](QRType.MENU, {
        restaurantName: 'Test Restaurant',
        currency: 'USD',
        categories: [
          {
            name: 'Appetizers',
            items: [
              { name: 'Salad', price: 10, description: 'Fresh salad' },
            ],
          },
        ],
      });
      const parsed = JSON.parse(result);
      expect(parsed.type).toBe('menu');
      expect(parsed.restaurant).toBe('Test Restaurant');
      expect(parsed.currency).toBe('USD');
      expect(parsed.categories).toHaveLength(1);
    });

    it('should return empty string for unknown type', () => {
      const result = plugin['formatQRData']('UNKNOWN' as QRType, {});
      expect(result).toBe('');
    });
  });

  describe('generate', () => {
    it('should generate QR code with default options', async () => {
      const result = await plugin.generate({
        type: QRType.TEXT,
        data: { text: 'Hello' },
      });

      expect(result.dataUrl).toBe('data:image/png;base64,mockdata');
      expect(result.svg).toBe('<svg>mock</svg>');
    });

    it('should generate QR code with custom size', async () => {
      const result = await plugin.generate({
        type: QRType.TEXT,
        data: { text: 'Hello' },
        size: 500,
      });

      expect(result.dataUrl).toBeDefined();
      expect(result.svg).toBeDefined();
    });

    it('should generate QR code with custom design', async () => {
      const result = await plugin.generate({
        type: QRType.TEXT,
        data: { text: 'Hello' },
        design: {
          colors: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
      });

      expect(result.dataUrl).toBeDefined();
      expect(result.svg).toBeDefined();
    });
  });

  describe('checkPermissions', () => {
    it('should check camera permissions', async () => {
      const mockPermissionStatus = { state: 'granted' };
      navigator.permissions = {
        query: vi.fn().mockResolvedValue(mockPermissionStatus),
      } as any;

      const result = await plugin.checkPermissions();
      expect(result.camera).toBe('granted');
    });

    it('should handle permission check errors', async () => {
      navigator.permissions = {
        query: vi.fn().mockRejectedValue(new Error('Not supported')),
      } as any;

      const result = await plugin.checkPermissions();
      expect(result.camera).toBe('prompt');
    });
  });

  describe('exportAs', () => {
    it('should export as PNG', async () => {
      const result = await plugin.exportAs({
        qrCode: {
          dataUrl: 'data:image/png;base64,mockdata',
          svg: '<svg>mock</svg>',
        },
        format: 'png',
      });

      expect(result.data).toBe('data:image/png;base64,mockdata');
      expect(result.format).toBe('png');
    });

    it('should export as JPG', async () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue({
          fillStyle: '',
          fillRect: vi.fn(),
          drawImage: vi.fn(),
        }),
        toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,mockjpg'),
      };
      
      document.createElement = vi.fn().mockImplementation((tag) => {
        if (tag === 'canvas') return mockCanvas;
        if (tag === 'img') return { onload: null, src: '' };
        return {};
      });

      const result = await plugin.exportAs({
        qrCode: {
          dataUrl: 'data:image/png;base64,mockdata',
          svg: '<svg>mock</svg>',
        },
        format: 'jpg',
      });

      expect(result.format).toBe('jpg');
      expect(result.data).toContain('data:image/jpeg');
    });

    it('should export as SVG', async () => {
      const result = await plugin.exportAs({
        qrCode: {
          dataUrl: 'data:image/png;base64,mockdata',
          svg: '<svg>mock</svg>',
        },
        format: 'svg',
      });

      expect(result.data).toBe('<svg>mock</svg>');
      expect(result.format).toBe('svg');
    });

    it('should export as JSON', async () => {
      const result = await plugin.exportAs({
        qrCode: {
          dataUrl: 'data:image/png;base64,mockdata',
          svg: '<svg>mock</svg>',
        },
        format: 'json',
      });

      const parsed = JSON.parse(result.data);
      expect(parsed.dataUrl).toBe('data:image/png;base64,mockdata');
      expect(parsed.svg).toBe('<svg>mock</svg>');
      expect(result.format).toBe('json');
    });
  });
});