import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCodeCraftStudio } from '../../hooks';
import type { QRScannerProps, PermissionState } from '../../definitions';
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
  
  const { 
    isReady, 
    scanQRCode, 
    checkPermissions: checkPlatformPermissions, 
    requestPermissions: requestPlatformPermissions
  } = useCodeCraftStudio({
    onError: (err) => {
      setError(err.message);
      onError?.({ message: err.message, code: 'PLATFORM_ERROR' });
    }
  });

  // Check permissions on mount
  useEffect(() => {
    if (isReady) {
      checkPermissions();
    }
  }, [isReady]);

  const checkPermissions = async () => {
    try {
      const result = await checkPlatformPermissions();
      setPermissionStatus(result.camera as PermissionState || 'prompt');
    } catch {
      setError('Failed to check camera permissions');
    }
  };

  const requestPermissions = async () => {
    try {
      const result = await requestPlatformPermissions();
      setPermissionStatus(result.camera as PermissionState || 'prompt');
      if (result.camera === 'granted') {
        startScanning();
      }
    } catch {
      setError('Failed to request camera permissions');
    }
  };

  const startScanning = useCallback(async () => {
    if (scanningRef.current || !isReady) return;
    
    try {
      scanningRef.current = true;
      setError(null);
      setIsScanning(true);
      
      const result = await scanQRCode(options);
      
      // Successfully scanned
      setIsScanning(false);
      scanningRef.current = false;
      onScan(result);
    } catch (err) {
      scanningRef.current = false;
      setIsScanning(false);
      setError(err instanceof Error ? err.message : 'Failed to scan');
      onError?.({
        code: 'SCAN_ERROR',
        message: err instanceof Error ? err.message : 'Failed to scan',
      });
    }
  }, [isReady, options, onError, onScan, scanQRCode]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    scanningRef.current = false;
  }, []);

  const handleContainerClick = () => {
    if (permissionStatus === 'prompt' || permissionStatus === 'denied') {
      requestPermissions();
    } else if (permissionStatus === 'granted' && !isScanning) {
      startScanning();
    }
  };

  // Render permission prompt
  if (!isReady) {
    return (
      <div className={`qr-scanner-container ${className}`} style={style} ref={containerRef}>
        <div className="qr-scanner-loading">
          <div className="spinner"></div>
          <p>Initializing scanner...</p>
        </div>
      </div>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <div className={`qr-scanner-container ${className}`} style={style} ref={containerRef}>
        <div className="qr-scanner-permission-denied">
          <svg className="icon" viewBox="0 0 24 24" width="48" height="48">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3>Camera Permission Denied</h3>
          <p>Please enable camera permissions in your browser settings to use the QR scanner.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`qr-scanner-container ${className}`} style={style} ref={containerRef}>
        <div className="qr-scanner-error">
          <svg className="icon" viewBox="0 0 24 24" width="48" height="48">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h3>Scanner Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="qr-scanner-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`qr-scanner-container ${className}`} 
      style={style} 
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {permissionStatus === 'prompt' && !isScanning && (
        <div className="qr-scanner-prompt">
          <svg className="icon" viewBox="0 0 24 24" width="48" height="48">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3>Enable Camera Access</h3>
          <p>Click to enable camera access for QR code scanning</p>
          <button className="qr-scanner-button qr-scanner-button-primary">
            Enable Camera
          </button>
        </div>
      )}

      {permissionStatus === 'granted' && !isScanning && (
        <div className="qr-scanner-ready">
          <svg className="icon" viewBox="0 0 24 24" width="48" height="48">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
          <h3>Ready to Scan</h3>
          <p>Click to start scanning QR codes</p>
          <button className="qr-scanner-button qr-scanner-button-primary">
            Start Scanning
          </button>
        </div>
      )}

      {isScanning && (
        <>
          {showOverlay && !overlayComponent && (
            <div className="qr-scanner-overlay">
              <div className="qr-scanner-frame">
                <div className="corner corner-tl"></div>
                <div className="corner corner-tr"></div>
                <div className="corner corner-bl"></div>
                <div className="corner corner-br"></div>
              </div>
              <p className="qr-scanner-hint">Align QR code within the frame</p>
              <button 
                className="qr-scanner-button qr-scanner-cancel-button"
                onClick={(e) => {
                  e.stopPropagation();
                  stopScanning();
                }}
              >
                Cancel
              </button>
            </div>
          )}
          {overlayComponent}
        </>
      )}
    </div>
  );
};