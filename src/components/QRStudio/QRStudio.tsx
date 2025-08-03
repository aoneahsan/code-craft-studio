import React, { useState, useCallback, useRef } from 'react';
import { QRScanner } from '../QRScanner';
import { QRGenerator } from '../QRGenerator';
import { BarcodeScanner } from '../BarcodeScanner';
import { getPlatform } from '../../platforms';
import { logger } from '../../utils/logger';
import type { 
  QRStudioProps, 
  QRData,
  QRCodeResult,
  ScanResult,
  QRDesignOptions,
  HistoryItem,
  BarcodeFormat,
  BarcodeResult,
} from '../../definitions';
import { QRType } from '../../definitions';
import { qrFormFields, qrTypeInfo } from '../../utils/qr-forms';
import { ArrayFieldEditor, renderImageItem, renderLinkItem, renderMenuCategory } from '../shared/ArrayFieldEditor';
// import './QRStudio.css'; // CSS should be imported by the consuming app

export const QRStudio: React.FC<QRStudioProps> = ({
  config = {},
  theme = {},
  features = {
    scanner: true,
    generator: true,
    landingPages: true,
    analytics: true,
    export: true,
    sharing: true,
    history: true,
    favorites: true,
    templates: true,
  },
  onSave,
  onScan,
  analytics: _analytics,
  className = '',
  style,
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'generate' | 'history'>('generate');
  const [mode, setMode] = useState<'qr' | 'barcode'>('qr');
  const [selectedType, setSelectedType] = useState<QRType>(config.defaultType || QRType.WEBSITE);
  const [selectedBarcodeFormat, setSelectedBarcodeFormat] = useState<BarcodeFormat>('CODE_128' as BarcodeFormat);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [, setGeneratedQR] = useState<QRCodeResult | null>(null);
  const [generatedBarcode, setGeneratedBarcode] = useState<BarcodeResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);
  const [design, setDesign] = useState<QRDesignOptions>(config.defaultDesign || {});
  const formRef = useRef<HTMLFormElement>(null);

  // Load history on mount
  React.useEffect(() => {
    if (features.history) {
      loadHistory();
    }
  }, [features.history]);

  // Apply theme
  React.useEffect(() => {
    if (theme.variables) {
      Object.entries(theme.variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--qr-${key}`, value);
      });
    }
    if (theme.primary) {
      document.documentElement.style.setProperty('--qr-primary', theme.primary);
    }
    if (theme.secondary) {
      document.documentElement.style.setProperty('--qr-secondary', theme.secondary);
    }
    if (theme.mode) {
      document.documentElement.setAttribute('data-theme', theme.mode);
    }
  }, [theme]);

  const loadHistory = async () => {
    try {
      const platform = await getPlatform();
      const items = await platform.getHistory({ limit: 20 });
      setHistory(items);
    } catch (error) {
      logger.error('Failed to load history:', error);
    }
  };

  const handleScanResult = useCallback((result: ScanResult) => {
    onScan?.(result);
    if (features.history) {
      loadHistory();
    }
  }, [onScan, features.history]);

  const handleGenerate = useCallback((result: QRCodeResult) => {
    setGeneratedQR(result);
    onSave?.(result);
    if (features.history) {
      loadHistory();
    }
  }, [onSave, features.history]);

  const handleGenerateBarcode = useCallback(async () => {
    try {
      const platform = await getPlatform();
      const result = await platform.generateBarcode(
        formData.barcodeData || '',
        selectedBarcodeFormat,
        {
          width: 300,
          height: 100,
        }
      );
      setGeneratedBarcode({
        format: selectedBarcodeFormat,
        data: formData.barcodeData || '',
        dataUrl: result.dataUrl,
      });
    } catch (error) {
      logger.error('Failed to generate barcode:', error);
    }
  }, [selectedBarcodeFormat, formData.barcodeData]);

  const handleTypeChange = (type: QRType) => {
    setSelectedType(type);
    setFormData({});
    setGeneratedQR(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDesignChange = (field: keyof QRDesignOptions, value: any) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };

  const getQRData = (): QRData => {
    // Transform form data based on type
    // Clean up empty fields and ensure proper structure
    const cleanData = { ...formData };
    
    // Remove empty string values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '') {
        delete cleanData[key];
      }
    });
    
    // Ensure arrays are properly initialized
    if (selectedType === QRType.IMAGES && !cleanData.images) {
      cleanData.images = [];
    }
    if (selectedType === QRType.LINKS_LIST && !cleanData.links) {
      cleanData.links = [];
    }
    if (selectedType === QRType.MENU && !cleanData.categories) {
      cleanData.categories = [];
    }
    
    return cleanData as QRData;
  };

  const renderTypeSelector = () => {
    const allowedTypes = config.allowedTypes || Object.values(QRType);
    
    return (
      <div className="qr-type-grid">
        {allowedTypes.map(type => {
          const info = qrTypeInfo[type];
          return (
            <button
              key={type}
              className={`qr-type-button ${selectedType === type ? 'active' : ''}`}
              onClick={() => handleTypeChange(type)}
            >
              <span className="type-icon">{info.icon}</span>
              <span className="type-name">{type.replace(/_/g, ' ')}</span>
              <span className="type-description">{info.description}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderForm = () => {
    const fields = qrFormFields[selectedType];
    
    return (
      <form ref={formRef} className="qr-form" onSubmit={(e) => e.preventDefault()}>
        {fields.map(field => (
          <div key={field.name} className="form-field">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                maxLength={field.maxLength}
                value={formData[field.name] || ''}
                onChange={(e) => handleFormChange(field.name, e.target.value)}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(e) => handleFormChange(field.name, e.target.value)}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={formData[field.name] || false}
                onChange={(e) => handleFormChange(field.name, e.target.checked)}
              />
            ) : field.type === 'array' ? (
              <div className="array-field">
                {field.name === 'images' && (
                  <ArrayFieldEditor
                    fieldName={field.name}
                    label={field.label}
                    value={formData[field.name] || []}
                    onChange={(value) => handleFormChange(field.name, value)}
                    itemTemplate={{ url: '', caption: '' }}
                    renderItem={renderImageItem}
                  />
                )}
                {field.name === 'links' && (
                  <ArrayFieldEditor
                    fieldName={field.name}
                    label={field.label}
                    value={formData[field.name] || []}
                    onChange={(value) => handleFormChange(field.name, value)}
                    itemTemplate={{ title: '', url: '', icon: '' }}
                    renderItem={renderLinkItem}
                  />
                )}
                {field.name === 'categories' && (
                  <ArrayFieldEditor
                    fieldName={field.name}
                    label={field.label}
                    value={formData[field.name] || []}
                    onChange={(value) => handleFormChange(field.name, value)}
                    itemTemplate={{ name: '', items: [] }}
                    renderItem={renderMenuCategory}
                  />
                )}
              </div>
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                pattern={field.pattern}
                maxLength={field.maxLength}
                min={field.min}
                max={field.max}
                value={formData[field.name] || ''}
                onChange={(e) => handleFormChange(field.name, e.target.value)}
              />
            )}
            
            {field.helper && (
              <span className="field-helper">{field.helper}</span>
            )}
          </div>
        ))}
      </form>
    );
  };

  const renderCustomization = () => (
    <div className="qr-customization">
      <h3>Customize Design</h3>
      
      <div className="design-section">
        <h4>Colors</h4>
        <div className="color-inputs">
          <div className="color-field">
            <label>Foreground</label>
            <input
              type="color"
              value={design.colors?.dark || '#000000'}
              onChange={(e) => handleDesignChange('colors', { 
                ...design.colors, 
                dark: e.target.value 
              })}
            />
          </div>
          <div className="color-field">
            <label>Background</label>
            <input
              type="color"
              value={design.colors?.light || '#FFFFFF'}
              onChange={(e) => handleDesignChange('colors', { 
                ...design.colors, 
                light: e.target.value 
              })}
            />
          </div>
        </div>
      </div>

      <div className="design-section">
        <h4>Logo</h4>
        <input
          type="url"
          placeholder="Logo URL"
          value={design.logo?.src || ''}
          onChange={(e) => handleDesignChange('logo', 
            e.target.value ? { ...design.logo, src: e.target.value } : undefined
          )}
        />
      </div>

      <div className="design-section">
        <h4>Style</h4>
        <select
          value={design.dotsStyle || 'square'}
          onChange={(e) => handleDesignChange('dotsStyle', e.target.value)}
        >
          <option value="square">Square</option>
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="qr-history">
      <h3>Recent QR Codes</h3>
      {history.length === 0 ? (
        <p className="empty-state">No QR codes generated yet</p>
      ) : (
        <div className="history-list">
          {history.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-preview">
                {item.qrCode?.dataUrl && (
                  <img src={item.qrCode.dataUrl} alt="QR Code" />
                )}
              </div>
              <div className="history-info">
                <span className="history-type">{item.type}</span>
                <span className="history-date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {item.scanCount !== undefined && (
                  <span className="history-scans">
                    {item.scanCount} scans
                  </span>
                )}
              </div>
              <div className="history-actions">
                <button
                  onClick={() => {
                    setSelectedType(item.type);
                    setFormData(item.data);
                    setActiveTab('generate');
                  }}
                >
                  Use Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`qr-studio-container ${className}`} style={style}>
      <div className="qr-studio-header">
        <h1>QR Code Studio</h1>
        <div className="studio-tabs">
          {features.scanner && (
            <button
              className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
              onClick={() => setActiveTab('scan')}
            >
              Scan
            </button>
          )}
          {features.generator && (
            <button
              className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => setActiveTab('generate')}
            >
              Generate
            </button>
          )}
          {features.history && (
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          )}
        </div>
      </div>

      <div className="qr-studio-content">
        {activeTab === 'scan' && features.scanner && (
          <div className="scan-tab">
            <div className="scan-mode-selector">
              <button
                className={`mode-btn ${mode === 'qr' ? 'active' : ''}`}
                onClick={() => setMode('qr')}
              >
                QR Code
              </button>
              <button
                className={`mode-btn ${mode === 'barcode' ? 'active' : ''}`}
                onClick={() => setMode('barcode')}
              >
                Barcode
              </button>
            </div>
            {mode === 'qr' ? (
              <QRScanner onScan={handleScanResult} />
            ) : (
              <BarcodeScanner 
                onScan={handleScanResult}
                showFormatSelector={true}
                showProductInfo={true}
              />
            )}
          </div>
        )}

        {activeTab === 'generate' && features.generator && (
          <div className="generate-tab">
            <div className="generate-mode-selector">
              <button
                className={`mode-btn ${mode === 'qr' ? 'active' : ''}`}
                onClick={() => setMode('qr')}
              >
                QR Code
              </button>
              <button
                className={`mode-btn ${mode === 'barcode' ? 'active' : ''}`}
                onClick={() => setMode('barcode')}
              >
                Barcode
              </button>
            </div>

            {mode === 'qr' ? (
              <>
                <div className="generate-sidebar">
                  <h2>Select QR Code Type</h2>
                  {renderTypeSelector()}
                </div>

                <div className="generate-main">
                  <div className="form-section">
                    <h2>Enter Information</h2>
                    {renderForm()}
                    
                    <button
                      className="customize-toggle"
                      onClick={() => setShowCustomization(!showCustomization)}
                    >
                      {showCustomization ? 'Hide' : 'Show'} Customization
                    </button>
                    
                    {showCustomization && renderCustomization()}
                  </div>

                  <div className="preview-section">
                    <h2>Preview</h2>
                    {Object.keys(formData).length > 0 && (
                      <QRGenerator
                        type={selectedType}
                        data={getQRData()}
                        design={design}
                        size={300}
                        onGenerate={(result) => {
                          handleGenerate(result);
                          setGeneratedQR(result);
                        }}
                        showDownload={features.export}
                        showShare={features.sharing}
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="barcode-generate-main">
                <div className="barcode-form-section">
                  <h2>Barcode Configuration</h2>
                  <div className="barcode-format-selector">
                    <label>Barcode Format</label>
                    <select
                      value={selectedBarcodeFormat}
                      onChange={(e) => setSelectedBarcodeFormat(e.target.value as BarcodeFormat)}
                    >
                      <optgroup label="Product Codes">
                        <option value="EAN_13">EAN-13</option>
                        <option value="EAN_8">EAN-8</option>
                        <option value="UPC_A">UPC-A</option>
                        <option value="UPC_E">UPC-E</option>
                      </optgroup>
                      <optgroup label="Industrial Codes">
                        <option value="CODE_128">Code 128</option>
                        <option value="CODE_39">Code 39</option>
                        <option value="CODE_93">Code 93</option>
                        <option value="CODABAR">Codabar</option>
                        <option value="ITF">ITF</option>
                        <option value="ITF_14">ITF-14</option>
                      </optgroup>
                      <optgroup label="Specialty">
                        <option value="MSI">MSI</option>
                        <option value="PHARMACODE">Pharmacode</option>
                      </optgroup>
                    </select>
                  </div>
                  
                  <div className="barcode-data-input">
                    <label>Barcode Data</label>
                    <input
                      type="text"
                      value={formData.barcodeData || ''}
                      onChange={(e) => setFormData({ ...formData, barcodeData: e.target.value })}
                      placeholder="Enter barcode data"
                    />
                  </div>
                  
                  <button
                    className="generate-barcode-btn"
                    onClick={handleGenerateBarcode}
                    disabled={!formData.barcodeData}
                  >
                    Generate Barcode
                  </button>
                </div>

                <div className="barcode-preview-section">
                  <h2>Preview</h2>
                  {generatedBarcode && (
                    <div className="barcode-result">
                      {generatedBarcode.svg && (
                        <div 
                          className="barcode-svg"
                          dangerouslySetInnerHTML={{ __html: generatedBarcode.svg }}
                        />
                      )}
                      {generatedBarcode.dataUrl && !generatedBarcode.svg && (
                        <img src={generatedBarcode.dataUrl} alt="Generated Barcode" />
                      )}
                      <div className="barcode-info">
                        <p>Format: {generatedBarcode.format}</p>
                        <p>Data: {generatedBarcode.data}</p>
                      </div>
                      {features.export && (
                        <div className="barcode-actions">
                          <button onClick={() => {
                            const link = document.createElement('a');
                            link.download = `barcode-${generatedBarcode.format}.png`;
                            link.href = generatedBarcode.dataUrl || '';
                            link.click();
                          }}>
                            Download PNG
                          </button>
                          {generatedBarcode.svg && (
                            <button onClick={() => {
                              const blob = new Blob([generatedBarcode.svg!], { type: 'image/svg+xml' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.download = `barcode-${generatedBarcode.format}.svg`;
                              link.href = url;
                              link.click();
                              URL.revokeObjectURL(url);
                            }}>
                              Download SVG
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && features.history && renderHistory()}
      </div>
    </div>
  );
};

export default QRStudio;