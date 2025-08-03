import React, { useEffect, useRef, useState } from 'react';
import { getPlatform } from '../platforms';
import type { ScanResult, ScanError, BarcodeFormat } from '../definitions';
import type { PlatformAdapter } from '../platforms';

export interface BarcodeScannerProps {
  /**
   * Callback when barcode is scanned
   */
  onScan: (result: ScanResult) => void;
  
  /**
   * Callback on error
   */
  onError?: (error: ScanError) => void;
  
  /**
   * Barcode formats to scan
   */
  formats?: BarcodeFormat[];
  
  /**
   * Show torch/flashlight button
   */
  showTorchButton?: boolean;
  
  /**
   * Show format selector
   */
  showFormatSelector?: boolean;
  
  /**
   * Enable multiple barcode scanning
   */
  multiple?: boolean;
  
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * Show scanning overlay
   */
  showOverlay?: boolean;
  
  /**
   * Custom overlay component
   */
  overlayComponent?: React.ReactNode;
  
  /**
   * Show product info for scanned barcodes
   */
  showProductInfo?: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  formats,
  showTorchButton = true,
  showFormatSelector = false,
  multiple = false,
  className = '',
  style = {},
  showOverlay = true,
  overlayComponent,
  showProductInfo = true,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchAvailable] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<BarcodeFormat[]>(formats || []);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [, setPlatform] = useState<PlatformAdapter | null>(null);

  useEffect(() => {
    // Removed unused listeners since we're using polling approach

    const initScanner = async () => {
      const QRCodeStudio = await getPlatform();
      setPlatform(QRCodeStudio);
      try {
        // Check permissions
        const permissions = await QRCodeStudio.checkPermissions();
        if (permissions.camera !== 'granted') {
          const requestResult = await QRCodeStudio.requestPermissions();
          if (requestResult.camera !== 'granted') {
            onError?.({
              code: 'PERMISSION_DENIED',
              message: 'Camera permission denied',
            });
            return;
          }
        }

        // For web platform, we'll simulate continuous scanning
        const scanLoop = async () => {
          if (!isScanning) return;
          try {
            const result = await QRCodeStudio.scanBarcode({
              formats: selectedFormats.length > 0 ? selectedFormats : undefined,
            });
            setLastScan(result);
            onScan(result);
            if (!multiple) {
              setIsScanning(false);
            } else {
              // Continue scanning for multiple barcodes
              setTimeout(scanLoop, 1000);
            }
          } catch (error) {
            if (error instanceof Error && error.message !== 'Scan cancelled') {
              onError?.({
                code: 'SCAN_ERROR',
                message: error.message,
              });
            }
          }
        };

        setIsScanning(true);
        scanLoop();
      } catch (error) {
        onError?.({
          code: 'INIT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to initialize scanner',
        });
      }
    };

    initScanner();

    return () => {
      setIsScanning(false);
    };
  }, [selectedFormats, multiple]);

  const handleTorchToggle = async () => {
    // Torch functionality is not available in the current platform adapter
    // This would need to be implemented in the native plugin
    setTorchEnabled(!torchEnabled);
  };

  const handleFormatChange = (format: BarcodeFormat, checked: boolean) => {
    setSelectedFormats(prev => {
      if (checked) {
        return [...prev, format];
      } else {
        return prev.filter(f => f !== format);
      }
    });
  };

  const formatGroups = {
    '2D Codes': ['QR_CODE', 'DATA_MATRIX', 'AZTEC', 'PDF_417', 'MAXICODE'],
    'Product Codes': ['EAN_13', 'EAN_8', 'UPC_A', 'UPC_E'],
    'Industrial Codes': ['CODE_128', 'CODE_39', 'CODE_93', 'CODABAR', 'ITF', 'ITF_14'],
    'Specialty': ['MSI', 'MSI_PLESSEY', 'PHARMACODE', 'RSS_14', 'RSS_EXPANDED'],
  };

  return (
    <div 
      ref={scannerRef}
      className={`barcode-scanner ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {showOverlay && !overlayComponent && (
        <div className="barcode-scanner-overlay">
          {/* Scanning frame */}
          <div className="scanning-frame">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
          </div>

          {/* Control buttons */}
          <div className="scanner-controls">
            {showTorchButton && torchAvailable && (
              <button
                className={`torch-button ${torchEnabled ? 'enabled' : ''}`}
                onClick={handleTorchToggle}
                aria-label={torchEnabled ? 'Turn off flashlight' : 'Turn on flashlight'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  {torchEnabled ? (
                    <path d="M6,14L7,14.05L13,14.05L14,14L14,7L13,6.95L7,6.95L6,7L6,14M8,2L16,2L16,7L20,7L20,12L16,12L16,22L8,22L8,12L4,12L4,7L8,7L8,2M10,4L10,10L14,10L14,4L10,4Z" />
                  ) : (
                    <path d="M6,14L7,14.05L13,14.05L14,14L14,7L13,6.95L7,6.95L6,7L6,14M8,2L16,2L16,7L20,7L20,12L16,12L16,22L8,22L8,12L4,12L4,7L8,7L8,2Z" />
                  )}
                </svg>
              </button>
            )}

            {showFormatSelector && (
              <div className="format-selector">
                <button className="format-selector-toggle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9" />
                  </svg>
                </button>
                <div className="format-dropdown">
                  {Object.entries(formatGroups).map(([group, groupFormats]) => (
                    <div key={group} className="format-group">
                      <div className="format-group-label">{group}</div>
                      {groupFormats.map(format => (
                        <label key={format} className="format-option">
                          <input
                            type="checkbox"
                            checked={selectedFormats.includes(format as BarcodeFormat)}
                            onChange={(e) => handleFormatChange(format as BarcodeFormat, e.target.checked)}
                          />
                          <span>{format.replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scan result display */}
          {lastScan && showProductInfo && lastScan.productInfo && (
            <div className="product-info-overlay">
              <div className="product-info">
                <h3>{lastScan.productInfo.name}</h3>
                {lastScan.productInfo.brand && <p className="brand">{lastScan.productInfo.brand}</p>}
                {lastScan.productInfo.price && (
                  <p className="price">
                    {lastScan.productInfo.price.currency} {lastScan.productInfo.price.value}
                  </p>
                )}
                <p className="barcode">{lastScan.content}</p>
                <p className="format">{lastScan.format.replace(/_/g, ' ')}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="scanner-instructions">
            {multiple ? 'Scan multiple barcodes' : 'Position barcode within frame'}
          </div>
        </div>
      )}

      {overlayComponent}
    </div>
  );
};

export default BarcodeScanner;