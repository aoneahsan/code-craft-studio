# QRCode Studio API Documentation

## Table of Contents

- [Plugin API](#plugin-api)
- [React Components](#react-components)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Plugin API

### QRCodeStudio

The main plugin interface provides methods for QR code scanning, generation, and management.

#### Import

```typescript
import { QRCodeStudio } from 'qrcode-studio';
```

#### Methods

##### checkPermissions()

Check current camera permissions status.

```typescript
checkPermissions(): Promise<PermissionStatus>
```

**Returns:**
- `PermissionStatus` - Object containing camera permission state

**Example:**
```typescript
const status = await QRCodeStudio.checkPermissions();
if (status.camera === 'granted') {
  // Camera is ready to use
}
```

##### requestPermissions()

Request camera permissions from the user.

```typescript
requestPermissions(): Promise<PermissionStatus>
```

**Returns:**
- `PermissionStatus` - Updated permission status after request

**Example:**
```typescript
const status = await QRCodeStudio.requestPermissions();
if (status.camera === 'denied') {
  // Handle permission denial
}
```

##### startScan(options?)

Start QR code scanning using the device camera.

```typescript
startScan(options?: ScanOptions): Promise<void>
```

**Parameters:**
- `options` (optional) - Scanning configuration options

**Example:**
```typescript
await QRCodeStudio.startScan({
  camera: 'back',
  showTorchButton: true,
  showFlipCameraButton: true,
  scanDelay: 500
});
```

##### stopScan()

Stop the active QR code scanning session.

```typescript
stopScan(): Promise<void>
```

**Example:**
```typescript
await QRCodeStudio.stopScan();
```

##### generate(options)

Generate a QR code with specified data and design.

```typescript
generate(options: GenerateOptions): Promise<QRCodeResult>
```

**Parameters:**
- `options` - QR code generation configuration

**Returns:**
- `QRCodeResult` - Generated QR code data

**Example:**
```typescript
const qrCode = await QRCodeStudio.generate({
  type: 'website',
  data: { url: 'https://example.com' },
  design: {
    colors: { dark: '#000000', light: '#FFFFFF' },
    dotsStyle: 'rounded'
  },
  size: 300
});
```

##### saveQRCode(options)

Save a generated QR code to device storage.

```typescript
saveQRCode(options: SaveOptions): Promise<SaveResult>
```

**Parameters:**
- `options` - Save configuration including format and directory

**Returns:**
- `SaveResult` - Saved file information

**Example:**
```typescript
const result = await QRCodeStudio.saveQRCode({
  qrCode: generatedQR,
  fileName: 'my-qr-code',
  format: 'png',
  directory: Directory.Documents
});
```

##### getHistory(options?)

Retrieve QR code generation/scan history.

```typescript
getHistory(options?: HistoryOptions): Promise<HistoryResult>
```

**Parameters:**
- `options` (optional) - Filter and pagination options

**Returns:**
- `HistoryResult` - History items and total count

**Example:**
```typescript
const history = await QRCodeStudio.getHistory({
  type: 'website',
  limit: 20,
  offset: 0
});
```

##### clearHistory()

Clear all QR code history.

```typescript
clearHistory(): Promise<void>
```

**Example:**
```typescript
await QRCodeStudio.clearHistory();
```

##### getAnalytics(options)

Get analytics data for a specific QR code.

```typescript
getAnalytics(options: AnalyticsOptions): Promise<AnalyticsResult>
```

**Parameters:**
- `options` - Analytics query parameters

**Returns:**
- `AnalyticsResult` - Analytics data

**Example:**
```typescript
const analytics = await QRCodeStudio.getAnalytics({
  qrCodeId: 'qr_123',
  metrics: ['scans', 'locations', 'devices']
});
```

#### Event Listeners

##### addListener('scanResult', handler)

Listen for QR code scan results.

```typescript
addListener(
  eventName: 'scanResult',
  listenerFunc: (data: ScanResult) => void
): Promise<PluginListenerHandle>
```

**Example:**
```typescript
const listener = await QRCodeStudio.addListener('scanResult', (result) => {
  console.log('Scanned:', result.content);
  console.log('Type:', result.type);
  console.log('Parsed Data:', result.parsedData);
});

// Remove listener when done
listener.remove();
```

##### addListener('scanError', handler)

Listen for scanning errors.

```typescript
addListener(
  eventName: 'scanError',
  listenerFunc: (error: ScanError) => void
): Promise<PluginListenerHandle>
```

**Example:**
```typescript
const errorListener = await QRCodeStudio.addListener('scanError', (error) => {
  console.error('Scan error:', error.code, error.message);
});
```

##### removeAllListeners()

Remove all active event listeners.

```typescript
removeAllListeners(): Promise<void>
```

## React Components

### QRScanner

A ready-to-use QR code scanner component.

```typescript
import { QRScanner } from 'qrcode-studio';
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onScan` | `(result: ScanResult) => void` | Yes | Callback when QR code is scanned |
| `onError` | `(error: ScanError) => void` | No | Callback for scan errors |
| `options` | `ScanOptions` | No | Scanner configuration |
| `className` | `string` | No | CSS class name |
| `style` | `React.CSSProperties` | No | Inline styles |
| `showOverlay` | `boolean` | No | Show scanning overlay (default: true) |
| `overlayComponent` | `React.ReactNode` | No | Custom overlay component |

#### Example

```tsx
<QRScanner
  onScan={(result) => {
    console.log('Scanned:', result.content);
    // Handle scan result
  }}
  onError={(error) => {
    console.error('Error:', error.message);
  }}
  options={{
    camera: 'back',
    scanDelay: 1000
  }}
  showOverlay={true}
/>
```

### QRGenerator

Component for generating QR codes with customization options.

```typescript
import { QRGenerator } from 'qrcode-studio';
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `QRType` | Yes | Type of QR code to generate |
| `data` | `QRData` | Yes | Data for the QR code |
| `design` | `QRDesignOptions` | No | Visual customization options |
| `size` | `number` | No | Size in pixels (default: 300) |
| `format` | `ExportFormat` | No | Export format (default: 'png') |
| `onGenerate` | `(result: QRCodeResult) => void` | No | Callback when generated |
| `className` | `string` | No | CSS class name |
| `style` | `React.CSSProperties` | No | Inline styles |
| `showDownload` | `boolean` | No | Show download button (default: true) |
| `showShare` | `boolean` | No | Show share button (default: true) |

#### Example

```tsx
<QRGenerator
  type="wifi"
  data={{
    ssid: 'MyNetwork',
    password: 'SecurePassword123',
    security: 'WPA2'
  }}
  design={{
    colors: {
      dark: '#1a1a1a',
      light: '#ffffff'
    },
    dotsStyle: 'rounded',
    logo: {
      src: '/logo.png',
      size: 50
    }
  }}
  size={400}
  onGenerate={(result) => {
    console.log('Generated:', result.id);
  }}
/>
```

### QRStudio

Full-featured QR code studio component with scanner, generator, and history.

```typescript
import { QRStudio } from 'qrcode-studio';
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `QRStudioConfig` | No | Studio configuration |
| `theme` | `Theme` | No | UI theme settings |
| `features` | `FeatureFlags` | No | Enable/disable features |
| `onSave` | `(result: QRCodeResult) => void` | No | Callback when QR is saved |
| `onScan` | `(result: ScanResult) => void` | No | Callback when QR is scanned |
| `analytics` | `AnalyticsConfig` | No | Analytics configuration |
| `className` | `string` | No | CSS class name |
| `style` | `React.CSSProperties` | No | Inline styles |

#### Example

```tsx
<QRStudio
  config={{
    allowedTypes: ['website', 'wifi', 'vcard'],
    defaultType: 'website',
    defaultDesign: {
      colors: { dark: '#000', light: '#fff' }
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
    history: true,
    analytics: true,
    sharing: true
  }}
  onSave={(result) => {
    console.log('Saved:', result);
  }}
/>
```

## Type Definitions

### Core Types

#### PermissionStatus

```typescript
interface PermissionStatus {
  camera: PermissionState;
}

type PermissionState = 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied';
```

#### ScanOptions

```typescript
interface ScanOptions {
  showTorchButton?: boolean;
  showFlipCameraButton?: boolean;
  scanDelay?: number;
  camera?: 'front' | 'back';
  formats?: BarcodeFormat[];
}
```

#### GenerateOptions

```typescript
interface GenerateOptions {
  type: QRType;
  data: QRData;
  design?: QRDesignOptions;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  landingPage?: LandingPageOptions;
}
```

#### QRCodeResult

```typescript
interface QRCodeResult {
  id: string;
  base64?: string;
  svg?: string;
  dataUrl?: string;
  landingPageUrl?: string;
  shortUrl?: string;
}
```

#### ScanResult

```typescript
interface ScanResult {
  content: string;
  format: BarcodeFormat;
  type?: QRType;
  parsedData?: QRData;
  timestamp: number;
}
```

### QR Types

All supported QR code types:

```typescript
enum QRType {
  WEBSITE = 'website',
  PDF = 'pdf',
  IMAGES = 'images',
  VIDEO = 'video',
  WIFI = 'wifi',
  MENU = 'menu',
  BUSINESS = 'business',
  VCARD = 'vcard',
  MP3 = 'mp3',
  APPS = 'apps',
  LINKS_LIST = 'links_list',
  COUPON = 'coupon',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  SOCIAL_MEDIA = 'social_media',
  WHATSAPP = 'whatsapp',
  TEXT = 'text',
  EMAIL = 'email',
  SMS = 'sms',
  PHONE = 'phone',
  LOCATION = 'location',
  EVENT = 'event'
}
```

### Design Options

```typescript
interface QRDesignOptions {
  colors?: {
    dark?: string;
    light?: string;
  };
  logo?: {
    src: string;
    size?: number;
    margin?: number;
    borderRadius?: number;
  };
  frame?: {
    style: FrameStyle;
    text?: string;
    color?: string;
    textColor?: string;
  };
  dotsStyle?: DotsStyle;
  cornersSquareStyle?: CornerStyle;
  cornersDotStyle?: CornerStyle;
  backgroundImage?: string;
  imageSize?: number;
  margin?: number;
}
```

## Error Handling

### Error Types

#### ScanError

```typescript
interface ScanError {
  code: string;
  message: string;
}
```

Common error codes:
- `PERMISSION_DENIED` - Camera permission denied
- `CAMERA_UNAVAILABLE` - Camera not available
- `SCAN_ERROR` - General scanning error
- `START_SCAN_ERROR` - Failed to start scanner

#### QRValidationError

Thrown when QR data validation fails:

```typescript
class QRValidationError extends Error {
  field?: string; // The field that failed validation
}
```

### Error Handling Example

```typescript
try {
  const qrCode = await QRCodeStudio.generate({
    type: 'wifi',
    data: {
      ssid: '', // This will fail validation
      security: 'WPA2'
    }
  });
} catch (error) {
  if (error instanceof QRValidationError) {
    console.error('Validation failed:', error.message);
    console.error('Field:', error.field);
  } else {
    console.error('Generation failed:', error);
  }
}
```

## Examples

### Complete Scanner Implementation

```tsx
import React, { useState } from 'react';
import { QRScanner, ScanResult } from 'qrcode-studio';

function ScannerPage() {
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (result: ScanResult) => {
    setLastScan(result);
    setIsScanning(false);
    
    // Process based on QR type
    switch (result.type) {
      case 'website':
        window.open(result.parsedData.url, '_blank');
        break;
      case 'wifi':
        console.log('Connect to WiFi:', result.parsedData);
        break;
      default:
        console.log('Scanned:', result.content);
    }
  };

  return (
    <div>
      {isScanning ? (
        <QRScanner
          onScan={handleScan}
          onError={(error) => {
            alert(`Scan error: ${error.message}`);
          }}
        />
      ) : (
        <div>
          <h3>Scan Result</h3>
          <p>Type: {lastScan?.type}</p>
          <p>Content: {lastScan?.content}</p>
          <button onClick={() => setIsScanning(true)}>
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
}
```

### Dynamic QR Generator

```tsx
import React, { useState } from 'react';
import { QRGenerator, QRType } from 'qrcode-studio';

function DynamicGenerator() {
  const [qrType, setQrType] = useState<QRType>('website');
  const [formData, setFormData] = useState<any>({
    url: 'https://example.com'
  });

  const renderForm = () => {
    switch (qrType) {
      case 'website':
        return (
          <input
            type="url"
            value={formData.url || ''}
            onChange={(e) => setFormData({ url: e.target.value })}
            placeholder="Enter URL"
          />
        );
      case 'wifi':
        return (
          <>
            <input
              type="text"
              value={formData.ssid || ''}
              onChange={(e) => setFormData({ ...formData, ssid: e.target.value })}
              placeholder="Network Name"
            />
            <input
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
            />
            <select
              value={formData.security || 'WPA2'}
              onChange={(e) => setFormData({ ...formData, security: e.target.value })}
            >
              <option value="WPA2">WPA2</option>
              <option value="WPA">WPA</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </>
        );
      case 'text':
        return (
          <textarea
            value={formData.text || ''}
            onChange={(e) => setFormData({ text: e.target.value })}
            placeholder="Enter text"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <select value={qrType} onChange={(e) => setQrType(e.target.value as QRType)}>
        <option value="website">Website</option>
        <option value="wifi">WiFi</option>
        <option value="text">Text</option>
      </select>

      {renderForm()}

      <QRGenerator
        type={qrType}
        data={formData}
        design={{
          colors: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          dotsStyle: 'rounded'
        }}
        size={300}
      />
    </div>
  );
}
```

### Plugin API Usage

```typescript
import { QRCodeStudio } from 'qrcode-studio';

async function generateBusinessCard() {
  try {
    // Generate vCard QR code
    const qrCode = await QRCodeStudio.generate({
      type: 'vcard',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Acme Corp',
        title: 'Software Engineer',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        website: 'https://johndoe.com'
      },
      design: {
        colors: {
          dark: '#1a1a1a',
          light: '#ffffff'
        },
        logo: {
          src: '/company-logo.png',
          size: 60
        }
      },
      size: 400
    });

    // Save to device
    const saved = await QRCodeStudio.saveQRCode({
      qrCode,
      fileName: 'business-card',
      format: 'png'
    });

    console.log('Saved to:', saved.uri);
  } catch (error) {
    console.error('Failed to generate business card:', error);
  }
}
```