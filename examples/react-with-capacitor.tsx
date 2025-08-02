import React, { useEffect, useState } from 'react';
import { useCodeCraftStudio } from 'code-craft-studio';
import { QRType } from 'code-craft-studio';

// Example: Using Code Craft Studio in a Capacitor app
// The same API works, but with native features when available
function App() {
  const { 
    generateQRCode, 
    scanQRCode, 
    generateBarcode,
    checkPermissions,
    requestPermissions,
    platform,
    isReady, 
    error 
  } = useCodeCraftStudio();
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [scanResult, setScanResult] = useState<string>('');
  const [permissions, setPermissions] = useState<any>(null);

  useEffect(() => {
    // Check permissions on mount
    checkCameraPermissions();
  }, []);

  const checkCameraPermissions = async () => {
    const perms = await checkPermissions();
    setPermissions(perms);
  };

  const handleRequestPermissions = async () => {
    const perms = await requestPermissions();
    setPermissions(perms);
  };

  const handleScan = async () => {
    try {
      // Will use native camera on mobile, web camera on web
      const result = await scanQRCode({
        showTorchButton: true,
        showFlipCameraButton: true
      });
      setScanResult(result.content);
    } catch (err) {
      console.error('Failed to scan:', err);
    }
  };

  if (!isReady) {
    return <div>Loading Code Craft Studio...</div>;
  }

  return (
    <div className="app">
      <h1>Code Craft Studio - Capacitor Example</h1>
      <p>Platform: {platform?.name}</p>
      <p>Has Native Scanning: {platform?.capabilities.hasNativeScanning ? 'Yes' : 'No'}</p>
      
      {permissions?.camera !== 'granted' && (
        <section>
          <h2>Camera Permissions</h2>
          <p>Camera permission: {permissions?.camera || 'unknown'}</p>
          <button onClick={handleRequestPermissions}>Request Camera Permission</button>
        </section>
      )}

      <section>
        <h2>QR Code Scanning (Native)</h2>
        <button onClick={handleScan}>Scan with Native Camera</button>
        {scanResult && (
          <div>Scanned: {scanResult}</div>
        )}
      </section>

      {/* All other features work the same as the web example */}
    </div>
  );
}

export default App;