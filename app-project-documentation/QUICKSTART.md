# Code Craft Studio App - Quick Start Guide

## 🚀 Get Started in 5 Minutes

Complete QR code and barcode scanning/generation solution for Capacitor apps.

### Prerequisites

- Node.js 16+ installed
- Yarn or npm
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio (for Android development)

## Step 1: Create New Project

```bash
# Create React app
npx create-react-app qrcode-app --template typescript
cd qrcode-app

# Install dependencies
yarn add @capacitor/core @capacitor/cli code-craft-studio react-router-dom zustand
yarn add -D @capacitor/ios @capacitor/android tailwindcss

# Initialize Capacitor
npx cap init "QRCode App" com.yourcompany.qrcodeapp --web-dir build

# Run QRCode Studio setup
npx code-craft-studio-setup
```

## Step 2: Basic App Setup

### 2.1 Create App.tsx

```typescript
// src/App.tsx
import React from 'react';
import { QRStudio } from 'code-craft-studio';
import 'code-craft-studio/src/styles/code-craft-studio.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Code Craft Studio</h1>
      <QRStudio
        config={{
          allowedTypes: ['website', 'wifi', 'text', 'vcard'],
          defaultType: 'website',
        }}
        theme={{
          primary: '#007AFF',
          mode: 'light',
        }}
        features={{
          scanner: true,
          generator: true,
          history: true,
        }}
      />
    </div>
  );
}

export default App;
```

### 2.2 Add Basic Styles

```css
/* src/App.css */
.App {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}
```

## Step 3: Add Mobile Platforms

```bash
# Build the web app
yarn build

# Add platforms
npx cap add ios
npx cap add android

# Copy web assets to native projects
npx cap copy

# Sync native projects
npx cap sync
```

## Step 4: Run Your App

### Web

```bash
yarn start
# Opens http://localhost:3000
```

### iOS

```bash
npx cap open ios
# Click Run in Xcode
```

### Android

```bash
npx cap open android
# Click Run in Android Studio
```

## 🎯 Quick Examples

### Example 1: Simple QR Scanner

```typescript
import { QRScanner } from 'code-craft-studio';

function ScannerExample() {
  return (
    <QRScanner
      onScan={(result) => {
        alert(`Scanned: ${result.content}`);
      }}
    />
  );
}
```

### Example 2: QR Generator with Custom Design

```typescript
import { QRGenerator } from 'code-craft-studio';

function GeneratorExample() {
  return (
    <QRGenerator
      type="website"
      data={{ url: 'https://example.com' }}
      design={{
        colors: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        dotsStyle: 'rounded',
        logo: {
          src: '/logo.png',
          size: 50
        }
      }}
      size={300}
    />
  );
}
```

### Example 3: Barcode Scanner

```typescript
import { BarcodeScanner } from 'code-craft-studio';

function BarcodeScannerExample() {
  return (
    <BarcodeScanner
      formats={['EAN_13', 'UPC_A', 'CODE_128']}
      onScan={(result) => {
        alert(`Scanned ${result.format}: ${result.rawValue}`);
      }}
    />
  );
}
```

### Example 4: Generate Product Barcode

```typescript
import { QRCodeStudio } from 'code-craft-studio';

async function generateProductBarcode() {
  const barcode = await QRCodeStudio.generateBarcode({
    format: 'EAN_13',
    data: '5901234123457',
    width: 300,
    height: 100,
    displayText: true,
  });

  // Display the barcode
  document.getElementById('barcode').src = barcode.dataUrl;
}
```

### Example 5: Complete Page with QR & Barcode

