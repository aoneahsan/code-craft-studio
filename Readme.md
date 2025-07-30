# Code Craft Studio

## 📚 Documentation

| Resource                                                                       | Description                                             |
| ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| 📖 [API Reference](./docs/API.md)                                              | Complete API documentation with all methods and options |
| 🚀 [Quick Start Guide](./app-project-documentation/QUICKSTART.md)              | Get started in 5 minutes                                |
| 🏗️ [Architecture](./app-project-documentation/ARCHITECTURE.md)                 | Plugin architecture and design decisions                |
| ✨ [Features](./app-project-documentation/FEATURES.md)                         | Detailed feature documentation                          |
| 🎮 [Interactive Playground](./app-project-documentation/api-playground/)       | Try the API in your browser                             |
| 📱 [Platform Setup](./app-project-documentation/platform-setup/)               | iOS and Android configuration                           |
| 🎥 [Video Tutorials](./app-project-documentation/tutorials/video-tutorials.md) | Step-by-step video guides                               |

<div align="center">
  <img src="assets/icon-only.jpeg" alt="Code Craft Studio Logo" width="120" />
  
  <h3>A comprehensive Capacitor plugin for QR code and barcode scanning/generation</h3>
  
  [![npm version](https://img.shields.io/npm/v/code-craft-studio.svg)](https://www.npmjs.com/package/code-craft-studio)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Platform Support](https://img.shields.io/badge/platforms-Web%20%7C%20iOS%20%7C%20Android-blue.svg)](https://capacitorjs.com/)
</div>

## 🚀 Features

### Core Features

- **📷 QR Code Scanner**: Native camera-based scanning with web fallback
- **🔖 Barcode Scanner**: Scan 14+ barcode formats (EAN, UPC, Code 128, etc.)
- **🎨 QR Code Generator**: Generate QR codes with full customization options
- **📊 Barcode Generator**: Generate 1D and 2D barcodes with text overlay
- **📊 Analytics & History**: Track scans, locations, and user engagement
- **💾 Multiple Export Formats**: PNG, JPG, SVG, JSON, WebP (PDF, GIF, EPS, WMF coming soon)
- **⚛️ React Components**: Ready-to-use components for quick integration
- **📱 Cross-Platform**: Works on Web, iOS, and Android
- **🔌 Plugin Architecture**: Easy to extend and customize

### 22+ Supported QR Code Types & 14+ Barcode Formats

#### QR Code Types

- **🌐 Web & Links**: Website, PDF, Images Gallery, Video, Links List
- **📱 Social Media**: Facebook, Instagram, WhatsApp, Social Media Hub
- **💼 Business**: vCard, Business Info, Menu, Coupon
- **🔧 Utilities**: WiFi, MP3, Apps, Text, Email, SMS, Phone, Location, Event
- **🎯 Custom**: Any custom data format

#### Barcode Formats

- **📊 1D Barcodes**:
  - EAN-13, EAN-8 (European Article Number)
  - UPC-A, UPC-E (Universal Product Code)
  - Code 128 (High-density alphanumeric)
  - Code 39, Code 93 (Alphanumeric with special characters)
  - ITF/ITF-14 (Interleaved 2 of 5)
  - Codabar (Numeric with special start/stop characters)
- **🔲 2D Barcodes**:
  - QR Code (Quick Response)
  - Data Matrix (Compact 2D barcode)
  - PDF417 (Stacked linear barcode)
  - Aztec (Compact 2D barcode)

### Advanced Options

- **🎨 Design Customization**:
  - Custom colors (foreground/background)
  - Logo embedding
  - Frame styles
  - Margin control
  - Error correction levels (L, M, Q, H)
- **⚙️ Generation Options**:
  - QR version control (1-40)
  - Mask pattern selection (0-7)
  - Scale and size control
  - Kanji character support
- **📸 Scanner Options**:
  - Front/back camera switching
  - Torch/flashlight control
  - Custom scan regions
  - Video styling options
  - Scan delay configuration

## 📦 Installation

### Quick Setup (Recommended)

```bash
npm install code-craft-studio
npx code-craft-studio-setup
```

The setup script will:

- Install dependencies
- Configure iOS and Android permissions
- Sync Capacitor
- Create example files

### Manual Setup

```bash
# Install the package
npm install code-craft-studio

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
/* Import all Code Craft Studio styles */
@import 'code-craft-studio/src/styles/qrcode-studio.css';
```

### Basic Usage

```tsx
import {
  QRScanner,
  QRGenerator,
  QRStudio,
  BarcodeScanner,
} from 'code-craft-studio';

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
      type='website'
      data={{ url: 'https://example.com' }}
      size={300}
    />
  );
}

// Barcode Scanner (Product Scanner)
function ProductScanner() {
  return (
    <BarcodeScanner
      formats={['EAN_13', 'UPC_A', 'CODE_128']}
      onScan={(result) => {
        console.log(`Scanned ${result.format}: ${result.rawValue}`);
      }}
    />
  );
}

// Full Studio Component (QR + Barcode)
function Studio() {
  return (
    <QRStudio
      features={{
        scanner: true,
        generator: true,
        barcodeScanner: true,
        barcodeGenerator: true,
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
import { QRCodeStudio } from 'code-craft-studio';

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
      light: '#FFFFFF',
    },
  },
  size: 300,
});

console.log(qrCode.dataUrl); // Base64 image
console.log(qrCode.svg); // SVG string
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
  showTorchButton: true,
});

// Stop scanning
await QRCodeStudio.stopScan();

// Remove listener
listener.remove();
```

#### Generate Barcode

```typescript
const barcode = await QRCodeStudio.generateBarcode({
  format: 'EAN_13',
  data: '5901234123457',
  width: 300,
  height: 100,
  displayText: true,
});

console.log(barcode.dataUrl); // Base64 barcode image
```

#### Read Barcodes from Image

```typescript
const result = await QRCodeStudio.readBarcodesFromImage({
  path: '/path/to/image.jpg',
  formats: ['EAN_13', 'CODE_128', 'QR_CODE'],
});

result.barcodes.forEach((barcode) => {
  console.log(`Format: ${barcode.format}, Data: ${barcode.rawValue}`);
});
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
    showFlipCameraButton: true,
  }}
  showOverlay={true}
  className='my-scanner'
/>
```

### QRGenerator Component

```tsx
<QRGenerator
  type='wifi'
  data={{
    ssid: 'MyNetwork',
    password: 'MyPassword',
    security: 'WPA2',
  }}
  design={{
    colors: {
      dark: '#2C3E50',
      light: '#FFFFFF',
    },
    logo: {
      src: 'https://example.com/logo.png',
      size: 60,
    },
    dotsStyle: 'rounded',
    cornersSquareStyle: 'extra-rounded',
  }}
  size={400}
  showDownload={true}
  showShare={true}
  onGenerate={(result) => {
    console.log('Generated:', result);
  }}
/>
```

### BarcodeScanner Component

```tsx
<BarcodeScanner
  formats={['EAN_13', 'UPC_A', 'CODE_128', 'CODE_39']}
  onScan={(result) => {
    console.log(`Scanned ${result.format}: ${result.rawValue}`);
    // Validate barcode if needed
    if (validateBarcodeData(result.format, result.rawValue)) {
      // Process valid barcode
    }
  }}
  onError={(error) => {
    console.error('Scan error:', error);
  }}
  continuous={false}
  torch={false}
  showOverlay={true}
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
        light: '#FFFFFF',
      },
    },
  }}
  theme={{
    primary: '#007AFF',
    secondary: '#5856D6',
    mode: 'light',
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
    templates: true,
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

| Type           | Description             | Required Data                                 |
| -------------- | ----------------------- | --------------------------------------------- |
| `website`      | Link to any website     | `url`, `title?`, `description?`               |
| `pdf`          | Share PDF documents     | `url`, `title?`, `description?`               |
| `images`       | Multiple images gallery | `images[]`, `title?`, `description?`          |
| `video`        | Video content           | `url`, `title?`, `thumbnail?`                 |
| `wifi`         | WiFi credentials        | `ssid`, `password?`, `security`               |
| `menu`         | Restaurant menu         | `restaurantName`, `categories[]`              |
| `business`     | Business information    | `name`, `phone?`, `email?`, `website?`        |
| `vcard`        | Digital business card   | `firstName?`, `lastName?`, `phone?`, `email?` |
| `mp3`          | Audio files             | `url`, `title?`, `artist?`                    |
| `apps`         | App store links         | `appStoreUrl?`, `playStoreUrl?`               |
| `links_list`   | Multiple links          | `title?`, `links[]`                           |
| `coupon`       | Discount coupons        | `code`, `description?`, `validUntil?`         |
| `facebook`     | Facebook page           | `pageUrl`, `pageName?`                        |
| `instagram`    | Instagram profile       | `profileUrl`, `username?`                     |
| `social_media` | All social links        | `facebook?`, `instagram?`, `twitter?`, etc.   |
| `whatsapp`     | WhatsApp chat           | `phoneNumber`, `message?`                     |
| `text`         | Plain text              | `text`                                        |
| `email`        | Email composition       | `to`, `subject?`, `body?`                     |
| `sms`          | SMS message             | `phoneNumber`, `message?`                     |
| `phone`        | Phone call              | `phoneNumber`                                 |
| `location`     | Geographic location     | `latitude`, `longitude`, `address?`           |
| `event`        | Calendar event          | `title`, `startDate`, `endDate?`, `location?` |

## 🎨 Customization Options

### Design Options

```typescript
interface QRDesignOptions {
  colors?: {
    dark?: string; // Foreground color
    light?: string; // Background color
  };
  logo?: {
    src: string; // Logo URL
    size?: number; // Logo size
    margin?: number; // Logo margin
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
  imageSize?: number; // 0-1
  margin?: number; // Quiet zone
}
```

## 📊 Analytics

Track QR code performance:

```typescript
const analytics = await QRCodeStudio.getAnalytics({
  qrCodeId: 'qr_123',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date(),
  },
  metrics: ['scans', 'unique_scans', 'locations', 'devices'],
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

## ⚙️ Advanced Configuration

### Generation Options

All options are exposed to give you full control over QR code generation:

```typescript
await QRCodeStudio.generate({
  type: 'website',
  data: { url: 'https://example.com' },

  // Basic options
  size: 300, // Image size in pixels
  errorCorrectionLevel: 'M', // L (7%), M (15%), Q (25%), H (30%)

  // Advanced options
  version: undefined, // QR version (1-40, auto if undefined)
  maskPattern: undefined, // Mask pattern (0-7, auto if undefined)
  margin: 4, // Quiet zone size
  scale: 4, // Scale factor (pixels per module)
  width: undefined, // Force specific width (overrides scale)
  toSJISFunc: undefined, // Kanji encoding function

  // Design options
  design: {
    colors: { dark: '#000000', light: '#FFFFFF' },
    logo: { src: 'logo.png', size: 60 },
    // ... other design options
  },
});
```

### Scanner Options

Configure the scanner with extensive options:

```typescript
await QRCodeStudio.startScan({
  // Camera options
  camera: 'back', // 'front' or 'back'
  showTorchButton: true, // Show flashlight toggle
  showFlipCameraButton: true, // Show camera switch button

  // Performance options
  scanDelay: 200, // Milliseconds between scans
  maxScansPerSecond: 5, // Alternative to scanDelay

  // Web-specific options
  videoStyle: {
    // Custom video element styling
    position: 'fixed',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  highlightCodeOutline: true, // Highlight detected QR codes
  highlightScanRegion: true, // Highlight scan area
  calculateScanRegion: (video) => ({
    // Custom scan region
    x: video.videoWidth * 0.25,
    y: video.videoHeight * 0.25,
    width: video.videoWidth * 0.5,
    height: video.videoHeight * 0.5,
  }),

  // Format filtering
  formats: [BarcodeFormat.QR_CODE], // Scan only specific formats
});
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📊 Barcode Examples

### Product Inventory Management

```typescript
import { QRCodeStudio, validateBarcodeData } from 'code-craft-studio';

// Generate product barcode
async function createProductLabel(productId: string, sku: string) {
  // Generate EAN-13 barcode for product
  const barcode = await QRCodeStudio.generateBarcode({
    format: 'EAN_13',
    data: '5901234123457', // Your product EAN
    width: 300,
    height: 100,
    displayText: true,
    outputFormat: 'png',
  });

  // Also generate a QR code with detailed product info
  const qrCode = await QRCodeStudio.generate({
    type: 'text',
    data: { text: JSON.stringify({ id: productId, sku, warehouse: 'A1' }) },
    size: 200,
  });

  return { barcode, qrCode };
}

// Scan and validate product
async function scanProduct() {
  const listener = await QRCodeStudio.addListener('scanResult', (result) => {
    if (result.format === 'EAN_13') {
      if (validateBarcodeData('EAN_13', result.content)) {
        console.log('Valid product barcode:', result.content);
        // Look up product in database
      }
    }
  });

  await QRCodeStudio.startScan({
    formats: ['EAN_13', 'UPC_A', 'QR_CODE'],
  });
}
```

### Ticket System with PDF417

```tsx
import React from 'react';
import { QRCodeStudio } from 'code-craft-studio';

function TicketGenerator({ eventId, userId, seatNumber }) {
  const generateTicket = async () => {
    // Generate PDF417 barcode (common for tickets/boarding passes)
    const ticketBarcode = await QRCodeStudio.generateBarcode({
      format: 'PDF_417',
      data: JSON.stringify({
        event: eventId,
        user: userId,
        seat: seatNumber,
        timestamp: Date.now(),
      }),
      width: 400,
      height: 150,
    });

    return ticketBarcode;
  };

  return <button onClick={generateTicket}>Generate Ticket</button>;
}
```

### Multi-Format Scanner Component

```tsx
import React, { useState } from 'react';
import { BarcodeScanner, getBarcodeConstraints } from 'code-craft-studio';

function UniversalScanner() {
  const [lastScan, setLastScan] = useState(null);

  const handleScan = (result) => {
    const constraints = getBarcodeConstraints(result.format);

    setLastScan({
      format: result.format,
      data: result.rawValue,
      constraints: constraints.description,
    });

    // Handle different barcode types
    switch (result.format) {
      case 'QR_CODE':
        // Parse QR code data
        break;
      case 'EAN_13':
      case 'UPC_A':
        // Look up product
        break;
      case 'CODE_128':
        // Process inventory code
        break;
      case 'PDF_417':
        // Handle ticket/document
        break;
    }
  };

  return (
    <div>
      <BarcodeScanner
        formats={[
          'QR_CODE',
          'EAN_13',
          'EAN_8',
          'UPC_A',
          'UPC_E',
          'CODE_128',
          'CODE_39',
          'ITF',
          'PDF_417',
          'AZTEC',
        ]}
        onScan={handleScan}
        continuous={true}
      />

      {lastScan && (
        <div className='scan-result'>
          <h3>Last Scan</h3>
          <p>Format: {lastScan.format}</p>
          <p>Data: {lastScan.data}</p>
          <p>Type: {lastScan.constraints}</p>
        </div>
      )}
    </div>
  );
}
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
- 🐛 Issues: [GitHub Issues](https://github.com/aoneahsan/code-craft-studio/issues)
- 📖 Docs: [Documentation](https://github.com/aoneahsan/code-craft-studio/wiki)

---

<div align="center">
  Made with ❤️ by <a href="https://aoneahsan.com">Ahsan Mahmood</a>
</div>

## Note

This package takes over and continues development from the original [qrcode-studio](https://www.npmjs.com/package/qrcode-studio) package.
