# QRCode Studio

<div align="center">
  <img src="assets/icon-only.jpeg" alt="QRCode Studio Logo" width="120" />
  
  <h3>A comprehensive Capacitor plugin for QR code scanning and generation</h3>
  
  [![npm version](https://img.shields.io/npm/v/qrcode-studio.svg)](https://www.npmjs.com/package/qrcode-studio)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Platform Support](https://img.shields.io/badge/platforms-Web%20%7C%20iOS%20%7C%20Android-blue.svg)](https://capacitorjs.com/)
</div>

## 🚀 Features

- **📷 QR Code Scanner**: Native camera-based scanning with web fallback
- **🎨 QR Code Generator**: Support for 22+ different QR code types
- **🎯 Customizable Design**: Colors, logos, frames, and styles
- **📊 Analytics**: Track scans, locations, and user engagement
- **💾 Export Options**: PNG, JPG, SVG, PDF, and more
- **🌐 Landing Pages**: Create custom landing pages for QR codes
- **⚛️ React Components**: Ready-to-use components for quick integration
- **📱 Cross-Platform**: Works on Web, iOS, and Android

## 📦 Installation

### Quick Setup (Recommended)

```bash
npm install qrcode-studio
npx qrcode-studio-setup
```

The setup script will:
- Install dependencies
- Configure iOS and Android permissions
- Sync Capacitor
- Create example files

### Manual Setup

```bash
# Install the package
npm install qrcode-studio

# Install Capacitor if not already installed
npm install @capacitor/core @capacitor/cli

# Add platforms
npx cap add ios
npx cap add android

# Sync
npx cap sync
```

#### iOS Configuration

Add to your `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan QR codes</string>
```

#### Android Configuration

Add to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## 🎯 Quick Start

### Import Styles

Add to your main CSS file:

```css
/* Import all QRCode Studio styles */
@import 'qrcode-studio/src/styles/qrcode-studio.css';
```

### Basic Usage

```tsx
import { QRScanner, QRGenerator, QRStudio } from 'qrcode-studio';

// Simple QR Scanner
function Scanner() {
  return (
    <QRScanner
      onScan={(result) => {
        console.log('Scanned:', result.content);
      }}
    />
  );
}

// Simple QR Generator
function Generator() {
  return (
    <QRGenerator
      type="website"
      data={{ url: 'https://example.com' }}
      size={300}
    />
  );
}

// Full Studio Component
function Studio() {
  return (
    <QRStudio
      features={{
        scanner: true,
        generator: true,
        history: true,
      }}
    />
  );
}
```

## 🔧 API Reference

### Plugin API

#### Check Permissions

```typescript
import { QRCodeStudio } from 'qrcode-studio';

const permissions = await QRCodeStudio.checkPermissions();
console.log(permissions.camera); // 'granted' | 'denied' | 'prompt'
```

#### Request Permissions

```typescript
const permissions = await QRCodeStudio.requestPermissions();
```

#### Generate QR Code

```typescript
const qrCode = await QRCodeStudio.generate({
  type: 'website',
  data: { url: 'https://example.com' },
  design: {
    colors: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  },
  size: 300
});

console.log(qrCode.dataUrl); // Base64 image
console.log(qrCode.svg);     // SVG string
```

#### Start Scanning

```typescript
// Add listener for scan results
const listener = await QRCodeStudio.addListener('scanResult', (result) => {
  console.log('Scanned:', result.content);
  console.log('Type:', result.type);
  console.log('Data:', result.parsedData);
});

// Start scanning
await QRCodeStudio.startScan({
  camera: 'back',
  showTorchButton: true
});

// Stop scanning
await QRCodeStudio.stopScan();

// Remove listener
listener.remove();
```

## 🎨 React Components

### QRScanner Component

```tsx
<QRScanner
  onScan={(result) => {
    console.log('Scanned:', result);
  }}
  onError={(error) => {
    console.error('Error:', error);
  }}
  options={{
    camera: 'back',
    scanDelay: 1000,
    showTorchButton: true,
    showFlipCameraButton: true
  }}
  showOverlay={true}
  className="my-scanner"
/>
```

### QRGenerator Component

```tsx
<QRGenerator
  type="wifi"
  data={{
    ssid: 'MyNetwork',
    password: 'MyPassword',
    security: 'WPA2'
  }}
  design={{
    colors: {
      dark: '#2C3E50',
      light: '#FFFFFF'
    },
    logo: {
      src: 'https://example.com/logo.png',
      size: 60
    },
    dotsStyle: 'rounded',
    cornersSquareStyle: 'extra-rounded'
  }}
  size={400}
  showDownload={true}
  showShare={true}
  onGenerate={(result) => {
    console.log('Generated:', result);
  }}
/>
```

### QRStudio Component

```tsx
<QRStudio
  config={{
    allowedTypes: ['website', 'wifi', 'vcard', 'text'],
    defaultType: 'website',
    defaultDesign: {
      colors: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }
  }}
  theme={{
    primary: '#007AFF',
    secondary: '#5856D6',
    mode: 'light'
  }}
  features={{
    scanner: true,
    generator: true,
    landingPages: true,
    analytics: true,
    export: true,
    sharing: true,
    history: true,
    favorites: true,
    templates: true
  }}
  onSave={(result) => {
    console.log('Saved:', result);
  }}
  onScan={(result) => {
    console.log('Scanned:', result);
  }}
/>
```

## 📋 Supported QR Code Types

| Type | Description | Required Data |
|------|-------------|---------------|
| `website` | Link to any website | `url`, `title?`, `description?` |
| `pdf` | Share PDF documents | `url`, `title?`, `description?` |
| `images` | Multiple images gallery | `images[]`, `title?`, `description?` |
| `video` | Video content | `url`, `title?`, `thumbnail?` |
| `wifi` | WiFi credentials | `ssid`, `password?`, `security` |
| `menu` | Restaurant menu | `restaurantName`, `categories[]` |
| `business` | Business information | `name`, `phone?`, `email?`, `website?` |
| `vcard` | Digital business card | `firstName?`, `lastName?`, `phone?`, `email?` |
| `mp3` | Audio files | `url`, `title?`, `artist?` |
| `apps` | App store links | `appStoreUrl?`, `playStoreUrl?` |
| `links_list` | Multiple links | `title?`, `links[]` |
| `coupon` | Discount coupons | `code`, `description?`, `validUntil?` |
| `facebook` | Facebook page | `pageUrl`, `pageName?` |
| `instagram` | Instagram profile | `profileUrl`, `username?` |
| `social_media` | All social links | `facebook?`, `instagram?`, `twitter?`, etc. |
| `whatsapp` | WhatsApp chat | `phoneNumber`, `message?` |
| `text` | Plain text | `text` |
| `email` | Email composition | `to`, `subject?`, `body?` |
| `sms` | SMS message | `phoneNumber`, `message?` |
| `phone` | Phone call | `phoneNumber` |
| `location` | Geographic location | `latitude`, `longitude`, `address?` |
| `event` | Calendar event | `title`, `startDate`, `endDate?`, `location?` |

## 🎨 Customization Options

### Design Options

```typescript
interface QRDesignOptions {
  colors?: {
    dark?: string;    // Foreground color
    light?: string;   // Background color
  };
  logo?: {
    src: string;      // Logo URL
    size?: number;    // Logo size
    margin?: number;  // Logo margin
    borderRadius?: number;
  };
  frame?: {
    style: 'square' | 'rounded' | 'circle' | 'banner';
    text?: string;
    color?: string;
    textColor?: string;
  };
  dotsStyle?: 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded';
  cornersSquareStyle?: 'square' | 'dot' | 'extra-rounded';
  cornersDotStyle?: 'square' | 'dot' | 'extra-rounded';
  backgroundImage?: string;
  imageSize?: number;  // 0-1
  margin?: number;     // Quiet zone
}
```

## 📊 Analytics

Track QR code performance:

```typescript
const analytics = await QRCodeStudio.getAnalytics({
  qrCodeId: 'qr_123',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date()
  },
  metrics: ['scans', 'unique_scans', 'locations', 'devices']
});

console.log('Total scans:', analytics.totalScans);
console.log('Unique scans:', analytics.uniqueScans);
console.log('Top locations:', analytics.locations);
console.log('Device types:', analytics.devices);
```

## 💾 Export Formats

- **PNG** - Raster image format
- **JPG** - Compressed image format
- **SVG** - Vector format (scalable)
- **PDF** - Document format
- **GIF** - Animated format support
- **JSON** - Raw QR data
- **WebP** - Modern image format
- **EPS** - Vector format for print
- **WMF** - Windows metafile

## 🔐 Permissions

### iOS
- Camera permission for scanning
- Photo library permission for saving (optional)

### Android
- Camera permission for scanning
- Storage permission for saving (optional)

### Web
- Camera/getUserMedia permission for scanning

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ahsan Mahmood**

- Website: [https://aoneahsan.com](https://aoneahsan.com)
- GitHub: [@aoneahsan](https://github.com/aoneahsan)
- Email: [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)

## 🙏 Acknowledgments

- Built on top of [Capacitor](https://capacitorjs.com/)
- QR scanning powered by [qr-scanner](https://github.com/nimiq/qr-scanner)
- QR generation powered by [qrcode](https://github.com/soldair/node-qrcode)

## 📈 Roadmap

- [ ] Batch QR code generation
- [ ] Custom QR code shapes
- [ ] Animated QR codes
- [ ] Advanced analytics dashboard
- [ ] Cloud sync support
- [ ] Bulk operations API
- [ ] QR code templates marketplace

## 💡 Support

- 📧 Email: [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/aoneahsan/qrcode-studio/issues)
- 📖 Docs: [Documentation](https://github.com/aoneahsan/qrcode-studio/wiki)

---

<div align="center">
  Made with ❤️ by <a href="https://aoneahsan.com">Ahsan Mahmood</a>
</div>