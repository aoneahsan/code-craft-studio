# QRCode Studio App - Quick Start Guide

## 🚀 Get Started in 5 Minutes

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
yarn add @capacitor/core @capacitor/cli qrcode-studio react-router-dom zustand
yarn add -D @capacitor/ios @capacitor/android tailwindcss

# Initialize Capacitor
npx cap init "QRCode App" com.yourcompany.qrcodeapp --web-dir build

# Run QRCode Studio setup
npx qrcode-studio-setup
```

## Step 2: Basic App Setup

### 2.1 Create App.tsx
```typescript
// src/App.tsx
import React from 'react';
import { QRStudio } from 'qrcode-studio';
import 'qrcode-studio/src/styles/qrcode-studio.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>QRCode Studio</h1>
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
import { QRScanner } from 'qrcode-studio';

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
import { QRGenerator } from 'qrcode-studio';

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

### Example 3: Complete Page with Navigation
```typescript
import React, { useState } from 'react';
import { QRScanner, QRGenerator } from 'qrcode-studio';

function QRApp() {
  const [tab, setTab] = useState<'scan' | 'generate'>('scan');

  return (
    <div className="qr-app">
      <div className="tabs">
        <button 
          className={tab === 'scan' ? 'active' : ''}
          onClick={() => setTab('scan')}
        >
          Scan
        </button>
        <button 
          className={tab === 'generate' ? 'active' : ''}
          onClick={() => setTab('generate')}
        >
          Generate
        </button>
      </div>

      <div className="content">
        {tab === 'scan' ? (
          <QRScanner
            onScan={(result) => {
              console.log('Scanned:', result);
            }}
          />
        ) : (
          <QRGenerator
            type="text"
            data={{ text: 'Hello QR World!' }}
            size={250}
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
**Solution**: Import the CSS file: `import 'qrcode-studio/src/styles/qrcode-studio.css'`

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
  addToHistory: (item) => set((state) => ({ 
    history: [...state.history, item] 
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
import { QRCodeStudio } from 'qrcode-studio';

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
- Look at [example code](../qrcode-studio-examples.tsx)
- Create an [issue](https://github.com/aoneahsan/qrcode-studio/issues)
- Email: aoneahsan@gmail.com