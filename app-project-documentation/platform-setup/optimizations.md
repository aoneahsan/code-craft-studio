# Platform-Specific Optimizations Guide

This document outlines performance optimizations and best practices for Code Craft Studio on different platforms.

## General Optimizations

### 1. Bundle Size Optimization

```typescript
// Use dynamic imports for heavy components
const loadQRStudio = async () => {
  const { QRStudio } = await import('code-craft-studio/react');
  return QRStudio;
};

// Tree-shake unused QR types
import { QRGenerator, QRType } from 'code-craft-studio';
// Only import types you need
const types = [QRType.TEXT, QRType.WEBSITE, QRType.WIFI];
```

### 2. Memory Management

```typescript
class QRScannerComponent extends React.Component {
  scanner = null;

  componentWillUnmount() {
    // Always clean up scanner resources
    if (this.scanner) {
      CodeCraftStudio.stopScan();
      this.scanner = null;
    }
  }
}
```

## iOS Optimizations

### 1. Camera Performance

```swift
// In QRCodeScanner.swift - Optimize preview quality
private func setupCamera(in view: UIView) {
    // Use lower resolution for faster processing
    captureSession?.sessionPreset = .hd1280x720 // Instead of .high
    
    // Disable video stabilization for lower latency
    if let connection = previewLayer?.connection {
        connection.preferredVideoStabilizationMode = .off
    }
}
```

### 2. Metal Performance Shaders

```swift
// Use Metal for image processing when available
import MetalPerformanceShaders

private func enhanceQRImage(_ image: CIImage) -> CIImage? {
    guard let device = MTLCreateSystemDefaultDevice(),
          MPSSupportsMTLDevice(device) else {
        return image
    }
    
    // Apply contrast enhancement for better QR detection
    let filter = CIFilter(name: "CIColorControls")
    filter?.setValue(image, forKey: kCIInputImageKey)
    filter?.setValue(1.1, forKey: kCIInputContrastKey)
    return filter?.outputImage
}
```

### 3. Background Processing

```swift
// Configure background queue for heavy operations
private let processingQueue = DispatchQueue(
    label: "com.codecraftstudio.processing",
    qos: .userInitiated,
    attributes: .concurrent
)

// Process QR generation in background
func generateLargeQRCode(data: String, completion: @escaping (UIImage?) -> Void) {
    processingQueue.async {
        let image = self.generateQRImage(content: data, size: 1000)
        DispatchQueue.main.async {
            completion(image)
        }
    }
}
```

### 4. App Size Optimization

```ruby
# In Podfile - Use subspecs to reduce size
pod 'CodeCraftStudio', :subspecs => ['Core', 'Scanner']
# Exclude unused architectures
config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
```

## Android Optimizations

### 1. Camera Configuration

```java
// In QRCodeScanner.java - Optimize for performance
private void bindCameraUseCases() {
    // Use lower resolution for analysis
    imageAnalysis = new ImageAnalysis.Builder()
        .setTargetResolution(new Size(960, 720)) // Lower than default
        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
        .setImageQueueDepth(1) // Reduce memory usage
        .build();
    
    // Enable zero-shutter lag if available
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        Camera2Interop.Extender ext = new Camera2Interop.Extender(preview);
        ext.setCaptureRequestOption(
            CaptureRequest.CONTROL_ENABLE_ZSL, true
        );
    }
}
```

### 2. ML Kit Optimization

```java
// Configure ML Kit for optimal performance
private void initializeScanner() {
    BarcodeScannerOptions options = new BarcodeScannerOptions.Builder()
        .setBarcodeFormats(Barcode.FORMAT_QR_CODE) // Only QR codes
        .setExecutor(processingExecutor) // Custom executor
        .build();
    
    // Enable GPU acceleration if available
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        scanner = BarcodeScanning.getClient(options);
    }
}

// Use dedicated thread pool
private final ExecutorService processingExecutor = 
    new ThreadPoolExecutor(
        2, // Core pool size
        4, // Maximum pool size
        60L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>()
    );
```

