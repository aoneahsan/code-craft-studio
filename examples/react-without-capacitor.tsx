import React, { useState } from 'react';
import { useCodeCraftStudio } from 'code-craft-studio';
import { QRType } from 'code-craft-studio';

// Example: Using Code Craft Studio in a plain React app without Capacitor
function App() {
  const { 
    generateQRCode, 
    scanQRCode, 
    generateBarcode,
    isReady, 
    error 
  } = useCodeCraftStudio();
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [scanResult, setScanResult] = useState<string>('');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');

  const handleGenerateQR = async () => {
    try {
      const result = await generateQRCode({
        type: QRType.WEBSITE,
        url: 'https://example.com',
        title: 'Example Website'
      }, {
        width: 256,
        color: '#000000',
        backgroundColor: '#FFFFFF'
      });
      
      setQrCodeUrl(result.dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  const handleScan = async () => {
    try {
      const result = await scanQRCode();
      setScanResult(result.content);
    } catch (err) {
      console.error('Failed to scan:', err);
    }
  };

  const handleGenerateBarcode = async () => {
    try {
      const result = await generateBarcode('123456789012', 'EAN_13');
      setBarcodeUrl(result.dataUrl);
    } catch (err) {
      console.error('Failed to generate barcode:', err);
    }
  };

  if (!isReady) {
    return <div>Loading Code Craft Studio...</div>;
  }

  if (error) {
    return <div>Error initializing: {error.message}</div>;
  }

  return (
    <div className="app">
      <h1>Code Craft Studio - React Example</h1>
      
      <section>
        <h2>QR Code Generation</h2>
        <button onClick={handleGenerateQR}>Generate QR Code</button>
        {qrCodeUrl && (
          <div>
            <img src={qrCodeUrl} alt="Generated QR Code" />
          </div>
        )}
      </section>

      <section>
        <h2>QR Code Scanning</h2>
        <button onClick={handleScan}>Scan QR Code</button>
        {scanResult && (
          <div>Scanned: {scanResult}</div>
        )}
      </section>

      <section>
        <h2>Barcode Generation</h2>
        <button onClick={handleGenerateBarcode}>Generate Barcode</button>
        {barcodeUrl && (
          <div>
            <img src={barcodeUrl} alt="Generated Barcode" />
          </div>
        )}
      </section>
    </div>
  );
}

export default App;