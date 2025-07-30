# QRCode Studio API Documentation

## Table of Contents

- [Plugin API](#plugin-api)
- [React Components](#react-components)
- [Type Definitions](#type-definitions)
- [Barcode Support](#barcode-support)
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

## Utility Functions

QRCode Studio exports several utility functions to help with data validation:

### Validators

#### isValidUrl(url: string): boolean

Validates if a string is a valid HTTP/HTTPS URL.

```typescript
import { isValidUrl } from 'qrcode-studio';

console.log(isValidUrl('https://example.com')); // true
console.log(isValidUrl('not-a-url')); // false
```

#### isValidEmail(email: string): boolean

Validates if a string is a valid email address.

```typescript
import { isValidEmail } from 'qrcode-studio';

console.log(isValidEmail('user@example.com')); // true
console.log(isValidEmail('invalid-email')); // false
```

#### isValidPhoneNumber(phone: string): boolean

Validates if a string is a valid international phone number (E.164 format).

```typescript
import { isValidPhoneNumber } from 'qrcode-studio';

console.log(isValidPhoneNumber('+1234567890')); // true
console.log(isValidPhoneNumber('123456')); // false
```

#### isValidHexColor(color: string): boolean

Validates if a string is a valid hex color code.

```typescript
import { isValidHexColor } from 'qrcode-studio';

console.log(isValidHexColor('#FF5733')); // true
console.log(isValidHexColor('#F57')); // true (short form)
console.log(isValidHexColor('red')); // false
```

#### isValidQRSize(size: number): boolean

Validates if a number is a valid QR code size (50-1000 pixels).

```typescript
import { isValidQRSize } from 'qrcode-studio';

console.log(isValidQRSize(300)); // true
console.log(isValidQRSize(25)); // false (too small)
console.log(isValidQRSize(2000)); // false (too large)
```

### QR Data Validation

#### validateQRData(type: QRType, data: QRData): void

Validates QR data based on the specified type. Throws `QRValidationError` if validation fails.

```typescript
import { validateQRData, QRType, QRValidationError } from 'qrcode-studio';

try {
  validateQRData(QRType.WEBSITE, { url: 'https://example.com' });
  // Validation passed
} catch (error) {
  if (error instanceof QRValidationError) {
    console.error('Validation failed:', error.message);
    console.error('Field:', error.field);
  }
}
```

### Form Utilities

#### qrFormFields

Provides form field configurations for each QR type.

```typescript
import { qrFormFields, QRType } from 'qrcode-studio';

const websiteFields = qrFormFields[QRType.WEBSITE];
console.log(websiteFields);
// Returns array of field configurations for website QR type
```

#### qrTypeInfo

Provides metadata about each QR type.

```typescript
import { qrTypeInfo, QRType } from 'qrcode-studio';

const websiteInfo = qrTypeInfo[QRType.WEBSITE];
console.log(websiteInfo);
// Returns: { label: 'Website', icon: '🌐', description: 'Link to any website' }
```

## Barcode Support

QRCode Studio provides comprehensive barcode scanning and generation capabilities alongside QR codes.

### Barcode Methods

#### readBarcodesFromImage(options)

Read barcodes from an image file.

```typescript
readBarcodesFromImage(options: ReadBarcodeOptions): Promise<BarcodeScanResult>
```

**Parameters:**
- `options` - Image path and format configuration

**Returns:**
- `BarcodeScanResult` - Array of detected barcodes

**Example:**
```typescript
const result = await QRCodeStudio.readBarcodesFromImage({
  path: '/path/to/image.jpg',
  formats: ['EAN_13', 'CODE_128', 'QR_CODE']
});

result.barcodes.forEach(barcode => {
  console.log(`Format: ${barcode.format}`);
  console.log(`Data: ${barcode.rawValue}`);
});
```

#### generateBarcode(options)

Generate a barcode in various formats.

```typescript
generateBarcode(options: BarcodeGenerateOptions): Promise<BarcodeResult>
```

**Parameters:**
- `options` - Barcode generation configuration

**Returns:**
- `BarcodeResult` - Generated barcode data

**Example:**
```typescript
const barcode = await QRCodeStudio.generateBarcode({
  format: 'EAN_13',
  data: '5901234123457',
  width: 300,
  height: 100,
  displayText: true,
  outputFormat: 'png'
});

console.log('Barcode generated:', barcode.dataUrl);
```

#### getSupportedFormats()

Get list of supported barcode formats.

```typescript
getSupportedFormats(): Promise<{ formats: string[] }>
```

**Example:**
```typescript
const { formats } = await QRCodeStudio.getSupportedFormats();
console.log('Supported formats:', formats);
// ['QR_CODE', 'EAN_13', 'EAN_8', 'UPC_A', 'UPC_E', 'CODE_128', ...]
```

### Barcode Components

#### BarcodeScanner

React component for barcode scanning.

```tsx
import { BarcodeScanner } from 'qrcode-studio';

<BarcodeScanner
  formats={['EAN_13', 'CODE_128', 'QR_CODE']}
  onScan={(result) => {
    console.log(`Scanned ${result.format}: ${result.rawValue}`);
  }}
  onError={(error) => {
    console.error('Scan error:', error);
  }}
  continuous={false}
  torch={false}
/>
```

### Supported Barcode Formats

#### 1D Barcodes
- **EAN-13**: European Article Number (13 digits)
- **EAN-8**: Compact EAN (8 digits)
- **UPC-A**: Universal Product Code (12 digits)
- **UPC-E**: Compact UPC (8 digits)
- **Code 128**: High-density alphanumeric
- **Code 39**: Alphanumeric with special characters
- **Code 93**: Compact version of Code 39
- **ITF/ITF-14**: Interleaved 2 of 5
- **Codabar**: Numeric with special start/stop characters

#### 2D Barcodes
- **QR Code**: Quick Response code
- **Data Matrix**: Compact 2D barcode
- **PDF417**: Stacked linear barcode
- **Aztec**: Compact 2D barcode

### Barcode Type Definitions

```typescript
interface BarcodeScanResult {
  barcodes: Array<{
    format: string;
    rawValue: string;
    displayValue?: string;
    boundingBox?: BoundingBox;
    cornerPoints?: Point[];
  }>;
}

interface BarcodeGenerateOptions {
  format: BarcodeFormat;
  data: string;
  width?: number;
  height?: number;
  displayText?: boolean;
  outputFormat?: 'png' | 'jpg' | 'svg';
}

interface BarcodeResult {
  format: string;
  data: string;
  dataUrl: string;
  width: number;
  height: number;
}
```

### Barcode Validation

#### validateBarcodeData(format: string, data: string): boolean

Validates barcode data based on format requirements.

```typescript
import { validateBarcodeData } from 'qrcode-studio';

// Validate EAN-13 (must be 13 digits with valid checksum)
console.log(validateBarcodeData('EAN_13', '5901234123457')); // true
console.log(validateBarcodeData('EAN_13', '123')); // false

// Validate Code 128 (ASCII characters)
console.log(validateBarcodeData('CODE_128', 'ABC-123')); // true
```

#### getBarcodeConstraints(format: string)

Get validation constraints for a barcode format.

```typescript
import { getBarcodeConstraints } from 'qrcode-studio';

const constraints = getBarcodeConstraints('EAN_13');
console.log(constraints);
// {
//   fixedLength: 13,
//   pattern: '^\\d{13}$',
//   description: 'Exactly 13 digits'
// }
```

### Barcode Examples

#### Product Scanner
```tsx
import React, { useState } from 'react';
import { BarcodeScanner, validateBarcodeData } from 'qrcode-studio';

function ProductScanner() {
  const [product, setProduct] = useState(null);

  const handleScan = async (result) => {
    if (result.format === 'EAN_13' || result.format === 'UPC_A') {
      // Look up product in database
      const productInfo = await fetchProductInfo(result.rawValue);
      setProduct(productInfo);
    }
  };

  return (
    <div>
      <BarcodeScanner
        formats={['EAN_13', 'UPC_A', 'EAN_8', 'UPC_E']}
        onScan={handleScan}
        continuous={false}
      />
      {product && (
        <div>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
        </div>
      )}
    </div>
  );
}
```

#### Inventory Management
```typescript
import { QRCodeStudio } from 'qrcode-studio';

async function generateInventoryLabel(item) {
  // Generate Code 128 barcode for inventory
  const barcode = await QRCodeStudio.generateBarcode({
    format: 'CODE_128',
    data: `INV-${item.id}-${item.location}`,
    width: 300,
    height: 80,
    displayText: true
  });

  // Print or save the barcode
  await printLabel(barcode.dataUrl);
}

async function scanInventoryItem() {
  const result = await QRCodeStudio.readBarcodesFromImage({
    path: 'captured-image.jpg',
    formats: ['CODE_128', 'CODE_39']
  });

  const barcode = result.barcodes[0];
  if (barcode && barcode.rawValue.startsWith('INV-')) {
    const [, id, location] = barcode.rawValue.split('-');
    return { id, location };
  }
}
```

#### Ticket Validation
```tsx
import React from 'react';
import { QRCodeStudio } from 'qrcode-studio';

function TicketValidator() {
  const generateTicket = async (eventId, userId) => {
    // Generate PDF417 barcode for ticket
    const barcode = await QRCodeStudio.generateBarcode({
      format: 'PDF_417',
      data: JSON.stringify({
        event: eventId,
        user: userId,
        timestamp: Date.now(),
        signature: generateSignature(eventId, userId)
      }),
      width: 400,
      height: 150
    });

    return barcode;
  };

  const validateTicket = async (scannedData) => {
    try {
      const ticketData = JSON.parse(scannedData);
      const isValid = verifySignature(
        ticketData.event,
        ticketData.user,
        ticketData.signature
      );
      
      return {
        valid: isValid,
        event: ticketData.event,
        user: ticketData.user
      };
    } catch (error) {
      return { valid: false, error: 'Invalid ticket format' };
    }
  };

  return (
    <BarcodeScanner
      formats={['PDF_417', 'QR_CODE']}
      onScan={async (result) => {
        const validation = await validateTicket(result.rawValue);
        if (validation.valid) {
          console.log('✅ Valid ticket for event:', validation.event);
        } else {
          console.log('❌ Invalid ticket:', validation.error);
        }
      }}
    />
  );
}
```