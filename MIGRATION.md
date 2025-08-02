# Migration Guide

## Migrating to v1.1.0

Version 1.1.0 introduces a provider-less architecture that makes the package work without requiring Capacitor. This guide will help you migrate from v1.0.x to v1.1.0.

### Key Changes

1. **No Capacitor Required**: The package now works in plain React apps without Capacitor
2. **Provider-less Architecture**: No need to wrap your app in providers
3. **Dynamic Platform Detection**: Automatically uses the best available implementation
4. **Unified API**: Same API works across all platforms

### Breaking Changes

None! The existing API remains compatible. The new features are additive.

### New Features

#### 1. Provider-less Hook

The new `useCodeCraftStudio` hook works anywhere in your app without providers:

```tsx
import { useCodeCraftStudio } from 'code-craft-studio';

function MyComponent() {
  const { 
    scanQRCode, 
    generateQRCode, 
    generateBarcode,
    platform,
    isReady,
    error 
  } = useCodeCraftStudio();
  
  // Use the methods directly
}
```

#### 2. Platform Information

Access platform capabilities and information:

```tsx
const { platform } = useCodeCraftStudio();

console.log(platform?.name); // 'web' or 'capacitor'
console.log(platform?.capabilities.hasNativeScanning); // true/false
```

#### 3. Optional Capacitor

Capacitor is now optional. Install it only if you need native features:

```json
{
  "dependencies": {
    "code-craft-studio": "^1.1.0"
  },
  "optionalDependencies": {
    "@capacitor/core": "^7.0.0"
  }
}
```

### Migration Steps

#### Option 1: Keep Using Existing Components (No Changes Needed)

Your existing code will continue to work:

```tsx
// This still works fine
import { QRScanner, QRGenerator } from 'code-craft-studio';

<QRScanner onScan={handleScan} />
<QRGenerator type="website" data={{ url: 'https://example.com' }} />
```

#### Option 2: Migrate to Hook-Based API (Recommended)

For better control and flexibility, migrate to the hook API:

**Before:**
```tsx
import { QRScanner } from 'code-craft-studio';

function MyComponent() {
  return (
    <QRScanner 
      onScan={(result) => console.log(result.content)}
      options={{ showTorchButton: true }}
    />
  );
}
```

**After:**
```tsx
import { useCodeCraftStudio } from 'code-craft-studio';

function MyComponent() {
  const { scanQRCode, isReady } = useCodeCraftStudio();
  
  const handleScan = async () => {
    const result = await scanQRCode({ showTorchButton: true });
    console.log(result.content);
  };
  
  if (!isReady) return <div>Loading...</div>;
  
  return <button onClick={handleScan}>Scan</button>;
}
```

### Platform-Specific Considerations

#### Web-Only Apps

No special configuration needed. Just install and use:

```bash
npm install code-craft-studio
```

#### Capacitor Apps

Continue using the setup script for native features:

```bash
npm install code-craft-studio
npx code-craft-studio-setup
```

### Troubleshooting

#### Q: I'm getting "Capacitor not found" errors
**A:** This is expected if you don't have Capacitor installed. The package will automatically fall back to web implementations.

#### Q: How do I check if native features are available?
**A:** Use the platform information from the hook:

```tsx
const { platform } = useCodeCraftStudio();

if (platform?.capabilities.hasNativeScanning) {
  // Native scanning is available
}
```

#### Q: Can I still use the direct plugin API?
**A:** Yes, the plugin API still works:

```tsx
import { QRCodeStudio } from 'code-craft-studio';

// This still works
await QRCodeStudio.generate({ type: 'website', data: { url: '...' } });
```

### Need Help?

- Check the [examples](./examples/) folder for complete examples
- Review the [API documentation](./docs/API.md)
- Open an [issue](https://github.com/aoneahsan/code-craft-studio/issues) if you encounter problems