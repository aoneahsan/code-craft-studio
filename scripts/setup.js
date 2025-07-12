#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 QRCode Studio Setup Script');
console.log('============================\n');

const projectRoot = process.cwd();
const isCapacitorProject = fs.existsSync(path.join(projectRoot, 'capacitor.config.json')) ||
                          fs.existsSync(path.join(projectRoot, 'capacitor.config.ts'));

if (!isCapacitorProject) {
  console.warn('⚠️  This doesn\'t appear to be a Capacitor project.');
  console.log('Make sure you have initialized Capacitor first with: npx cap init\n');
}

console.log('📦 Installing QRCode Studio plugin...\n');

// Check if using npm or yarn
const packageLockExists = fs.existsSync(path.join(projectRoot, 'package-lock.json'));
const yarnLockExists = fs.existsSync(path.join(projectRoot, 'yarn.lock'));
const packageManager = yarnLockExists ? 'yarn' : 'npm';

try {
  // Install the plugin
  console.log(`Using ${packageManager} to install dependencies...`);
  execSync(`${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} qrcode-studio`, { 
    stdio: 'inherit' 
  });

  // Add iOS platform if not exists
  if (!fs.existsSync(path.join(projectRoot, 'ios'))) {
    console.log('\n📱 Adding iOS platform...');
    execSync('npx cap add ios', { stdio: 'inherit' });
  }

  // Add Android platform if not exists
  if (!fs.existsSync(path.join(projectRoot, 'android'))) {
    console.log('\n🤖 Adding Android platform...');
    execSync('npx cap add android', { stdio: 'inherit' });
  }

  // Sync Capacitor
  console.log('\n🔄 Syncing Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });

  // iOS specific setup
  console.log('\n🍎 Configuring iOS permissions...');
  const iosInfoPlistPath = path.join(projectRoot, 'ios/App/App/Info.plist');
  
  if (fs.existsSync(iosInfoPlistPath)) {
    let infoPlist = fs.readFileSync(iosInfoPlistPath, 'utf8');
    
    // Add camera permission if not exists
    if (!infoPlist.includes('NSCameraUsageDescription')) {
      const permissionEntry = `\t<key>NSCameraUsageDescription</key>
\t<string>This app needs camera access to scan QR codes</string>`;
      
      // Insert before closing dict tag
      infoPlist = infoPlist.replace('</dict>\n</plist>', `${permissionEntry}\n</dict>\n</plist>`);
      fs.writeFileSync(iosInfoPlistPath, infoPlist);
      console.log('✅ Added iOS camera permission');
    }
  } else {
    console.log('⚠️  iOS Info.plist not found. Please add camera permissions manually.');
  }

  // Android specific setup
  console.log('\n🤖 Configuring Android permissions...');
  const androidManifestPath = path.join(projectRoot, 'android/app/src/main/AndroidManifest.xml');
  
  if (fs.existsSync(androidManifestPath)) {
    let manifest = fs.readFileSync(androidManifestPath, 'utf8');
    
    // Add camera permission if not exists
    if (!manifest.includes('android.permission.CAMERA')) {
      const permissionEntry = '\n    <uses-permission android:name="android.permission.CAMERA" />';
      
      // Insert after opening manifest tag
      manifest = manifest.replace('<manifest', `<manifest${permissionEntry}\n`);
      fs.writeFileSync(androidManifestPath, manifest);
      console.log('✅ Added Android camera permission');
    }
  } else {
    console.log('⚠️  Android manifest not found. Please add camera permissions manually.');
  }

  // Create example usage file
  console.log('\n📝 Creating example usage file...');
  const exampleContent = `import { QRCodeStudio, QRScanner, QRGenerator, QRStudio, QRType } from 'qrcode-studio';

// Example 1: Using the QRScanner component
export function ScannerExample() {
  return (
    <QRScanner
      onScan={(result) => {
        console.log('Scanned:', result.content);
        console.log('Type:', result.type);
      }}
      onError={(error) => {
        console.error('Scan error:', error);
      }}
    />
  );
}

// Example 2: Using the QRGenerator component
export function GeneratorExample() {
  const websiteData = {
    url: 'https://example.com',
    title: 'My Website',
  };

  return (
    <QRGenerator
      type={QRType.WEBSITE}
      data={websiteData}
      design={{
        colors: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }}
      size={300}
      onGenerate={(result) => {
        console.log('Generated QR Code:', result);
      }}
    />
  );
}

// Example 3: Using the full QRStudio component
export function StudioExample() {
  return (
    <QRStudio
      config={{
        allowedTypes: [QRType.WEBSITE, QRType.WIFI, QRType.VCARD],
        defaultType: QRType.WEBSITE,
      }}
      theme={{
        primary: '#007AFF',
        mode: 'light',
      }}
      features={{
        scanner: true,
        generator: true,
        history: true,
        analytics: true,
      }}
      onSave={(result) => {
        console.log('Saved QR Code:', result);
      }}
      onScan={(result) => {
        console.log('Scanned QR Code:', result);
      }}
    />
  );
}

// Example 4: Using the plugin API directly
async function pluginExample() {
  // Check permissions
  const permissions = await QRCodeStudio.checkPermissions();
  console.log('Camera permission:', permissions.camera);

  // Request permissions if needed
  if (permissions.camera !== 'granted') {
    await QRCodeStudio.requestPermissions();
  }

  // Generate a QR code
  const qrCode = await QRCodeStudio.generate({
    type: QRType.WEBSITE,
    data: { url: 'https://example.com' },
    size: 300,
  });

  console.log('Generated QR:', qrCode);

  // Save QR code
  const saved = await QRCodeStudio.saveQRCode({
    qrCode,
    fileName: 'my-qr-code',
    format: 'png',
  });

  console.log('Saved to:', saved.uri);
}
`;

  fs.writeFileSync(path.join(projectRoot, 'qrcode-studio-examples.tsx'), exampleContent);

  console.log('\n✅ Setup completed successfully!\n');
  console.log('📖 Next steps:');
  console.log('1. Check qrcode-studio-examples.tsx for usage examples');
  console.log('2. Import and use the components in your app');
  console.log('3. Run "npx cap open ios" or "npx cap open android" to test on devices\n');
  console.log('📚 Documentation: https://github.com/aoneahsan/qrcode-studio');
  console.log('🐛 Issues: https://github.com/aoneahsan/qrcode-studio/issues\n');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\nPlease try manual setup:');
  console.log(`1. ${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} qrcode-studio`);
  console.log('2. npx cap sync');
  console.log('3. Add camera permissions to iOS and Android manually');
  process.exit(1);
}