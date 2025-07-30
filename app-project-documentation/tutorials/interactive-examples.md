# Interactive Examples for Code Craft Studio

This document provides interactive code examples that developers can run directly in their browsers to explore Code Craft Studio features.

## 🚀 CodeSandbox Examples

### 1. Basic QR Scanner
**[Open in CodeSandbox](https://codesandbox.io/s/code-craft-studio-scanner)**

```tsx
import React, { useState } from 'react';
import { QRScanner } from 'code-craft-studio/react';
import './styles.css';

export default function App() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScanSuccess = (result) => {
    setScanResult(result);
    setIsScanning(false);
  };

  const handleScanError = (error) => {
    console.error('Scan error:', error);
    alert('Failed to scan QR code');
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="app">
      <h1>QR Code Scanner Demo</h1>
      
      {isScanning ? (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          style={{ width: '100%', maxWidth: '500px' }}
        />
      ) : (
        <div className="result">
          <h2>Scan Result:</h2>
          <pre>{JSON.stringify(scanResult, null, 2)}</pre>
          <button onClick={resetScanner}>Scan Another</button>
        </div>
      )}
    </div>
  );
}
```

### 2. QR Generator with Customization
**[Open in CodeSandbox](https://codesandbox.io/s/code-craft-studio-generator)**

```tsx
import React, { useState } from 'react';
import { QRGenerator } from 'code-craft-studio/react';
import { QRType } from 'code-craft-studio';

export default function App() {
  const [qrType, setQrType] = useState(QRType.WEBSITE);
  const [qrData, setQrData] = useState({
    url: 'https://example.com',
    title: 'Example Website'
  });
  const [customization, setCustomization] = useState({
    foreground: '#000000',
    background: '#FFFFFF',
    size: 300,
    logo: null
  });

  const handleGenerate = (result) => {
    console.log('Generated QR:', result);
  };

  const handleDownload = (format) => {
    // Download logic here
    console.log(`Downloading as ${format}`);
  };

  return (
    <div className="app">
      <h1>QR Code Generator Demo</h1>
      
      <div className="controls">
        <label>
          QR Type:
          <select value={qrType} onChange={(e) => setQrType(e.target.value)}>
            <option value={QRType.TEXT}>Text</option>
            <option value={QRType.WEBSITE}>Website</option>
            <option value={QRType.WIFI}>WiFi</option>
            <option value={QRType.EMAIL}>Email</option>
            <option value={QRType.VCARD}>vCard</option>
          </select>
        </label>

        <label>
          Foreground Color:
          <input
            type="color"
            value={customization.foreground}
            onChange={(e) => setCustomization({
              ...customization,
              foreground: e.target.value
            })}
          />
        </label>

        <label>
          Background Color:
          <input
            type="color"
            value={customization.background}
            onChange={(e) => setCustomization({
              ...customization,
              background: e.target.value
            })}
          />
        </label>
      </div>

      <QRGenerator
        type={qrType}
        data={qrData}
        customization={customization}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

### 3. WiFi QR Code Generator
**[Open in CodeSandbox](https://codesandbox.io/s/code-craft-studio-wifi)**

```tsx
import React, { useState } from 'react';
import { QRGenerator } from 'code-craft-studio/react';
import { QRType } from 'code-craft-studio';

export default function WiFiQRGenerator() {
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    security: 'WPA2',
    hidden: false
  });

  const handleInputChange = (field, value) => {
    setWifiData({ ...wifiData, [field]: value });
  };

  const isValid = wifiData.ssid.length > 0;

  return (
    <div className="wifi-generator">
      <h1>WiFi QR Code Generator</h1>
      
      <form>
        <div className="form-group">
          <label>Network Name (SSID):</label>
          <input
            type="text"
            value={wifiData.ssid}
            onChange={(e) => handleInputChange('ssid', e.target.value)}
            placeholder="MyWiFiNetwork"
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={wifiData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <label>Security Type:</label>
          <select
            value={wifiData.security}
            onChange={(e) => handleInputChange('security', e.target.value)}
          >
            <option value="WPA2">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No Password</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={wifiData.hidden}
              onChange={(e) => handleInputChange('hidden', e.target.checked)}
            />
            Hidden Network
          </label>
        </div>
      </form>

      {isValid && (
        <QRGenerator
          type={QRType.WIFI}
          data={wifiData}
          customization={{
            size: 300,
            foreground: '#2196F3',
            background: '#FFFFFF'
          }}
        />
      )}

      <div className="info">
        <p>📱 Scan this QR code with a smartphone to automatically connect to the WiFi network!</p>
      </div>
    </div>
  );
}
```

### 4. vCard Contact Generator
**[Open in CodeSandbox](https://codesandbox.io/s/code-craft-studio-vcard)**

```tsx
import React, { useState } from 'react';
import { QRGenerator } from 'code-craft-studio/react';
import { QRType } from 'code-craft-studio';

export default function VCardGenerator() {
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    phone: '',
    email: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setContact({
        ...contact,
        [parent]: { ...contact[parent], [child]: value }
      });
    } else {
      setContact({ ...contact, [field]: value });
    }
  };

  return (
    <div className="vcard-generator">
      <h1>Digital Business Card Generator</h1>
      
      <div className="form-grid">
        <input
          placeholder="First Name"
          value={contact.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
        />
        
        <input
          placeholder="Last Name"
          value={contact.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
        />
        
        <input
          placeholder="Company"
          value={contact.organization}
          onChange={(e) => handleChange('organization', e.target.value)}
        />
        
        <input
          placeholder="Phone"
          value={contact.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        
        <input
          placeholder="Email"
          value={contact.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        
        <input
          placeholder="Website"
          value={contact.website}
          onChange={(e) => handleChange('website', e.target.value)}
        />
      </div>

      <QRGenerator
        type={QRType.VCARD}
        data={contact}
        customization={{
          size: 350,
          logo: '/business-logo.png',
          logoSize: 50
        }}
      />
    </div>
  );
}
```

### 5. QR Studio Full Demo
**[Open in CodeSandbox](https://codesandbox.io/s/code-craft-studio-full)**

```tsx
import React from 'react';
import { QRStudio } from 'code-craft-studio/react';

export default function App() {
  const config = {
    enabledTypes: ['text', 'website', 'wifi', 'vcard', 'email'],
    theme: {
      primary: '#2196F3',
      secondary: '#FFC107',
      background: '#FFFFFF'
    },
    features: {
      scanner: true,
      generator: true,
      history: true,
      analytics: false
    },
    customization: {
      allowColorChange: true,
      allowLogoUpload: true,
      maxLogoSize: 100
    }
  };

  const handleScan = (result) => {
    console.log('Scanned:', result);
  };

  const handleGenerate = (qrCode) => {
    console.log('Generated:', qrCode);
  };

  const handleExport = (format, data) => {
    console.log(`Exported as ${format}:`, data);
  };

  return (
    <div className="app">
      <h1>Code Craft Studio - Full Demo</h1>
      
      <QRStudio
        config={config}
        onScan={handleScan}
        onGenerate={handleGenerate}
        onExport={handleExport}
      />
    </div>
  );
}
```

## 🎮 Interactive Playground Features

### Live Code Editor
```html
<!-- Embed in documentation -->
<iframe
  src="https://codesandbox.io/embed/code-craft-studio-playground"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Code Craft Studio Playground"
  allow="camera; accelerometer; ambient-light-sensor; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
```

### Interactive Configuration Builder
```tsx
// Configuration builder component
export function ConfigBuilder() {
  const [config, setConfig] = useState({});
  const [code, setCode] = useState('');

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    setCode(generateCode(newConfig));
  };

  const generateCode = (conf) => {
    return `import { QRStudio } from 'code-craft-studio/react';

export default function App() {
  return (
    <QRStudio
      config={${JSON.stringify(conf, null, 2)}}
    />
  );
}`;
  };

  return (
    <div className="config-builder">
      <div className="controls">
        {/* Configuration controls */}
      </div>
      <div className="preview">
        <pre>{code}</pre>
      </div>
      <div className="live-demo">
        <QRStudio config={config} />
      </div>
    </div>
  );
}
```

## 📚 Example Categories

### Basic Examples
1. Simple text QR code
2. URL with tracking
3. Basic scanner
4. Export functionality

### Advanced Examples
1. Batch generation
2. Custom validators
3. Analytics integration
4. Multi-language QR codes

### Real-World Use Cases
1. Restaurant menu QR
2. Event ticketing system
3. Contact tracing app
4. Product authentication

### Integration Examples
1. React + TypeScript
2. Vue.js integration
3. Angular implementation
4. Vanilla JavaScript

## 🛠️ Example Tools

### QR Code Tester
- Scan test interface
- Format validator
- Error handler demo
- Performance metrics

### Style Playground
- Color picker
- Logo uploader
- Size adjuster
- Export preview

### Type Explorer
- All 22+ QR types
- Interactive forms
- Validation demos
- Best practices

## 📱 Mobile Examples

### iOS Simulator
```swift
// Swift example for iOS integration
import Capacitor
import CodeCraftStudio

class ViewController: UIViewController {
    @IBAction func scanQR() {
        CodeCraftStudio.scan { result in
            print("Scanned: \(result)")
        }
    }
}
```

### Android Example
```kotlin
// Kotlin example for Android
import com.codecraftstudio.CodeCraftStudio

class MainActivity : AppCompatActivity() {
    fun scanQR() {
        CodeCraftStudio.scan { result ->
            Log.d("QR", "Scanned: $result")
        }
    }
}
```

## 🔗 Resources

### Example Repository
- GitHub: [code-craft-studio-examples](https://github.com/aoneahsan/code-craft-studio-examples)
- Clone and run locally
- Contribute new examples

### Live Demos
1. [Scanner Demo](https://code-craft-studio-demo.netlify.app/scanner)
2. [Generator Demo](https://code-craft-studio-demo.netlify.app/generator)
3. [Studio Demo](https://code-craft-studio-demo.netlify.app/studio)

### API Playground
- Interactive API documentation
- Try endpoints live
- Generate code snippets
- Test with your data

---

*Note: Replace CodeSandbox URLs and demo links with actual URLs once created.*