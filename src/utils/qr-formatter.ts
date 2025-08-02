import type { QRCodeData } from '../definitions';
import { QRType } from '../definitions';

export function formatQRData(data: QRCodeData): string {
  switch (data.type) {
    case QRType.WEBSITE:
      return data.url || '';
    
    case QRType.TEXT:
      return data.text || '';
    
    case QRType.EMAIL:
      return `mailto:${data.to}${data.subject ? `?subject=${encodeURIComponent(data.subject)}` : ''}${data.body ? `&body=${encodeURIComponent(data.body)}` : ''}`;
    
    case QRType.SMS:
      return `sms:${data.phoneNumber}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`;
    
    case QRType.PHONE:
      return `tel:${data.phoneNumber}`;
    
    case QRType.LOCATION:
      return `geo:${data.latitude},${data.longitude}`;
    
    case QRType.WIFI:
      return `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};H:${data.hidden ? 'true' : 'false'};;`;
    
    case QRType.EVENT:
      const event = [
        'BEGIN:VEVENT',
        `SUMMARY:${data.title}`,
        `DTSTART:${formatDate(data.startDate)}`,
        `DTEND:${formatDate(data.endDate)}`,
        data.location ? `LOCATION:${data.location}` : '',
        data.description ? `DESCRIPTION:${data.description}` : '',
        'END:VEVENT'
      ].filter(Boolean).join('\n');
      return `BEGIN:VCALENDAR\nVERSION:2.0\n${event}\nEND:VCALENDAR`;
    
    case QRType.VCARD:
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${data.firstName} ${data.lastName}`,
        `N:${data.lastName};${data.firstName};;;`,
        data.organization ? `ORG:${data.organization}` : '',
        data.phone ? `TEL:${data.phone}` : '',
        data.email ? `EMAIL:${data.email}` : '',
        data.website ? `URL:${data.website}` : '',
        data.address ? `ADR:;;${data.address};;;;` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');
    
    case QRType.PDF:
      return data.url || '';
    
    case QRType.IMAGES:
      return data.images ? data.images.map(img => img.url).join(',') : '';
    
    case QRType.VIDEO:
      return data.url || '';
    
    case 'audio':
    case QRType.MP3:
      return data.url || '';
    
    case 'app':
    case QRType.APPS:
      return data.appStoreUrl || data.playStoreUrl || '';
    
    case QRType.MENU:
      // Menu data doesn't have a URL, it has restaurant info
      return JSON.stringify({
        restaurantName: data.restaurantName,
        categories: data.categories,
        currency: data.currency
      });
    
    case QRType.BUSINESS:
      return JSON.stringify({
        name: data.name,
        type: data.industry,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        hours: data.hours
      });
    
    case QRType.LINKS_LIST:
      return data.links ? data.links.map((link: any) => `${link.title}: ${link.url}`).join('\n') : '';
    
    case QRType.COUPON:
      return JSON.stringify({
        code: data.code,
        description: data.description,
        validUntil: data.validUntil,
        terms: data.terms
      });
    
    case QRType.FACEBOOK:
      return data.pageUrl || '';
    
    case QRType.INSTAGRAM:
      return data.profileUrl || '';
    
    case QRType.SOCIAL_MEDIA:
      return JSON.stringify({
        platform: data.platform,
        username: data.username,
        profileUrl: data.profileUrl
      });
    
    case QRType.WHATSAPP:
      return `https://wa.me/${data.phoneNumber?.replace(/[^0-9]/g, '')}${data.message ? `?text=${encodeURIComponent(data.message)}` : ''}`;
    
    default:
      return JSON.stringify(data);
  }
}

function formatDate(date?: string): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}