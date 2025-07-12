import React, { useEffect, useRef, useState, useCallback } from 'react';
import { QRCodeStudio } from '../../index';
import type { QRScannerProps, ScanResult, ScanError, PermissionState } from '../../definitions';
// import './QRScanner.css'; // CSS should be imported by the consuming app

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  options,
  className = '',
  style,
  showOverlay = true,
  overlayComponent,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>('prompt');
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scanningRef = useRef(false);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  // Handle scan results
  useEffect(() => {
    if (!isScanning) return;

    const handleScanResult = (result: ScanResult) => {
      onScan(result);
    };

    const handleScanError = (error: ScanError) => {
      setError(error.message);
      onError?.(error);
    };

    const resultListener = QRCodeStudio.addListener('scanResult', handleScanResult);
    const errorListener = QRCodeStudio.addListener('scanError', handleScanError);

    return () => {
      resultListener.then(l => l.remove());
      errorListener.then(l => l.remove());
    };
  }, [isScanning, onScan, onError]);

  const checkPermissions = async () => {
    try {
      const result = await QRCodeStudio.checkPermissions();
      setPermissionStatus(result.camera);
    } catch (err) {
      setError('Failed to check camera permissions');
    }
  };

  const requestPermissions = async () => {
    try {
      const result = await QRCodeStudio.requestPermissions();
      setPermissionStatus(result.camera);
      if (result.camera === 'granted') {
        startScanning();
      }
    } catch (err) {
      setError('Failed to request camera permissions');
    }
  };

  const startScanning = useCallback(async () => {
    if (scanningRef.current) return;
    
    try {
      scanningRef.current = true;
      setError(null);
      await QRCodeStudio.startScan(options);
      setIsScanning(true);
    } catch (err) {
      scanningRef.current = false;
      setError(err instanceof Error ? err.message : 'Failed to start scanner');
      onError?.({
        code: 'START_SCAN_ERROR',
        message: err instanceof Error ? err.message : 'Failed to start scanner',
      });
    }
  }, [options, onError]);

  const stopScanning = useCallback(async () => {
    if (!scanningRef.current) return;
    
    try {
      await QRCodeStudio.stopScan();
      setIsScanning(false);
      scanningRef.current = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop scanner');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanningRef.current) {
        QRCodeStudio.stopScan().catch(console.error);
      }
    };
  }, []);

  const renderPermissionRequest = () => (
    <div className="qr-scanner-permission">
      <div className="permission-icon">📷</div>
      <h3>Camera Permission Required</h3>
      <p>This app needs camera access to scan QR codes</p>
      <button 
        className="permission-button"
        onClick={requestPermissions}
      >
        Grant Permission
      </button>
    </div>
  );

  const renderError = () => (
    <div className="qr-scanner-error">
      <div className="error-icon">⚠️</div>
      <h3>Scanner Error</h3>
      <p>{error}</p>
      <button 
        className="retry-button"
        onClick={() => {
          setError(null);
          if (permissionStatus === 'granted') {
            startScanning();
          } else {
            requestPermissions();
          }
        }}
      >
        Retry
      </button>
    </div>
  );

  const renderScanner = () => (
    <>
      <div className="qr-scanner-video" />
      {showOverlay && (overlayComponent || (
        <div className="qr-scanner-overlay">
          <div className="scan-region">
            <div className="corner top-left" />
            <div className="corner top-right" />
            <div className="corner bottom-left" />
            <div className="corner bottom-right" />
          </div>
          <div className="scan-line" />
          <p className="scan-hint">Position QR code within the frame</p>
        </div>
      ))}
      <button 
        className="stop-scan-button"
        onClick={stopScanning}
      >
        Stop Scanning
      </button>
    </>
  );

  const renderControls = () => (
    <div className="qr-scanner-controls">
      <button 
        className="start-scan-button"
        onClick={() => {
          if (permissionStatus === 'granted') {
            startScanning();
          } else {
            requestPermissions();
          }
        }}
      >
        Start Scanner
      </button>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`qr-scanner-container ${className}`}
      style={style}
    >
      {error && renderError()}
      {!error && permissionStatus === 'denied' && renderPermissionRequest()}
      {!error && permissionStatus === 'granted' && !isScanning && renderControls()}
      {!error && isScanning && renderScanner()}
    </div>
  );
};

export default QRScanner;