```typescript
import React, { useState } from 'react';
import { QRScanner, QRGenerator, BarcodeScanner } from 'code-craft-studio';

function CompleteApp() {
  const [mode, setMode] = useState<'qr-scan' | 'qr-gen' | 'barcode'>('qr-scan');

  return (
    <div className="app">
      <div className="tabs">
        <button
          className={mode === 'qr-scan' ? 'active' : ''}
          onClick={() => setMode('qr-scan')}
        >
          QR Scan
        </button>
        <button
          className={mode === 'qr-gen' ? 'active' : ''}
          onClick={() => setMode('qr-gen')}
        >
          QR Generate
        </button>
        <button
          className={mode === 'barcode' ? 'active' : ''}
          onClick={() => setMode('barcode')}
        >
          Barcode Scan
        </button>
      </div>

      <div className="content">
        {mode === 'qr-scan' && (
          <QRScanner
            onScan={(result) => {
              console.log('QR Scanned:', result);
            }}
          />
        )}
        {mode === 'qr-gen' && (
          <QRGenerator
            type="text"
            data={{ text: 'Hello World!' }}
            size={250}
          />
        )}
        {mode === 'barcode' && (
          <BarcodeScanner
            formats={['EAN_13', 'UPC_A', 'CODE_128', 'QR_CODE']}
            onScan={(result) => {
              console.log('Barcode:', result);
            }}
          />
        )}
      </div>
    </div>
  );
}
```

## 📱 Platform-Specific Setup

### iOS Requirements

1. Open `ios/App/App/Info.plist`
2. Add camera permission:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan QR codes</string>
```

### Android Requirements

1. Open `android/app/src/main/AndroidManifest.xml`
2. Add camera permission:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## 🛠 Common Issues & Solutions

### Issue: Camera not working on iOS

**Solution**: Make sure you've added camera permissions and run `npx cap sync ios`

### Issue: QR Scanner shows black screen

**Solution**: Check that camera permissions are granted in device settings

### Issue: Build fails on Android

**Solution**: Ensure Android Studio is updated and Gradle sync is complete

### Issue: Styles not loading

**Solution**: Import the CSS file: `import 'code-craft-studio/src/styles/code-craft-studio.css'`

## 📚 Next Steps

### 1. Add State Management

```typescript
// store/qrStore.ts
import { create } from 'zustand';

interface QRStore {
  history: any[];
  addToHistory: (item: any) => void;
}

export const useQRStore = create<QRStore>((set) => ({
  history: [],
  addToHistory: (item) =>
    set((state) => ({
      history: [...state.history, item],
    })),
}));
```

### 2. Add Routing

```typescript
// App.tsx with routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/generate" element={<GeneratePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Add Custom Styling

```bash
# Install Tailwind CSS
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Add to tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### 4. Add Analytics

```typescript
// Track QR code events
import { QRCodeStudio } from 'code-craft-studio';

// When QR is scanned
const handleScan = async (result) => {
  // Your analytics
  analytics.track('qr_scanned', {
    type: result.type,
    content: result.content,
  });
};
```

## 🎉 Congratulations!

You now have a working QR code app! Here's what you can do next:

1. **Customize the UI** - Add your own branding and design
2. **Add more QR types** - Enable all 22+ QR code types
3. **Implement history** - Save scanned and generated QR codes
4. **Add sharing** - Share QR codes via social media
5. **Deploy your app** - Publish to App Store and Google Play

## 📖 Resources

- [Full Documentation](./README.md)
- [API Reference](../docs/API.md)
- [Feature List](./FEATURES.md)
- [Architecture Guide](./ARCHITECTURE.md)

## 💡 Tips

1. **Start Simple**: Begin with basic features and gradually add complexity
2. **Test on Devices**: Always test on real devices, not just simulators
3. **Handle Permissions**: Always explain why you need camera access
4. **Offline First**: Design for offline functionality from the start
5. **Performance**: Optimize images and lazy load components

## 🤝 Need Help?

- Check the [documentation](../README.md)
- Look at [example code](../code-craft-studio-examples.tsx)
- Create an [issue](https://github.com/aoneahsan/code-craft-studio/issues)
- Email: aoneahsan@gmail.com
