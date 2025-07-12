# Native Permission Handling Guide

This document explains how to properly configure and handle permissions for QRCode Studio on iOS and Android platforms.

## Overview

QRCode Studio requires the following permissions:
- **Camera**: For scanning QR codes
- **Photo Library**: For scanning QR codes from images

## iOS Permission Configuration

### 1. Info.plist Configuration

Add the following keys to your app's `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan QR codes</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to scan QR codes from images</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>This app needs permission to save QR codes to your photo library</string>
```

### 2. Capability Configuration

No additional capabilities are required for basic QR code functionality.

### 3. iOS Permission Flow

```swift
// The plugin automatically handles permission requests
// Camera permission is requested when calling scan()
// Photo library permission is requested when calling scanFromFile()
```

## Android Permission Configuration

### 1. AndroidManifest.xml Configuration

Add the following permissions to your app's `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Camera permission for scanning -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Storage permissions for scanning from files -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
    android:maxSdkVersion="32" />

<!-- For Android 13+ (API 33+) -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<!-- Camera features -->
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
<uses-feature android:name="android.hardware.camera.flash" android:required="false" />
```

### 2. Gradle Configuration

The plugin's build.gradle already includes necessary dependencies for camera and ML Kit.

### 3. ProGuard Rules

If using ProGuard/R8, add these rules to `android/app/proguard-rules.pro`:

```proguard
# ML Kit
-keep class com.google.mlkit.** { *; }
-keep class com.google.android.gms.** { *; }

# CameraX
-keep class androidx.camera.** { *; }

# ZXing
-keep class com.google.zxing.** { *; }
-keep class com.journeyapps.** { *; }
```

## JavaScript/TypeScript Usage

### Checking Permissions

```typescript
import { QRCodeStudio } from 'qrcode-studio';

// Check current permission status
const checkPermissions = async () => {
  const result = await QRCodeStudio.checkPermissions();
  console.log(result);
  // Result: { camera: 'granted' | 'denied' | 'prompt', photos: 'granted' | 'denied' | 'prompt' }
};
```

### Requesting Permissions

```typescript
// Request specific permissions
const requestCameraPermission = async () => {
  const result = await QRCodeStudio.requestPermissions({
    permissions: ['camera']
  });
  
  if (result.camera === 'granted') {
    // Camera permission granted, proceed with scanning
  } else {
    // Handle permission denied
  }
};

// Request multiple permissions
const requestAllPermissions = async () => {
  const result = await QRCodeStudio.requestPermissions({
    permissions: ['camera', 'photos']
  });
  
  console.log('Permissions:', result);
};
```

### Handling Permission in Scan Flow

```typescript
const startScanning = async () => {
  try {
    // The plugin automatically requests camera permission if needed
    const result = await QRCodeStudio.scan({
      formats: ['QR_CODE'],
      prompt: 'Scan a QR code'
    });
    
    console.log('Scanned:', result);
  } catch (error) {
    if (error.message.includes('permission')) {
      // Handle permission denial
      showPermissionDialog();
    }
  }
};
```

## Best Practices

### 1. Permission Timing

```typescript
// Good: Request permission when needed
const scanButton = () => {
  QRCodeStudio.scan(); // Permission requested automatically
};

// Better: Check permission status first
const scanButton = async () => {
  const { camera } = await QRCodeStudio.checkPermissions();
  
  if (camera === 'denied') {
    // Show explanation why camera is needed
    showCameraRationale();
  } else {
    QRCodeStudio.scan();
  }
};
```

### 2. Permission Rationale

```typescript
const showCameraRationale = () => {
  // Show a custom dialog explaining why camera access is needed
  const dialog = confirm(
    'Camera access is required to scan QR codes. ' +
    'Would you like to grant permission?'
  );
  
  if (dialog) {
    QRCodeStudio.requestPermissions({ permissions: ['camera'] });
  }
};
```

### 3. Settings Redirect

```typescript
import { Capacitor } from '@capacitor/core';

const openAppSettings = async () => {
  if (Capacitor.isNativePlatform()) {
    // iOS
    if (Capacitor.getPlatform() === 'ios') {
      window.open('app-settings:', '_system');
    }
    // Android
    else if (Capacitor.getPlatform() === 'android') {
      const { AndroidSettings } = await import('@capacitor/android-settings');
      AndroidSettings.openSettings();
    }
  }
};
```

## Platform-Specific Behaviors

### iOS Behaviors
- First permission request shows system dialog
- Subsequent denials require going to Settings
- iOS 14+ shows limited photo access option
- Camera permission required for both front and back cameras

### Android Behaviors
- Permissions can be requested multiple times
- Android 6+ (API 23+) requires runtime permissions
- Android 13+ (API 33+) has granular media permissions
- Some devices may have manufacturer-specific permission dialogs

## Error Handling

```typescript
const handleScan = async () => {
  try {
    const result = await QRCodeStudio.scan();
    // Handle successful scan
  } catch (error) {
    switch (error.code) {
      case 'PERMISSION_DENIED':
        console.log('User denied camera permission');
        break;
      case 'CAMERA_UNAVAILABLE':
        console.log('Camera not available on this device');
        break;
      case 'CANCELLED':
        console.log('User cancelled scanning');
        break;
      default:
        console.error('Scan error:', error);
    }
  }
};
```

## Testing Permissions

### iOS Simulator
- Camera not available in simulator
- Use device for testing camera permissions
- Photo library permissions work in simulator

### Android Emulator
- Camera available with emulated camera
- Can test all permission flows
- Use Android Studio's AVD manager

### Reset Permissions for Testing

**iOS:**
1. Delete app from device/simulator
2. Or go to Settings > General > Reset > Reset Location & Privacy

**Android:**
1. Settings > Apps > Your App > Permissions > Reset
2. Or use ADB: `adb shell pm reset-permissions`

## Troubleshooting

### Common Issues

1. **"Camera permission denied" immediately**
   - User previously denied permission
   - Need to redirect to settings

2. **"Camera not available"**
   - Running on simulator/emulator without camera
   - Camera hardware issue
   - Another app using camera

3. **Android 13+ photo permission issues**
   - Use READ_MEDIA_IMAGES instead of READ_EXTERNAL_STORAGE
   - Plugin handles this automatically

### Debug Permissions

```typescript
const debugPermissions = async () => {
  const permissions = await QRCodeStudio.checkPermissions();
  console.log('Current permissions:', permissions);
  
  // Platform info
  console.log('Platform:', Capacitor.getPlatform());
  console.log('Native:', Capacitor.isNativePlatform());
};
```

## Security Considerations

1. **Minimal Permissions**: Only request permissions you need
2. **Clear Descriptions**: Use clear usage descriptions
3. **Privacy Policy**: Document camera/photo usage in privacy policy
4. **Data Handling**: QR scan data should be handled securely
5. **User Control**: Allow users to revoke permissions

---

*Note: Always test permission flows on real devices for the most accurate behavior.*