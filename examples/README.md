# Code Craft Studio Examples

This folder contains example implementations showing how to use Code Craft Studio in different scenarios.

## Available Examples

### 1. React Without Capacitor (`react-without-capacitor.tsx`)

Shows how to use Code Craft Studio in a plain React application without Capacitor.

**Key Features:**
- Provider-less hook usage with `useCodeCraftStudio`
- QR code generation
- QR code scanning (using web camera)
- Barcode generation
- No Capacitor dependencies required

**Usage:**
```tsx
import { useCodeCraftStudio } from 'code-craft-studio';

const { generateQRCode, scanQRCode, isReady } = useCodeCraftStudio();
```

### 2. React With Capacitor (`react-with-capacitor.tsx`)

Demonstrates using Code Craft Studio in a Capacitor application with native features.

**Key Features:**
- Same API as web version
- Native camera permissions handling
- Platform detection
- Access to native scanning capabilities
- Torch and camera switching support

**Additional Features in Capacitor:**
- Native performance
- Better scanning accuracy
- Hardware acceleration
- Offline storage with Preferences API

## Running the Examples

### For React (Web) Example:

1. Create a new React app:
```bash
npx create-react-app my-qr-app
cd my-qr-app
```

2. Install Code Craft Studio:
```bash
npm install code-craft-studio
```

3. Copy the example code into your App.tsx

4. Import the styles in your index.css:
```css
@import 'code-craft-studio/src/styles/qrcode-studio.css';
```

5. Run the app:
```bash
npm start
```

### For Capacitor Example:

1. Create a new Capacitor app:
```bash
npm init @capacitor/app my-qr-app
cd my-qr-app
```

2. Install and setup Code Craft Studio:
```bash
npm install code-craft-studio
npx code-craft-studio-setup
```

3. Copy the example code into your App.tsx

4. Build and run:
```bash
npm run build
npx cap sync
npx cap run ios # or android
```

## Key Differences

| Feature | React Only | With Capacitor |
|---------|------------|----------------|
| Installation | Simple npm install | Requires setup script |
| Camera Access | Web APIs | Native camera |
| Performance | Good | Excellent |
| Offline Storage | localStorage | Preferences API |
| Permissions | Browser prompt | Native permissions |
| File Save | Download only | Native file system |

## Common Patterns

### Error Handling
```tsx
try {
  const result = await scanQRCode();
  // Handle result
} catch (error) {
  console.error('Scan failed:', error);
}
```

### Check Platform Capabilities
```tsx
const { platform } = useCodeCraftStudio();

if (platform?.capabilities.hasNativeScanning) {
  // Use native features
}
```

### Custom Styling
```tsx
<div className="qr-scanner-container">
  {/* Your scanning UI */}
</div>
```

## Need Help?

- Check the [API Documentation](../docs/API.md)
- See the [Migration Guide](../MIGRATION.md) for upgrading
- Report issues on [GitHub](https://github.com/aoneahsan/code-craft-studio/issues)