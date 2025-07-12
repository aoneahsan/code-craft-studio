# QRCode Studio App - Project Documentation

This documentation will guide you through building a complete QR code application using the `qrcode-studio` package with React and Capacitor.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [App Architecture](#app-architecture)
4. [Implementation Guide](#implementation-guide)
5. [Features to Build](#features-to-build)
6. [Deployment](#deployment)

## 🎯 Project Overview

### Goal
Build a professional QR code application that allows users to:
- Scan QR codes using device camera
- Generate QR codes for 22+ different data types
- Customize QR code designs
- Save and manage QR code history
- Track QR code analytics
- Share QR codes across platforms

### Target Platforms
- Web (Progressive Web App)
- iOS (via Capacitor)
- Android (via Capacitor)

### Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Mobile**: Capacitor 5+
- **QR Features**: qrcode-studio package
- **State Management**: Zustand or Context API
- **Styling**: Tailwind CSS or styled-components
- **Backend** (optional): Supabase or Firebase for analytics

## 🚀 Getting Started

### 1. Create New React + Capacitor Project

```bash
# Create new React app with TypeScript
npx create-react-app qrcode-app --template typescript
cd qrcode-app

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init "QRCode App" com.yourcompany.qrcodeapp

# Install qrcode-studio package
npm install qrcode-studio

# Run the automated setup
npx qrcode-studio-setup
```

### 2. Add Platforms

```bash
# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android

# Sync native projects
npx cap sync
```

### 3. Configure App Structure

```
qrcode-app/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # App pages/screens
│   ├── services/       # Business logic
│   ├── hooks/          # Custom React hooks
│   ├── store/          # State management
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript types
│   └── styles/         # Global styles
├── public/
├── ios/               # iOS native project
├── android/           # Android native project
└── capacitor.config.ts
```

## 🏗 App Architecture

### Core Features Structure

```
Features/
├── Scanner/           # QR code scanning
├── Generator/         # QR code generation
├── History/          # Saved QR codes
├── Analytics/        # Usage analytics
├── Settings/         # App preferences
└── Sharing/          # Share functionality
```

### State Management

Use Zustand for simple state management:

```typescript
// src/store/qrStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QRStore {
  history: HistoryItem[];
  favorites: string[];
  settings: UserSettings;
  addToHistory: (item: HistoryItem) => void;
  toggleFavorite: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useQRStore = create<QRStore>()(
  persist(
    (set) => ({
      history: [],
      favorites: [],
      settings: {
        theme: 'light',
        defaultQRType: 'website',
        saveHistory: true,
      },
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 100),
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: 'qr-storage',
    }
  )
);
```

## 📱 Implementation Guide

### 1. App.tsx - Main Application

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QRCodeStudio } from 'qrcode-studio';
import 'qrcode-studio/src/styles/qrcode-studio.css';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import GeneratorPage from './pages/GeneratorPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

// Components
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/generate" element={<GeneratorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### 2. HomePage - Landing Screen

```typescript
// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRStudio } from 'qrcode-studio';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="app-header">
        <h1>QRCode Studio</h1>
        <p>Professional QR Code Scanner & Generator</p>
      </header>

      <div className="quick-actions">
        <button 
          className="action-button scan"
          onClick={() => navigate('/scan')}
        >
          <span className="icon">📷</span>
          <span>Scan QR Code</span>
        </button>
        
        <button 
          className="action-button generate"
          onClick={() => navigate('/generate')}
        >
          <span className="icon">✨</span>
          <span>Create QR Code</span>
        </button>
      </div>

      <div className="studio-wrapper">
        <QRStudio
          config={{
            allowedTypes: ['website', 'wifi', 'vcard', 'text'],
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
            analytics: false,
            sharing: true,
          }}
          onSave={(result) => {
            console.log('QR Code saved:', result);
            // Add to history
          }}
          onScan={(result) => {
            console.log('QR Code scanned:', result);
            // Handle scan result
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
```

### 3. ScannerPage - Dedicated Scanner

```typescript
// src/pages/ScannerPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScanner, ScanResult } from 'qrcode-studio';
import { useQRStore } from '../store/qrStore';

const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const addToHistory = useQRStore((state) => state.addToHistory);

  const handleScan = (result: ScanResult) => {
    setLastScan(result);
    setIsScanning(false);
    
    // Add to history
    addToHistory({
      id: `scan_${Date.now()}`,
      type: result.type || 'text',
      data: result.parsedData || { text: result.content },
      createdAt: Date.now(),
      isScanned: true,
    });

    // Handle different QR types
    switch (result.type) {
      case 'website':
        // Option to open URL
        if (window.confirm('Open this website?')) {
          window.open(result.parsedData.url, '_blank');
        }
        break;
      case 'wifi':
        // Show WiFi connection dialog
        alert(`WiFi Network: ${result.parsedData.ssid}`);
        break;
      case 'phone':
        // Option to call
        if (window.confirm(`Call ${result.parsedData.phoneNumber}?`)) {
          window.location.href = `tel:${result.parsedData.phoneNumber}`;
        }
        break;
      default:
        // Show content
        break;
    }
  };

  const handleError = (error: any) => {
    console.error('Scan error:', error);
    alert('Failed to scan QR code. Please try again.');
  };

  return (
    <div className="scanner-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Scan QR Code</h1>
      </header>

      <div className="scanner-container">
        {isScanning ? (
          <QRScanner
            onScan={handleScan}
            onError={handleError}
            options={{
              camera: 'back',
              showTorchButton: true,
              showFlipCameraButton: true,
              scanDelay: 500,
            }}
            showOverlay={true}
          />
        ) : (
          <div className="scan-result">
            <h2>Scan Result</h2>
            <div className="result-details">
              <p><strong>Type:</strong> {lastScan?.type || 'Unknown'}</p>
              <p><strong>Content:</strong></p>
              <pre>{JSON.stringify(lastScan?.parsedData || lastScan?.content, null, 2)}</pre>
            </div>
            <div className="result-actions">
              <button onClick={() => setIsScanning(true)}>
                Scan Again
              </button>
              <button onClick={() => navigate('/history')}>
                View History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;
```

### 4. GeneratorPage - Create QR Codes

```typescript
// src/pages/GeneratorPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRGenerator, QRType, QRData, QRCodeResult } from 'qrcode-studio';
import { useQRStore } from '../store/qrStore';

const GeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<QRType>('website');
  const [formData, setFormData] = useState<any>({});
  const [generatedQR, setGeneratedQR] = useState<QRCodeResult | null>(null);
  const addToHistory = useQRStore((state) => state.addToHistory);

  const qrTypes = [
    { value: 'website', label: 'Website', icon: '🌐' },
    { value: 'wifi', label: 'WiFi', icon: '📶' },
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'phone', label: 'Phone', icon: '📞' },
    { value: 'sms', label: 'SMS', icon: '💬' },
    { value: 'vcard', label: 'Contact', icon: '👤' },
    { value: 'location', label: 'Location', icon: '📍' },
  ];

  const handleGenerate = (result: QRCodeResult) => {
    setGeneratedQR(result);
    
    // Add to history
    addToHistory({
      id: result.id,
      type: selectedType,
      data: formData,
      createdAt: Date.now(),
      qrCode: result,
      isScanned: false,
    });
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'website':
        return (
          <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.url || ''}
              onChange={(e) => setFormData({ url: e.target.value })}
            />
          </div>
        );
      case 'wifi':
        return (
          <>
            <div className="form-group">
              <label>Network Name (SSID)</label>
              <input
                type="text"
                placeholder="MyNetwork"
                value={formData.ssid || ''}
                onChange={(e) => setFormData({ ...formData, ssid: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Security Type</label>
              <select
                value={formData.security || 'WPA2'}
                onChange={(e) => setFormData({ ...formData, security: e.target.value })}
              >
                <option value="WPA2">WPA2</option>
                <option value="WPA">WPA</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          </>
        );
      case 'text':
        return (
          <div className="form-group">
            <label>Text Content</label>
            <textarea
              placeholder="Enter your text here..."
              value={formData.text || ''}
              onChange={(e) => setFormData({ text: e.target.value })}
              rows={4}
            />
          </div>
        );
      default:
        return <p>Select a QR code type to continue</p>;
    }
  };

  return (
    <div className="generator-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Create QR Code</h1>
      </header>

      <div className="generator-content">
        <div className="type-selector">
          <h2>Select Type</h2>
          <div className="type-grid">
            {qrTypes.map((type) => (
              <button
                key={type.value}
                className={`type-button ${selectedType === type.value ? 'active' : ''}`}
                onClick={() => {
                  setSelectedType(type.value as QRType);
                  setFormData({});
                  setGeneratedQR(null);
                }}
              >
                <span className="type-icon">{type.icon}</span>
                <span className="type-label">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Enter Information</h2>
          {renderForm()}
        </div>

        {Object.keys(formData).length > 0 && (
          <div className="preview-section">
            <h2>Preview</h2>
            <QRGenerator
              type={selectedType}
              data={formData as QRData}
              design={{
                colors: {
                  dark: '#000000',
                  light: '#FFFFFF',
                },
                dotsStyle: 'rounded',
              }}
              size={300}
              onGenerate={handleGenerate}
              showDownload={true}
              showShare={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;
```

### 5. HistoryPage - View Saved QR Codes

```typescript
// src/pages/HistoryPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeStudio } from 'qrcode-studio';
import { useQRStore } from '../store/qrStore';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, favorites, toggleFavorite } = useQRStore();
  const [filter, setFilter] = useState<'all' | 'scanned' | 'generated' | 'favorites'>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'scanned') return item.isScanned;
    if (filter === 'generated') return !item.isScanned;
    if (filter === 'favorites') return favorites.includes(item.id);
    return true;
  });

  const downloadQR = async (item: any) => {
    if (item.qrCode) {
      await QRCodeStudio.saveQRCode({
        qrCode: item.qrCode,
        fileName: `qr_${item.type}_${Date.now()}`,
        format: 'png',
      });
    }
  };

  const shareQR = async (item: any) => {
    if (navigator.share && item.qrCode?.dataUrl) {
      try {
        const blob = await (await fetch(item.qrCode.dataUrl)).blob();
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        
        await navigator.share({
          title: `QR Code - ${item.type}`,
          files: [file],
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <div className="history-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>History</h1>
      </header>

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({history.length})
        </button>
        <button
          className={filter === 'scanned' ? 'active' : ''}
          onClick={() => setFilter('scanned')}
        >
          Scanned
        </button>
        <button
          className={filter === 'generated' ? 'active' : ''}
          onClick={() => setFilter('generated')}
        >
          Created
        </button>
        <button
          className={filter === 'favorites' ? 'active' : ''}
          onClick={() => setFilter('favorites')}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <p>No QR codes found</p>
            <button onClick={() => navigate('/generate')}>
              Create Your First QR Code
            </button>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="item-preview">
                {item.qrCode?.dataUrl && (
                  <img src={item.qrCode.dataUrl} alt="QR Code" />
                )}
              </div>
              <div className="item-details">
                <h3>{item.type.toUpperCase()}</h3>
                <p>{new Date(item.createdAt).toLocaleString()}</p>
                <p className="item-data">
                  {item.type === 'website' && item.data.url}
                  {item.type === 'wifi' && `Network: ${item.data.ssid}`}
                  {item.type === 'text' && item.data.text?.substring(0, 50)}
                </p>
              </div>
              <div className="item-actions">
                <button
                  className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(item.id)}
                >
                  {favorites.includes(item.id) ? '⭐' : '☆'}
                </button>
                {item.qrCode && (
                  <>
                    <button onClick={() => downloadQR(item)}>
                      ⬇️
                    </button>
                    <button onClick={() => shareQR(item)}>
                      🔗
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
```

### 6. Navigation Component

```typescript
// src/components/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bottom-navigation">
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">🏠</span>
        <span className="label">Home</span>
      </NavLink>
      <NavLink to="/scan" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">📷</span>
        <span className="label">Scan</span>
      </NavLink>
      <NavLink to="/generate" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">➕</span>
        <span className="label">Create</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">📋</span>
        <span className="label">History</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">⚙️</span>
        <span className="label">Settings</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
```

## 🎨 Styling

### App.css - Basic Styles

```css
/* src/App.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary-color: #007AFF;
  --secondary-color: #5856D6;
  --success-color: #34C759;
  --danger-color: #FF3B30;
  --warning-color: #FF9500;
  --background: #F2F2F7;
  --surface: #FFFFFF;
  --text: #000000;
  --text-secondary: #6C6C70;
  --border: #C6C6C8;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--background);
  color: var(--text);
}

.app {
  min-height: 100vh;
  padding-bottom: 80px; /* Space for navigation */
}

/* Page Header */
.page-header {
  background-color: var(--surface);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-button {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--primary-color);
  cursor: pointer;
}

.page-header h1 {
  flex: 1;
  font-size: 20px;
  font-weight: 600;
}

/* Bottom Navigation */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 100;
}

.bottom-navigation a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: var(--text-secondary);
  padding: 8px 16px;
  transition: color 0.2s;
}

.bottom-navigation a.active {
  color: var(--primary-color);
}

.bottom-navigation .icon {
  font-size: 24px;
}

.bottom-navigation .label {
  font-size: 11px;
}

/* Home Page */
.home-page {
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
}

.action-button {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button .icon {
  font-size: 48px;
}

/* Generator Page */
.generator-content {
  padding: 20px;
}

.type-selector {
  margin-bottom: 32px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.type-button {
  background-color: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-button.active {
  border-color: var(--primary-color);
  background-color: rgba(0, 122, 255, 0.1);
}

.type-icon {
  font-size: 32px;
}

.type-label {
  font-size: 14px;
  font-weight: 500;
}

/* Forms */
.form-section {
  background-color: var(--surface);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
}

/* History Page */
.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
}

.filter-tabs button {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  cursor: pointer;
  white-space: nowrap;
}

.filter-tabs button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.history-list {
  padding: 16px;
}

.history-item {
  background-color: var(--surface);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.item-preview img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.item-details p {
  font-size: 14px;
  color: var(--text-secondary);
}

.item-actions {
  display: flex;
  gap: 8px;
}

.item-actions button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  cursor: pointer;
  font-size: 20px;
}

.favorite-btn.active {
  color: var(--warning-color);
}

/* Responsive */
@media (max-width: 600px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .type-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🚀 Advanced Features

### 1. Analytics Integration

```typescript
// src/services/analytics.ts
import { QRCodeStudio } from 'qrcode-studio';

export class AnalyticsService {
  static async trackScan(qrCodeId: string, data: any) {
    // Send to your backend
    try {
      await fetch('/api/analytics/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeId,
          timestamp: Date.now(),
          device: navigator.userAgent,
          location: await this.getLocation(),
          data,
        }),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  static async getLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve(null)
      );
    });
  }

  static async getAnalytics(qrCodeId: string) {
    // For now, use the mock from the plugin
    return QRCodeStudio.getAnalytics({
      qrCodeId,
      metrics: ['scans', 'unique_scans', 'locations', 'devices'],
    });
  }
}
```

### 2. Offline Support

```typescript
// src/services/offline.ts
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

export class OfflineService {
  static async init() {
    // Monitor network status
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status:', status.connected);
      if (status.connected) {
        this.syncPendingData();
      }
    });
  }

  static async syncPendingData() {
    // Sync any pending analytics or QR codes
    const pendingData = localStorage.getItem('pending_sync');
    if (pendingData) {
      const items = JSON.parse(pendingData);
      // Sync each item
      for (const item of items) {
        try {
          await this.syncItem(item);
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
      localStorage.removeItem('pending_sync');
    }
  }

  static async syncItem(item: any) {
    // Implement sync logic
    console.log('Syncing:', item);
  }
}
```

### 3. Custom Themes

```typescript
// src/services/theme.ts
export class ThemeService {
  static applyTheme(theme: 'light' | 'dark' | 'custom', customColors?: any) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--background', '#000000');
      root.style.setProperty('--surface', '#1C1C1E');
      root.style.setProperty('--text', '#FFFFFF');
      root.style.setProperty('--text-secondary', '#8E8E93');
      root.style.setProperty('--border', '#38383A');
    } else if (theme === 'light') {
      root.style.setProperty('--background', '#F2F2F7');
      root.style.setProperty('--surface', '#FFFFFF');
      root.style.setProperty('--text', '#000000');
      root.style.setProperty('--text-secondary', '#6C6C70');
      root.style.setProperty('--border', '#C6C6C8');
    } else if (theme === 'custom' && customColors) {
      Object.entries(customColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value as string);
      });
    }
  }
}
```

## 📱 Deployment

### 1. Build for Production

```bash
# Build React app
npm run build

# Copy build to Capacitor
npx cap copy

# Sync with native projects
npx cap sync
```

### 2. iOS Deployment

```bash
# Open in Xcode
npx cap open ios

# In Xcode:
# 1. Select your development team
# 2. Configure bundle identifier
# 3. Build and run on device/simulator
```

### 3. Android Deployment

```bash
# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Sync project
# 2. Build APK or AAB
# 3. Run on device/emulator
```

### 4. Web Deployment (PWA)

```bash
# Build optimized version
npm run build

# Deploy to hosting service
# Options: Vercel, Netlify, Firebase Hosting

# Example with Vercel
npm i -g vercel
vercel --prod
```

## 📊 Monetization Options

1. **Freemium Model**
   - Basic QR types free
   - Premium types (menu, business) paid
   - Limited scans/generates per day

2. **Subscription Model**
   - Monthly/yearly plans
   - Unlimited QR codes
   - Analytics access
   - Custom branding

3. **Business Features**
   - White-label options
   - API access
   - Bulk operations
   - Team collaboration

## 🔒 Security Considerations

1. **Data Privacy**
   - Store sensitive data encrypted
   - Use HTTPS for all API calls
   - Implement user authentication

2. **QR Code Validation**
   - Validate all scanned content
   - Warn users about suspicious URLs
   - Implement malware detection

3. **App Security**
   - Code obfuscation for production
   - Certificate pinning for API calls
   - Secure storage for credentials

## 📈 Performance Optimization

1. **Code Splitting**
   ```typescript
   // Lazy load pages
   const GeneratorPage = React.lazy(() => import('./pages/GeneratorPage'));
   ```

2. **Image Optimization**
   - Compress QR code images
   - Use WebP format when supported
   - Implement lazy loading

3. **Caching Strategy**
   - Cache QR codes locally
   - Implement service worker
   - Use IndexedDB for large data

## 🎯 Next Steps

1. **Implement Backend**
   - User authentication
   - QR code storage
   - Analytics tracking
   - Landing page hosting

2. **Add Premium Features**
   - Batch QR generation
   - Custom domains
   - Advanced analytics
   - Team collaboration

3. **Enhance UI/UX**
   - Animations and transitions
   - Dark mode support
   - Accessibility features
   - Multiple languages

4. **Marketing**
   - App Store optimization
   - Social media presence
   - Content marketing
   - User testimonials