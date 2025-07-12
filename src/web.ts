import { WebPlugin } from '@capacitor/core';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';

import type {
  QRCodeStudioPlugin,
  PermissionStatus,
  ScanOptions,
  GenerateOptions,
  QRCodeResult,
  SaveOptions,
  SaveResult,
  HistoryOptions,
  HistoryResult,
  AnalyticsOptions,
  AnalyticsResult,
  ScanResult,
  ScanError,
  HistoryItem,
} from './definitions';

import { QRType, BarcodeFormat } from './definitions';

export class QRCodeStudioWeb extends WebPlugin implements QRCodeStudioPlugin {
  private scanner: QrScanner | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private scanListeners: ((data: ScanResult) => void)[] = [];
  private errorListeners: ((error: ScanError) => void)[] = [];
  private history: HistoryItem[] = [];

  async checkPermissions(): Promise<PermissionStatus> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { camera: 'denied' };
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return {
        camera: permissionStatus.state === 'granted' ? 'granted' : 
                permissionStatus.state === 'denied' ? 'denied' : 'prompt'
      };
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return { camera: 'granted' };
      } catch {
        return { camera: 'prompt' };
      }
    }
  }

  async requestPermissions(): Promise<PermissionStatus> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return { camera: 'granted' };
    } catch (error) {
      return { camera: 'denied' };
    }
  }

  async startScan(options?: ScanOptions): Promise<void> {
    try {
      // Create video element if not exists
      if (!this.videoElement) {
        this.videoElement = document.createElement('video');
        this.videoElement.style.position = 'fixed';
        this.videoElement.style.top = '0';
        this.videoElement.style.left = '0';
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.style.objectFit = 'cover';
        this.videoElement.style.zIndex = '999999';
        document.body.appendChild(this.videoElement);
      }

      // Initialize scanner
      this.scanner = new QrScanner(
        this.videoElement,
        (result: QrScanner.ScanResult) => {
          const scanResult: ScanResult = {
            content: result.data,
            format: BarcodeFormat.QR_CODE,
            timestamp: Date.now(),
            type: this.detectQRType(result.data),
            parsedData: this.parseQRData(result.data),
          };

          this.scanListeners.forEach(listener => listener(scanResult));
        },
        {
          preferredCamera: options?.camera || 'environment',
          maxScansPerSecond: options?.scanDelay ? 1000 / options.scanDelay : 5,
        }
      );

      await this.scanner.start();
    } catch (error) {
      const scanError: ScanError = {
        code: 'SCAN_ERROR',
        message: error instanceof Error ? error.message : 'Failed to start scanner',
      };
      this.errorListeners.forEach(listener => listener(scanError));
      throw error;
    }
  }

  async stopScan(): Promise<void> {
    if (this.scanner) {
      await this.scanner.stop();
      this.scanner.destroy();
      this.scanner = null;
    }

    if (this.videoElement) {
      this.videoElement.remove();
      this.videoElement = null;
    }
  }

  async generate(options: GenerateOptions): Promise<QRCodeResult> {
    try {
      const qrData = this.formatQRData(options.type, options.data);
      const size = options.size || 300;

      // Generate QR code options
      const qrOptions: QRCode.QRCodeToDataURLOptions = {
        width: size,
        margin: options.design?.margin || 2,
        color: {
          dark: options.design?.colors?.dark || '#000000',
          light: options.design?.colors?.light || '#FFFFFF',
        },
        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      };

      // Generate base64 data URL
      const dataUrl = await QRCode.toDataURL(qrData, qrOptions);

      // Generate SVG
      const svg = await QRCode.toString(qrData, {
        ...qrOptions,
        type: 'svg',
      });

      // Generate unique ID
      const id = this.generateId();

      // Store in history
      const historyItem: HistoryItem = {
        id,
        type: options.type,
        data: options.data,
        createdAt: Date.now(),
        qrCode: { id, dataUrl, svg },
        scanCount: 0,
        isFavorite: false,
      };
      this.history.push(historyItem);
      this.saveHistory();

      return {
        id,
        dataUrl,
        svg,
        base64: dataUrl.split(',')[1],
      };
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  async saveQRCode(options: SaveOptions): Promise<SaveResult> {
    try {
      const { qrCode, fileName = 'qrcode', format = 'png' } = options;

      if (!qrCode.dataUrl && !qrCode.svg) {
        throw new Error('No QR code data to save');
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `${fileName}.${format}`;

      switch (format) {
        case 'svg':
          if (qrCode.svg) {
            const blob = new Blob([qrCode.svg], { type: 'image/svg+xml' });
            link.href = URL.createObjectURL(blob);
          } else {
            throw new Error('SVG data not available');
          }
          break;

        case 'json':
          // Export QR code data as JSON
          const jsonData = {
            id: qrCode.id,
            dataUrl: qrCode.dataUrl,
            svg: qrCode.svg,
            timestamp: Date.now()
          };
          const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          link.href = URL.createObjectURL(jsonBlob);
          break;

        case 'jpg':
          // Convert PNG to JPG using canvas
          if (qrCode.dataUrl) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = qrCode.dataUrl!;
            });

            canvas.width = img.width;
            canvas.height = img.height;
            ctx!.fillStyle = '#FFFFFF';
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
            ctx!.drawImage(img, 0, 0);
            
            link.href = canvas.toDataURL('image/jpeg', 0.95);
          }
          break;

        case 'webp':
          // Convert to WebP if supported
          if (qrCode.dataUrl) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = qrCode.dataUrl!;
            });

            canvas.width = img.width;
            canvas.height = img.height;
            ctx!.drawImage(img, 0, 0);
            
            link.href = canvas.toDataURL('image/webp', 0.95);
          }
          break;

        case 'pdf':
          // For PDF, we would need a library like jsPDF
          // For now, throw an informative error
          throw new Error('PDF export requires additional libraries. Please use PNG or SVG format.');

        case 'gif':
        case 'eps':
        case 'wmf':
          // These formats require specialized libraries
          throw new Error(`${format.toUpperCase()} export is not yet implemented. Please use PNG, JPG, or SVG format.`);

        case 'png':
        default:
          if (qrCode.dataUrl) {
            link.href = qrCode.dataUrl;
          } else {
            throw new Error('PNG data not available');
          }
          break;
      }

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        uri: link.href,
        path: `${fileName}.${format}`,
      };
    } catch (error) {
      throw new Error(`Failed to save QR code: ${error}`);
    }
  }

  async getHistory(options?: HistoryOptions): Promise<HistoryResult> {
    this.loadHistory();

    let filteredHistory = [...this.history];

    // Apply filters
    if (options?.type) {
      filteredHistory = filteredHistory.filter(item => item.type === options.type);
    }

    if (options?.dateRange) {
      const start = options.dateRange.start.getTime();
      const end = options.dateRange.end.getTime();
      filteredHistory = filteredHistory.filter(
        item => item.createdAt >= start && item.createdAt <= end
      );
    }

    // Sort by date (newest first)
    filteredHistory.sort((a, b) => b.createdAt - a.createdAt);

    // Apply pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    const paginatedHistory = filteredHistory.slice(offset, offset + limit);

    return {
      items: paginatedHistory,
      total: filteredHistory.length,
    };
  }

  async clearHistory(): Promise<void> {
    this.history = [];
    localStorage.removeItem('qrcode_studio_history');
  }

  async getAnalytics(options: AnalyticsOptions): Promise<AnalyticsResult> {
    // Web implementation would need a backend service for real analytics
    // This is a mock implementation
    const qrCode = this.history.find(item => item.id === options.qrCodeId);
    
    if (!qrCode) {
      throw new Error('QR code not found');
    }

    return {
      totalScans: qrCode.scanCount || 0,
      uniqueScans: Math.floor((qrCode.scanCount || 0) * 0.7),
      locations: [
        { country: 'United States', region: 'California', city: 'San Francisco', count: 45 },
        { country: 'United Kingdom', region: 'England', city: 'London', count: 23 },
      ],
      devices: [
        { type: 'mobile', os: 'iOS', count: 42 },
        { type: 'mobile', os: 'Android', count: 26 },
      ],
      timeDistribution: this.generateMockTimeDistribution(),
    };
  }

  async addListener(
    eventName: string,
    listenerFunc: any,
  ): Promise<any> {
    if (eventName === 'scanResult') {
      this.scanListeners.push(listenerFunc);
    } else if (eventName === 'scanError') {
      this.errorListeners.push(listenerFunc);
    }

    return {
      remove: async () => {
        if (eventName === 'scanResult') {
          this.scanListeners = this.scanListeners.filter(l => l !== listenerFunc);
        } else if (eventName === 'scanError') {
          this.errorListeners = this.errorListeners.filter(l => l !== listenerFunc);
        }
      },
    };
  }

  async removeAllListeners(): Promise<void> {
    this.scanListeners = [];
    this.errorListeners = [];
  }

  // Helper methods
  private detectQRType(content: string): QRType {
    // URL patterns
    if (/^https?:\/\//i.test(content)) {
      if (content.includes('youtube.com') || content.includes('youtu.be')) {
        return QRType.VIDEO;
      }
      if (content.includes('facebook.com')) {
        return QRType.FACEBOOK;
      }
      if (content.includes('instagram.com')) {
        return QRType.INSTAGRAM;
      }
      if (content.includes('.pdf')) {
        return QRType.PDF;
      }
      return QRType.WEBSITE;
    }

    // WiFi pattern
    if (/^WIFI:/i.test(content)) {
      return QRType.WIFI;
    }

    // vCard pattern
    if (/^BEGIN:VCARD/i.test(content)) {
      return QRType.VCARD;
    }

    // Email pattern
    if (/^mailto:/i.test(content)) {
      return QRType.EMAIL;
    }

    // Phone pattern
    if (/^tel:/i.test(content)) {
      return QRType.PHONE;
    }

    // SMS pattern
    if (/^sms:/i.test(content)) {
      return QRType.SMS;
    }

    // WhatsApp pattern
    if (/^https:\/\/wa\.me\//i.test(content)) {
      return QRType.WHATSAPP;
    }

    // Location pattern
    if (/^geo:/i.test(content)) {
      return QRType.LOCATION;
    }

    // Event pattern
    if (/^BEGIN:VEVENT/i.test(content)) {
      return QRType.EVENT;
    }

    // Default to text
    return QRType.TEXT;
  }

  private parseQRData(content: string): any {
    const type = this.detectQRType(content);

    switch (type) {
      case QRType.WEBSITE:
      case QRType.PDF:
      case QRType.VIDEO:
        return { url: content };

      case QRType.WIFI:
        const wifiMatch = content.match(/WIFI:T:([^;]+);S:([^;]+);P:([^;]+);/);
        if (wifiMatch) {
          return {
            security: wifiMatch[1],
            ssid: wifiMatch[2],
            password: wifiMatch[3],
          };
        }
        break;

      case QRType.EMAIL:
        const emailMatch = content.match(/mailto:([^?]+)\??(.*)$/);
        if (emailMatch) {
          const params = new URLSearchParams(emailMatch[2]);
          return {
            to: emailMatch[1],
            subject: params.get('subject') || undefined,
            body: params.get('body') || undefined,
          };
        }
        break;

      case QRType.PHONE:
        return { phoneNumber: content.replace('tel:', '') };

      case QRType.SMS:
        const smsMatch = content.match(/sms:([^?]+)\??(.*)$/);
        if (smsMatch) {
          const params = new URLSearchParams(smsMatch[2]);
          return {
            phoneNumber: smsMatch[1],
            message: params.get('body') || undefined,
          };
        }
        break;

      case QRType.TEXT:
      default:
        return { text: content };
    }

    return { text: content };
  }

  private formatQRData(type: QRType, data: any): string {
    switch (type) {
      case QRType.WEBSITE:
      case QRType.PDF:
      case QRType.VIDEO:
        return data.url;

      case QRType.WIFI:
        return `WIFI:T:${data.security};S:${data.ssid};P:${data.password || ''};H:${data.hidden ? 'true' : 'false'};`;

      case QRType.VCARD:
        return this.generateVCard(data);

      case QRType.EMAIL:
        let emailUrl = `mailto:${data.to}`;
        const emailParams = new URLSearchParams();
        if (data.subject) emailParams.append('subject', data.subject);
        if (data.body) emailParams.append('body', data.body);
        if (data.cc) emailParams.append('cc', data.cc);
        if (data.bcc) emailParams.append('bcc', data.bcc);
        if (emailParams.toString()) emailUrl += `?${emailParams.toString()}`;
        return emailUrl;

      case QRType.PHONE:
        return `tel:${data.phoneNumber}`;

      case QRType.SMS:
        let smsUrl = `sms:${data.phoneNumber}`;
        if (data.message) smsUrl += `?body=${encodeURIComponent(data.message)}`;
        return smsUrl;

      case QRType.WHATSAPP:
        let whatsappUrl = `https://wa.me/${data.phoneNumber.replace(/[^0-9]/g, '')}`;
        if (data.message) whatsappUrl += `?text=${encodeURIComponent(data.message)}`;
        return whatsappUrl;

      case QRType.LOCATION:
        return `geo:${data.latitude},${data.longitude}`;

      case QRType.EVENT:
        return this.generateVEvent(data);

      case QRType.FACEBOOK:
        return data.pageUrl;

      case QRType.INSTAGRAM:
        return data.profileUrl;

      case QRType.IMAGES:
        // For images, create a landing page URL or JSON representation
        return JSON.stringify({
          type: 'images',
          title: data.title,
          description: data.description,
          images: data.images
        });

      case QRType.MENU:
        // For menu, create a structured JSON representation
        return JSON.stringify({
          type: 'menu',
          restaurant: data.restaurantName,
          currency: data.currency || 'USD',
          categories: data.categories
        });

      case QRType.BUSINESS:
        // Business card format
        const businessLines = ['BEGIN:BUSINESS'];
        if (data.name) businessLines.push(`NAME:${data.name}`);
        if (data.industry) businessLines.push(`INDUSTRY:${data.industry}`);
        if (data.phone) businessLines.push(`PHONE:${data.phone}`);
        if (data.email) businessLines.push(`EMAIL:${data.email}`);
        if (data.website) businessLines.push(`URL:${data.website}`);
        if (data.address) businessLines.push(`ADDRESS:${data.address}`);
        if (data.hours) businessLines.push(`HOURS:${data.hours}`);
        if (data.description) businessLines.push(`DESC:${data.description}`);
        businessLines.push('END:BUSINESS');
        return businessLines.join('\n');

      case QRType.MP3:
        // For MP3, create a structured representation
        return JSON.stringify({
          type: 'mp3',
          url: data.url,
          title: data.title,
          artist: data.artist,
          album: data.album,
          coverArt: data.coverArt
        });

      case QRType.APPS:
        // For apps, create a multi-platform URL or JSON
        if (data.customUrl) return data.customUrl;
        if (data.appStoreUrl) return data.appStoreUrl;
        if (data.playStoreUrl) return data.playStoreUrl;
        if (data.windowsStoreUrl) return data.windowsStoreUrl;
        return JSON.stringify({
          type: 'apps',
          appName: data.appName,
          description: data.description,
          stores: {
            appStore: data.appStoreUrl,
            playStore: data.playStoreUrl,
            windowsStore: data.windowsStoreUrl
          }
        });

      case QRType.LINKS_LIST:
        // For links list, create a JSON representation
        return JSON.stringify({
          type: 'links',
          title: data.title,
          links: data.links
        });

      case QRType.COUPON:
        // For coupon, create a structured format
        return JSON.stringify({
          type: 'coupon',
          code: data.code,
          description: data.description,
          discount: data.discount,
          validUntil: data.validUntil,
          terms: data.terms
        });

      case QRType.SOCIAL_MEDIA:
        // For social media, create a multi-link format
        const socialLinks = Object.entries(data)
          .filter(([key, value]) => value && key !== 'type')
          .map(([network, url]) => `${network}: ${url}`)
          .join('\n');
        return socialLinks || JSON.stringify(data);

      case QRType.TEXT:
      default:
        return data.text || JSON.stringify(data);
    }
  }

  private generateVCard(data: any): string {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
    ];

    if (data.firstName || data.lastName) {
      vcard.push(`FN:${data.firstName || ''} ${data.lastName || ''}`.trim());
      vcard.push(`N:${data.lastName || ''};${data.firstName || ''};;;`);
    }

    if (data.organization) vcard.push(`ORG:${data.organization}`);
    if (data.title) vcard.push(`TITLE:${data.title}`);
    if (data.phone) vcard.push(`TEL:${data.phone}`);
    if (data.mobile) vcard.push(`TEL;TYPE=CELL:${data.mobile}`);
    if (data.email) vcard.push(`EMAIL:${data.email}`);
    if (data.website) vcard.push(`URL:${data.website}`);
    if (data.address) vcard.push(`ADR:;;${data.address};;;;`);
    if (data.note) vcard.push(`NOTE:${data.note}`);

    vcard.push('END:VCARD');
    return vcard.join('\n');
  }

  private generateVEvent(data: any): string {
    const vevent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QRCode Studio//EN',
      'BEGIN:VEVENT',
    ];

    const dtstart = new Date(data.startDate).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    vevent.push(`DTSTART:${dtstart}`);

    if (data.endDate) {
      const dtend = new Date(data.endDate).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      vevent.push(`DTEND:${dtend}`);
    }

    vevent.push(`SUMMARY:${data.title}`);
    if (data.location) vevent.push(`LOCATION:${data.location}`);
    if (data.description) vevent.push(`DESCRIPTION:${data.description}`);
    if (data.url) vevent.push(`URL:${data.url}`);

    vevent.push('END:VEVENT');
    vevent.push('END:VCALENDAR');
    return vevent.join('\n');
  }

  private generateId(): string {
    return `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveHistory(): void {
    localStorage.setItem('qrcode_studio_history', JSON.stringify(this.history));
  }

  private loadHistory(): void {
    const saved = localStorage.getItem('qrcode_studio_history');
    if (saved) {
      try {
        this.history = JSON.parse(saved);
      } catch {
        this.history = [];
      }
    }
  }

  private generateMockTimeDistribution(): Array<{ date: string; count: number }> {
    const distribution = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      distribution.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 20) + 5,
      });
    }
    
    return distribution;
  }
}