### 3. Memory Management

```java
// Implement proper lifecycle management
@Override
protected void handleOnDestroy() {
    super.handleOnDestroy();
    
    // Release camera resources
    if (cameraProvider != null) {
        cameraProvider.unbindAll();
    }
    
    // Shutdown executors
    if (cameraExecutor != null) {
        cameraExecutor.shutdown();
    }
    
    // Close ML Kit scanner
    if (scanner != null) {
        scanner.close();
    }
    
    // Clear bitmap cache
    BitmapCache.getInstance().clear();
}
```

### 4. ProGuard Optimization

```proguard
# Optimize Code Craft Studio
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify

# Keep only necessary classes
-keep class com.codecraftstudio.** { *; }
-keepclassmembers class com.codecraftstudio.** { *; }

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
```

## Web Optimizations

### 1. Lazy Loading

```typescript
// Lazy load scanner when needed
const QRScannerLazy = React.lazy(() => 
  import('code-craft-studio/react').then(module => ({
    default: module.QRScanner
  }))
);

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <QRScannerLazy onScan={handleScan} />
</Suspense>
```

### 2. Web Worker for Generation

```typescript
// qr-worker.ts
self.addEventListener('message', async (event) => {
  const { type, data, options } = event.data;
  
  // Heavy QR generation in worker
  const QRCode = await import('qrcode');
  const result = await QRCode.toDataURL(data, options);
  
  self.postMessage({ result });
});

// Main thread
const generateQRInWorker = (data: string): Promise<string> => {
  return new Promise((resolve) => {
    const worker = new Worker('/qr-worker.js');
    worker.postMessage({ data });
    worker.onmessage = (e) => {
      resolve(e.data.result);
      worker.terminate();
    };
  });
};
```

### 3. Canvas Optimization

```typescript
// Use OffscreenCanvas for better performance
const generateHighResQR = async (data: string, size: number) => {
  if ('OffscreenCanvas' in window) {
    const offscreen = new OffscreenCanvas(size, size);
    const ctx = offscreen.getContext('2d');
    // Generate QR on offscreen canvas
    const blob = await offscreen.convertToBlob();
    return URL.createObjectURL(blob);
  } else {
    // Fallback to regular canvas
    return generateQRCanvas(data, size);
  }
};
```

## Performance Monitoring

### 1. iOS Performance Monitoring

```swift
// Monitor scan performance
class PerformanceMonitor {
    private var scanStartTime: CFAbsoluteTime = 0
    
    func startScanMeasurement() {
        scanStartTime = CFAbsoluteTimeGetCurrent()
    }
    
    func endScanMeasurement() {
        let elapsed = CFAbsoluteTimeGetCurrent() - scanStartTime
        print("QR Scan took \(elapsed * 1000)ms")
        
        // Report to analytics
        Analytics.track("qr_scan_performance", properties: [
            "duration_ms": elapsed * 1000,
            "platform": "ios"
        ])
    }
}
```

### 2. Android Performance Monitoring

```java
// Track performance metrics
public class PerformanceTracker {
    private long scanStartTime;
    
    public void startTracking() {
        scanStartTime = SystemClock.elapsedRealtime();
    }
    
    public void trackScanComplete() {
        long duration = SystemClock.elapsedRealtime() - scanStartTime;
        Log.d(TAG, "QR scan completed in " + duration + "ms");
        
        // Report to Firebase
        Bundle bundle = new Bundle();
        bundle.putLong("scan_duration_ms", duration);
        bundle.putString("platform", "android");
        FirebaseAnalytics.getInstance(context)
            .logEvent("qr_scan_performance", bundle);
    }
}
```

### 3. Web Performance Monitoring

