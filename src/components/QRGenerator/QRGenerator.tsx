import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeStudio } from '../../index';
import type { 
  QRGeneratorProps, 
  QRCodeResult, 
  ExportFormat,
} from '../../definitions';
import { validateQRData, QRValidationError } from '../../core/validators/qr-validators';
// import './QRGenerator.css'; // CSS should be imported by the consuming app

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  type,
  data,
  design = {},
  size = 300,
  format = 'png',
  onGenerate,
  className = '',
  style,
  showDownload = true,
  showShare = true,
  errorCorrectionLevel = 'M',
  version,
  maskPattern,
  margin,
  scale,
  width,
  toSJISFunc,
}) => {
  const [qrCode, setQrCode] = useState<QRCodeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(format);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate QR code when props change
  useEffect(() => {
    generateQRCode();
  }, [type, data, design, size]);

  const generateQRCode = useCallback(async () => {
    try {
      // Validate data
      validateQRData(type, data);
      
      setIsGenerating(true);
      setError(null);

      const result = await QRCodeStudio.generate({
        type,
        data,
        design,
        size,
        errorCorrectionLevel,
        version,
        maskPattern,
        margin,
        scale,
        width,
        toSJISFunc,
      });

      setQrCode(result);
      onGenerate?.(result);

      // Apply custom design if needed
      if (design.logo || design.frame) {
        applyCustomDesign(result);
      }
    } catch (err) {
      if (err instanceof QRValidationError) {
        setError(`Validation Error: ${err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [type, data, design, size, onGenerate]);

  const applyCustomDesign = async (qrResult: QRCodeResult) => {
    if (!canvasRef.current || !qrResult.dataUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Draw QR code
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);

      // Apply logo if provided
      if (design.logo) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          const logoSize = design.logo!.size || size * 0.2;
          const logoMargin = design.logo!.margin || 10;
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;

          // Draw white background for logo
          ctx.fillStyle = design.colors?.light || '#FFFFFF';
          ctx.fillRect(x - logoMargin, y - logoMargin, logoSize + logoMargin * 2, logoSize + logoMargin * 2);

          // Draw logo
          if (design.logo!.borderRadius) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, logoSize, logoSize, design.logo!.borderRadius);
            ctx.clip();
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            ctx.restore();
          } else {
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          }
        };
        logoImg.src = design.logo.src;
      }
    };
    img.src = qrResult.dataUrl;
  };

  const handleDownload = async () => {
    if (!qrCode) return;

    try {
      await QRCodeStudio.saveQRCode({
        qrCode,
        fileName: `qrcode_${type}_${Date.now()}`,
        format: selectedFormat,
      });
    } catch {
      setError('Failed to download QR code');
    }
  };

  const handleShare = async () => {
    if (!qrCode || !qrCode.dataUrl) return;

    if (navigator.share) {
      try {
        const blob = await (await fetch(qrCode.dataUrl)).blob();
        const file = new File([blob], `qrcode.${selectedFormat}`, { type: `image/${selectedFormat}` });
        
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for ${type}`,
          files: [file],
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Failed to share QR code');
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(qrCode.shortUrl || qrCode.landingPageUrl || qrCode.dataUrl);
        alert('Link copied to clipboard!');
      } catch {
        setError('Sharing not supported on this device');
      }
    }
  };

  const exportFormats: ExportFormat[] = ['png', 'jpg', 'svg', 'pdf', 'json', 'webp', 'gif', 'eps', 'wmf'];

  return (
    <div 
      ref={containerRef}
      className={`qr-generator-container ${className}`}
      style={style}
    >
      {error && (
        <div className="qr-generator-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={generateQRCode}>Retry</button>
        </div>
      )}

      {isGenerating && (
        <div className="qr-generator-loading">
          <div className="loading-spinner" />
          <p>Generating QR Code...</p>
        </div>
      )}

      {!isGenerating && qrCode && !error && (
        <>
          <div className="qr-code-preview">
            {qrCode.svg ? (
              <div 
                className="qr-code-svg"
                dangerouslySetInnerHTML={{ __html: qrCode.svg }}
                style={{ width: size, height: size }}
              />
            ) : qrCode.dataUrl ? (
              <img 
                src={qrCode.dataUrl} 
                alt="QR Code"
                className="qr-code-image"
                style={{ width: size, height: size }}
              />
            ) : null}
            <canvas 
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </div>

          <div className="qr-generator-actions">
            {showDownload && (
              <div className="download-section">
                <select 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                  className="format-select"
                >
                  {exportFormats.map(fmt => (
                    <option key={fmt} value={fmt}>
                      {fmt.toUpperCase()}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleDownload}
                  className="download-button"
                >
                  <span className="button-icon">⬇️</span>
                  Download
                </button>
              </div>
            )}

            {showShare && (
              <button 
                onClick={handleShare}
                className="share-button"
              >
                <span className="button-icon">🔗</span>
                Share
              </button>
            )}
          </div>

          {qrCode.shortUrl && (
            <div className="qr-code-url">
              <label>Short URL:</label>
              <input 
                type="text" 
                value={qrCode.shortUrl} 
                readOnly 
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
          )}

          {qrCode.landingPageUrl && (
            <div className="qr-code-url">
              <label>Landing Page:</label>
              <input 
                type="text" 
                value={qrCode.landingPageUrl} 
                readOnly 
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRGenerator;