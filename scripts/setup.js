#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Code Craft Studio Setup\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  log(`✓ Created ${filePath}`, 'green');
}

function setupProject() {
  const projectRoot = process.cwd();
  
  log('Setting up Code Craft Studio in your project...', 'bright');
  
  // 1. Create directory structure
  log('\n📁 Creating directory structure...', 'blue');
  const directories = [
    'src/components/common',
    'src/components/qr',
    'src/components/layouts',
    'src/pages',
    'src/services/api',
    'src/services/auth',
    'src/services/qr',
    'src/services/analytics',
    'src/services/storage',
    'src/hooks',
    'src/store',
    'src/utils',
    'src/types',
    'src/styles/themes',
    'src/styles/components',
    'src/assets/images',
    'src/assets/icons',
    'src/assets/fonts',
    'public/images'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(projectRoot, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  
  // 2. Create example components
  log('\n🎨 Creating example components...', 'blue');
  
  // HomePage.tsx
  createFile(path.join(projectRoot, 'src/pages/HomePage.tsx'), `import React from 'react';
import { Link } from 'react-router-dom';
import { QRStudio } from 'code-craft-studio';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header className="app-header">
        <h1>Code Craft Studio</h1>
        <p>Scan, Generate, and Manage QR Codes</p>
      </header>
      
      <nav className="quick-actions">
        <Link to="/scan" className="action-button">
          <span className="icon">📷</span>
          <span>Scan QR Code</span>
        </Link>
        <Link to="/generate" className="action-button">
          <span className="icon">✨</span>
          <span>Generate QR Code</span>
        </Link>
        <Link to="/history" className="action-button">
          <span className="icon">📚</span>
          <span>History</span>
        </Link>
        <Link to="/settings" className="action-button">
          <span className="icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>
      
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <QRStudio
          config={{
            allowedTypes: ['website', 'wifi', 'text', 'vcard'],
            defaultType: 'website',
          }}
          features={{
            scanner: true,
            generator: true,
            history: true,
          }}
        />
      </section>
    </div>
  );
};
`);

  // ScannerPage.tsx
  createFile(path.join(projectRoot, 'src/pages/ScannerPage.tsx'), `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScanner } from 'code-craft-studio';

export const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<any>(null);
  
  const handleScan = (result: any) => {
    setScanResult(result);
    // Save to history
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    history.unshift({
      ...result,
      timestamp: new Date().toISOString(),
      action: 'scanned'
    });
    localStorage.setItem('qr-history', JSON.stringify(history.slice(0, 100)));
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
        <QRScanner
          onScan={handleScan}
          onError={(error) => console.error('Scan error:', error)}
        />
      </div>
      
      {scanResult && (
        <div className="scan-result">
          <h2>Scan Result</h2>
          <p>Type: {scanResult.type}</p>
          <p>Content: {scanResult.content}</p>
          <button 
            onClick={() => setScanResult(null)}
            className="action-button"
          >
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
};
`);

  // Store setup
  createFile(path.join(projectRoot, 'src/store/qrStore.ts'), `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QRHistoryItem {
  id: string;
  type: string;
  content: string;
  data: any;
  timestamp: string;
  action: 'scanned' | 'generated';
  isFavorite?: boolean;
}

interface QRStore {
  history: QRHistoryItem[];
  favorites: string[];
  addToHistory: (item: Omit<QRHistoryItem, 'id' | 'timestamp'>) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

export const useQRStore = create<QRStore>()(
  persist(
    (set) => ({
      history: [],
      favorites: [],
      
      addToHistory: (item) => set((state) => ({
        history: [
          {
            ...item,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          },
          ...state.history,
        ].slice(0, 100), // Keep last 100 items
      })),
      
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(fId => fId !== id)
          : [...state.favorites, id],
        history: state.history.map(item =>
          item.id === id
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        ),
      })),
      
      clearHistory: () => set({ history: [], favorites: [] }),
      
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter(item => item.id !== id),
        favorites: state.favorites.filter(fId => fId !== id),
      })),
    }),
    {
      name: 'qr-storage',
    }
  )
);
`);

  // App.tsx with routing
  createFile(path.join(projectRoot, 'src/App.tsx'), `import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'code-craft-studio/src/styles/code-craft-studio.css';
import './styles/app.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ScannerPage = lazy(() => import('./pages/ScannerPage').then(m => ({ default: m.ScannerPage })));
const GeneratorPage = lazy(() => import('./pages/GeneratorPage').then(m => ({ default: m.GeneratorPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const Loading = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScannerPage />} />
            <Route path="/generate" element={<GeneratorPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
`);

  // Basic styles
  createFile(path.join(projectRoot, 'src/styles/app.css'), `:root {
  --primary-color: #007AFF;
  --secondary-color: #5856D6;
  --success-color: #34C759;
  --warning-color: #FF9500;
  --danger-color: #FF3B30;
  --background: #F2F2F7;
  --surface: #FFFFFF;
  --text-primary: #000000;
  --text-secondary: #6C6C70;
  --border-color: #C6C6C8;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;
    --surface: #1C1C1E;
    --text-primary: #FFFFFF;
    --text-secondary: #8E8E93;
    --border-color: #38383A;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  line-height: 1.5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Header */
.app-header {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border-color);
}

.app-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.app-header p {
  color: var(--text-secondary);
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border-color);
}

.back-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 2rem 1rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button .icon {
  font-size: 2rem;
}

/* Scanner */
.scanner-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #000;
}

.scan-result {
  padding: 2rem 1rem;
  background: var(--surface);
  border-top: 1px solid var(--border-color);
}

.scan-result h2 {
  margin-bottom: 1rem;
}

.scan-result p {
  margin-bottom: 0.5rem;
  word-break: break-all;
}

/* Responsive */
@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}
`);

  // Package.json additions
  log('\n📦 Updating package.json...', 'blue');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add scripts if not present
    if (!packageJson.scripts) packageJson.scripts = {};
    Object.assign(packageJson.scripts, {
      'ios': 'yarn build && npx cap copy && npx cap open ios',
      'android': 'yarn build && npx cap copy && npx cap open android',
      'sync': 'npx cap sync',
      'serve': 'yarn start'
    });
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    log('✓ Updated package.json', 'green');
  }

  // Create example env file
  createFile(path.join(projectRoot, '.env.example'), `# API Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_KEY=your-api-key

# Analytics
REACT_APP_ANALYTICS_KEY=your-analytics-key

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CLOUD_SYNC=false
`);

  // Create capacitor.config.ts if not exists
  if (!fs.existsSync(path.join(projectRoot, 'capacitor.config.ts'))) {
    createFile(path.join(projectRoot, 'capacitor.config.ts'), `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.qrcodeapp',
  appName: 'Code Craft Studio',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    Camera: {
      presentationStyle: 'fullscreen',
    },
    Preferences: {
      group: 'code-craft-studio',
    },
  },
};

export default config;
`);
  }

  // Create placeholder pages
  const pages = ['GeneratorPage', 'HistoryPage', 'SettingsPage'];
  pages.forEach(page => {
    const pagePath = path.join(projectRoot, `src/pages/${page}.tsx`);
    if (!fs.existsSync(pagePath)) {
      createFile(pagePath, `import React from 'react';

export const ${page}: React.FC = () => {
  return (
    <div className="${page.toLowerCase().replace('page', '-page')}">
      <h1>${page.replace('Page', '')}</h1>
      <p>This page is under construction.</p>
    </div>
  );
};
`);
    }
  });

  log('\n✅ Setup complete!', 'green');
  log('\nNext steps:', 'bright');
  log('1. Install dependencies: yarn install', 'yellow');
  log('2. Add iOS platform: npx cap add ios', 'yellow');
  log('3. Add Android platform: npx cap add android', 'yellow');
  log('4. Run the app: yarn start', 'yellow');
  log('\nFor more information, check the documentation in app-project-documentation/', 'blue');
}

// Run setup
try {
  setupProject();
} catch (error) {
  log(`\n❌ Error during setup: ${error.message}`, 'red');
  process.exit(1);
}