```typescript
// Use Performance API
const measureQRGeneration = async (data: string) => {
  performance.mark('qr-generation-start');
  
  const qrCode = await CodeCraftStudio.generate({
    type: 'text',
    data: { text: data }
  });
  
  performance.mark('qr-generation-end');
  performance.measure(
    'qr-generation',
    'qr-generation-start',
    'qr-generation-end'
  );
  
  const measure = performance.getEntriesByName('qr-generation')[0];
  console.log(`QR generation took ${measure.duration}ms`);
  
  // Clean up
  performance.clearMarks();
  performance.clearMeasures();
  
  return qrCode;
};
```

## Battery Optimization

### 1. iOS Battery Management

```swift
// Reduce frame rate when battery is low
private func configureLowPowerMode() {
    if ProcessInfo.processInfo.isLowPowerModeEnabled {
        // Reduce camera frame rate
        if let device = currentDevice {
            try? device.lockForConfiguration()
            device.activeVideoMaxFrameDuration = CMTime(value: 1, timescale: 15) // 15 FPS
            device.unlockForConfiguration()
        }
        
        // Reduce preview quality
        captureSession?.sessionPreset = .medium
    }
}

// Monitor battery level
NotificationCenter.default.addObserver(
    self,
    selector: #selector(batteryLevelChanged),
    name: UIDevice.batteryLevelDidChangeNotification,
    object: nil
)
```

### 2. Android Battery Management

```java
// Optimize for battery life
private void configureBatteryOptimization() {
    PowerManager powerManager = (PowerManager) 
        context.getSystemService(Context.POWER_SERVICE);
    
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        if (powerManager.isPowerSaveMode()) {
            // Reduce camera preview frame rate
            Camera2Interop.Extender ext = 
                new Camera2Interop.Extender(preview);
            ext.setCaptureRequestOption(
                CaptureRequest.CONTROL_AE_TARGET_FPS_RANGE,
                new Range<>(10, 15)
            );
            
            // Reduce analysis frequency
            imageAnalysis.setAnalyzer(cameraExecutor, 
                new ThrottledAnalyzer(qrAnalyzer, 500)); // 2 FPS
        }
    }
}
```

## Network Optimization

### 1. Caching Strategy

```typescript
// Cache frequently used QR codes
class QRCache {
  private cache = new Map<string, string>();
  private maxSize = 50;
  
  async get(key: string, generator: () => Promise<string>): Promise<string> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    const value = await generator();
    this.set(key, value);
    return value;
  }
  
  private set(key: string, value: string) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### 2. Batch Processing

```typescript
// Batch QR generation requests
class QRBatchProcessor {
  private queue: Array<{data: any, resolve: Function}> = [];
  private processing = false;
  
  async add(data: any): Promise<string> {
    return new Promise((resolve) => {
      this.queue.push({ data, resolve });
      this.processQueue();
    });
  }
  
  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const batch = this.queue.splice(0, 10); // Process 10 at a time
    
    const results = await Promise.all(
      batch.map(item => CodeCraftStudio.generate(item.data))
    );
    
    batch.forEach((item, index) => {
      item.resolve(results[index]);
    });
    
    this.processing = false;
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }
}
```

## Platform-Specific Features

### iOS-Specific Features

```typescript
// Use iOS-specific features when available
if (Capacitor.getPlatform() === 'ios') {
  // Enable haptic feedback
  const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
  
  CodeCraftStudio.scan({
    onScanSuccess: async (result) => {
      await Haptics.impact({ style: ImpactStyle.Light });
      handleScanResult(result);
    }
  });
}
```

### Android-Specific Features

```typescript
// Use Android-specific features
if (Capacitor.getPlatform() === 'android') {
  // Use Android's share sheet
  const { Share } = await import('@capacitor/share');
  
  const shareQRCode = async (imageData: string) => {
    await Share.share({
      title: 'Share QR Code',
      text: 'Check out this QR code',
      url: imageData,
      dialogTitle: 'Share with friends'
    });
  };
}
```

---

*Note: Always profile your app on real devices to identify actual performance bottlenecks before applying optimizations.*