import { QRType } from '../definitions';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
  min?: string;
  max?: string;
  options?: Array<{ value: string; label: string }>;
  helper?: string;
}

export const qrFormFields: Record<QRType, FormFieldProps[]> = {
  [QRType.WEBSITE]: [
    { label: 'URL', name: 'url', type: 'url', placeholder: 'https://example.com', required: true },
    { label: 'Title', name: 'title', type: 'text', placeholder: 'Optional page title' },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Optional description' },
  ],

  [QRType.PDF]: [
    { label: 'PDF URL', name: 'url', type: 'url', placeholder: 'https://example.com/document.pdf', required: true },
    { label: 'Title', name: 'title', type: 'text', placeholder: 'Document title' },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Document description' },
  ],

  [QRType.IMAGES]: [
    { label: 'Images', name: 'images', type: 'array', required: true },
    { label: 'Gallery Title', name: 'title', type: 'text', placeholder: 'My Image Gallery' },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Gallery description' },
  ],

  [QRType.VIDEO]: [
    { label: 'Video URL', name: 'url', type: 'url', placeholder: 'https://youtube.com/watch?v=...', required: true },
    { label: 'Title', name: 'title', type: 'text', placeholder: 'Video title' },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Video description' },
    { label: 'Thumbnail URL', name: 'thumbnail', type: 'url', placeholder: 'https://example.com/thumb.jpg' },
  ],

  [QRType.WIFI]: [
    { label: 'Network Name (SSID)', name: 'ssid', type: 'text', placeholder: 'MyNetwork', required: true },
    { 
      label: 'Security Type', 
      name: 'security', 
      type: 'select', 
      required: true,
      options: [
        { value: 'WPA2', label: 'WPA2 (Recommended)' },
        { value: 'WPA3', label: 'WPA3' },
        { value: 'WPA', label: 'WPA' },
        { value: 'WEP', label: 'WEP' },
        { value: 'nopass', label: 'No Password' },
      ]
    },
    { label: 'Password', name: 'password', type: 'password', placeholder: 'Network password' },
    { label: 'Hidden Network', name: 'hidden', type: 'checkbox' },
  ],

  [QRType.MENU]: [
    { label: 'Restaurant Name', name: 'restaurantName', type: 'text', required: true },
    { label: 'Categories', name: 'categories', type: 'array', required: true },
    { 
      label: 'Currency', 
      name: 'currency', 
      type: 'select',
      options: [
        { value: 'USD', label: '$ USD' },
        { value: 'EUR', label: '€ EUR' },
        { value: 'GBP', label: '£ GBP' },
        { value: 'JPY', label: '¥ JPY' },
        { value: 'CNY', label: '¥ CNY' },
      ]
    },
  ],

  [QRType.BUSINESS]: [
    { label: 'Business Name', name: 'name', type: 'text', required: true },
    { label: 'Industry', name: 'industry', type: 'text', placeholder: 'e.g., Restaurant, Retail, Services' },
    { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+1234567890' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'contact@business.com' },
    { label: 'Website', name: 'website', type: 'url', placeholder: 'https://business.com' },
    { label: 'Address', name: 'address', type: 'textarea', placeholder: 'Full business address' },
    { label: 'Business Hours', name: 'hours', type: 'textarea', placeholder: 'Mon-Fri: 9AM-5PM' },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'About your business' },
    { label: 'Logo URL', name: 'logo', type: 'url', placeholder: 'https://example.com/logo.png' },
  ],

  [QRType.VCARD]: [
    { label: 'First Name', name: 'firstName', type: 'text' },
    { label: 'Last Name', name: 'lastName', type: 'text' },
    { label: 'Organization', name: 'organization', type: 'text' },
    { label: 'Job Title', name: 'title', type: 'text' },
    { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+1234567890' },
    { label: 'Mobile', name: 'mobile', type: 'tel', placeholder: '+1234567890' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'email@example.com' },
    { label: 'Website', name: 'website', type: 'url', placeholder: 'https://example.com' },
    { label: 'Address', name: 'address', type: 'textarea' },
    { label: 'Note', name: 'note', type: 'textarea' },
  ],

  [QRType.MP3]: [
    { label: 'Audio URL', name: 'url', type: 'url', placeholder: 'https://example.com/audio.mp3', required: true },
    { label: 'Title', name: 'title', type: 'text', placeholder: 'Song title' },
    { label: 'Artist', name: 'artist', type: 'text', placeholder: 'Artist name' },
    { label: 'Album', name: 'album', type: 'text', placeholder: 'Album name' },
    { label: 'Cover Art URL', name: 'coverArt', type: 'url', placeholder: 'https://example.com/cover.jpg' },
  ],

  [QRType.APPS]: [
    { label: 'App Store URL', name: 'appStoreUrl', type: 'url', placeholder: 'https://apps.apple.com/...' },
    { label: 'Play Store URL', name: 'playStoreUrl', type: 'url', placeholder: 'https://play.google.com/...' },
    { label: 'Windows Store URL', name: 'windowsStoreUrl', type: 'url', placeholder: 'https://microsoft.com/...' },
    { label: 'Custom URL', name: 'customUrl', type: 'url', placeholder: 'https://example.com/app' },
    { label: 'App Name', name: 'appName', type: 'text', placeholder: 'My Amazing App' },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'App description' },
    { label: 'Icon URL', name: 'icon', type: 'url', placeholder: 'https://example.com/icon.png' },
  ],

  [QRType.LINKS_LIST]: [
    { label: 'List Title', name: 'title', type: 'text', placeholder: 'My Important Links' },
    { label: 'Links', name: 'links', type: 'array', required: true },
  ],

  [QRType.COUPON]: [
    { label: 'Coupon Code', name: 'code', type: 'text', placeholder: 'SAVE20', required: true },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Get 20% off your purchase' },
    { label: 'Discount', name: 'discount', type: 'text', placeholder: '20% OFF' },
    { label: 'Valid Until', name: 'validUntil', type: 'date' },
    { label: 'Terms & Conditions', name: 'terms', type: 'textarea', placeholder: 'Coupon terms' },
    { label: 'Logo URL', name: 'logo', type: 'url', placeholder: 'https://example.com/logo.png' },
  ],

  [QRType.FACEBOOK]: [
    { label: 'Facebook Page URL', name: 'pageUrl', type: 'url', placeholder: 'https://facebook.com/yourpage', required: true },
    { label: 'Page Name', name: 'pageName', type: 'text', placeholder: 'Your Page Name' },
  ],

  [QRType.INSTAGRAM]: [
    { label: 'Instagram Profile URL', name: 'profileUrl', type: 'url', placeholder: 'https://instagram.com/username', required: true },
    { label: 'Username', name: 'username', type: 'text', placeholder: '@username' },
  ],

  [QRType.SOCIAL_MEDIA]: [
    { label: 'Facebook', name: 'facebook', type: 'url', placeholder: 'https://facebook.com/...' },
    { label: 'Instagram', name: 'instagram', type: 'url', placeholder: 'https://instagram.com/...' },
    { label: 'Twitter/X', name: 'twitter', type: 'url', placeholder: 'https://twitter.com/...' },
    { label: 'LinkedIn', name: 'linkedin', type: 'url', placeholder: 'https://linkedin.com/...' },
    { label: 'YouTube', name: 'youtube', type: 'url', placeholder: 'https://youtube.com/...' },
    { label: 'TikTok', name: 'tiktok', type: 'url', placeholder: 'https://tiktok.com/...' },
    { label: 'Pinterest', name: 'pinterest', type: 'url', placeholder: 'https://pinterest.com/...' },
    { label: 'Snapchat', name: 'snapchat', type: 'url', placeholder: 'https://snapchat.com/...' },
    { label: 'Reddit', name: 'reddit', type: 'url', placeholder: 'https://reddit.com/...' },
  ],

  [QRType.WHATSAPP]: [
    { label: 'Phone Number', name: 'phoneNumber', type: 'tel', placeholder: '+1234567890', required: true, helper: 'Include country code' },
    { label: 'Pre-filled Message', name: 'message', type: 'textarea', placeholder: 'Hello! I found your contact through QR code...' },
  ],

  [QRType.TEXT]: [
    { label: 'Text Content', name: 'text', type: 'textarea', placeholder: 'Enter your text here...', required: true, maxLength: 2000 },
  ],

  [QRType.EMAIL]: [
    { label: 'To Email', name: 'to', type: 'email', placeholder: 'recipient@example.com', required: true },
    { label: 'Subject', name: 'subject', type: 'text', placeholder: 'Email subject' },
    { label: 'Message', name: 'body', type: 'textarea', placeholder: 'Email message' },
    { label: 'CC', name: 'cc', type: 'email', placeholder: 'cc@example.com' },
    { label: 'BCC', name: 'bcc', type: 'email', placeholder: 'bcc@example.com' },
  ],

  [QRType.SMS]: [
    { label: 'Phone Number', name: 'phoneNumber', type: 'tel', placeholder: '+1234567890', required: true },
    { label: 'Message', name: 'message', type: 'textarea', placeholder: 'SMS message text' },
  ],

  [QRType.PHONE]: [
    { label: 'Phone Number', name: 'phoneNumber', type: 'tel', placeholder: '+1234567890', required: true },
  ],

  [QRType.LOCATION]: [
    { label: 'Latitude', name: 'latitude', type: 'number', placeholder: '37.7749', required: true, min: '-90', max: '90' },
    { label: 'Longitude', name: 'longitude', type: 'number', placeholder: '-122.4194', required: true, min: '-180', max: '180' },
    { label: 'Location Name', name: 'name', type: 'text', placeholder: 'Golden Gate Bridge' },
    { label: 'Address', name: 'address', type: 'text', placeholder: 'Full address' },
  ],

  [QRType.EVENT]: [
    { label: 'Event Title', name: 'title', type: 'text', placeholder: 'Annual Conference', required: true },
    { label: 'Location', name: 'location', type: 'text', placeholder: 'Conference Center, New York' },
    { label: 'Start Date & Time', name: 'startDate', type: 'datetime-local', required: true },
    { label: 'End Date & Time', name: 'endDate', type: 'datetime-local' },
    { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Event details' },
    { label: 'Event URL', name: 'url', type: 'url', placeholder: 'https://example.com/event' },
  ],
};

export const qrTypeInfo: Record<QRType, { icon: string; description: string }> = {
  [QRType.WEBSITE]: { icon: '🌐', description: 'Link to any website URL' },
  [QRType.PDF]: { icon: '📄', description: 'Share a PDF document' },
  [QRType.IMAGES]: { icon: '🖼️', description: 'Share multiple images' },
  [QRType.VIDEO]: { icon: '🎥', description: 'Share a video' },
  [QRType.WIFI]: { icon: '📶', description: 'Connect to a Wi-Fi network' },
  [QRType.MENU]: { icon: '🍽️', description: 'Create a restaurant menu' },
  [QRType.BUSINESS]: { icon: '🏢', description: 'Share business information' },
  [QRType.VCARD]: { icon: '👤', description: 'Share a digital business card' },
  [QRType.MP3]: { icon: '🎵', description: 'Share an audio file' },
  [QRType.APPS]: { icon: '📱', description: 'Redirect to app stores' },
  [QRType.LINKS_LIST]: { icon: '🔗', description: 'Share multiple links' },
  [QRType.COUPON]: { icon: '🎟️', description: 'Share a coupon or discount' },
  [QRType.FACEBOOK]: { icon: '👍', description: 'Share your Facebook page' },
  [QRType.INSTAGRAM]: { icon: '📷', description: 'Share your Instagram profile' },
  [QRType.SOCIAL_MEDIA]: { icon: '👥', description: 'Share all social channels' },
  [QRType.WHATSAPP]: { icon: '💬', description: 'Start a WhatsApp chat' },
  [QRType.TEXT]: { icon: '📝', description: 'Share plain text' },
  [QRType.EMAIL]: { icon: '✉️', description: 'Send an email' },
  [QRType.SMS]: { icon: '💭', description: 'Send an SMS' },
  [QRType.PHONE]: { icon: '📞', description: 'Make a phone call' },
  [QRType.LOCATION]: { icon: '📍', description: 'Share a location' },
  [QRType.EVENT]: { icon: '📅', description: 'Share an event' },
};