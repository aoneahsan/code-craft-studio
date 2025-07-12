import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRStudio } from '../../components/QRStudio/QRStudio';
import { QRCodeStudio } from '../../index';
import { QRType } from '../../types';

// Mock child components
vi.mock('../../components/QRScanner/QRScanner', () => ({
  QRScanner: ({ onScan }: any) => {
    // Expose onScan for testing
    (window as any).mockOnScan = onScan;
    return <div data-testid="mock-qr-scanner">QR Scanner</div>;
  },
}));

vi.mock('../../components/QRGenerator/QRGenerator', () => ({
  QRGenerator: ({ type, data }: any) => (
    <div data-testid="mock-qr-generator">
      QR Generator - Type: {type}, Data: {JSON.stringify(data)}
    </div>
  ),
}));

// Mock the QRCodeStudio plugin
vi.mock('../../index', () => ({
  QRCodeStudio: {
    generate: vi.fn(),
    getHistory: vi.fn(),
    saveQRCode: vi.fn(),
    deleteFromHistory: vi.fn(),
  },
}));

describe('QRStudio', () => {
  const mockOnSave = vi.fn();
  const mockOnScan = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    (QRCodeStudio.generate as any).mockResolvedValue({
      dataUrl: 'data:image/png;base64,mockdata',
      svg: '<svg>mock</svg>',
    });
    (QRCodeStudio.getHistory as any).mockResolvedValue({
      items: [],
    });
  });

  it('should render studio interface', () => {
    render(<QRStudio />);
    
    expect(screen.getByRole('region', { name: /qr.*studio/i })).toBeInTheDocument();
  });

  it('should show tabs when both scanner and generator are enabled', () => {
    render(
      <QRStudio 
        features={{
          scanner: true,
          generator: true,
        }}
      />
    );
    
    expect(screen.getByRole('tab', { name: /scan/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /generate/i })).toBeInTheDocument();
  });

  it('should switch between tabs', async () => {
    render(
      <QRStudio 
        features={{
          scanner: true,
          generator: true,
        }}
      />
    );
    
    // Should start on scanner tab
    expect(screen.getByTestId('mock-qr-scanner')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-qr-generator')).not.toBeInTheDocument();
    
    // Click generate tab
    const generateTab = screen.getByRole('tab', { name: /generate/i });
    await user.click(generateTab);
    
    // Should show generator
    expect(screen.queryByTestId('mock-qr-scanner')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-qr-generator')).toBeInTheDocument();
  });

  it('should show only scanner when generator is disabled', () => {
    render(
      <QRStudio 
        features={{
          scanner: true,
          generator: false,
        }}
      />
    );
    
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-qr-scanner')).toBeInTheDocument();
  });

  it('should show only generator when scanner is disabled', () => {
    render(
      <QRStudio 
        features={{
          scanner: false,
          generator: true,
        }}
      />
    );
    
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-qr-generator')).toBeInTheDocument();
  });

  it('should handle QR type selection', async () => {
    render(
      <QRStudio 
        features={{
          generator: true,
        }}
        config={{
          allowedTypes: [QRType.TEXT, QRType.WEBSITE, QRType.WIFI],
        }}
      />
    );
    
    // Should show type selector
    const typeSelector = screen.getByRole('combobox', { name: /qr.*type/i });
    expect(typeSelector).toBeInTheDocument();
    
    // Change type
    await user.selectOptions(typeSelector, QRType.WIFI);
    
    // Should update generator
    await waitFor(() => {
      expect(screen.getByTestId('mock-qr-generator')).toHaveTextContent('Type: wifi');
    });
  });

  it('should show form fields for selected type', async () => {
    render(
      <QRStudio 
        features={{
          generator: true,
        }}
        config={{
          defaultType: QRType.WEBSITE,
        }}
      />
    );
    
    // Should show website fields
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('should update form data and regenerate QR', async () => {
    render(
      <QRStudio 
        features={{
          generator: true,
        }}
        config={{
          defaultType: QRType.TEXT,
        }}
      />
    );
    
    const textInput = screen.getByLabelText(/text/i);
    await user.type(textInput, 'Hello World');
    
    // Should update generator with new data
    await waitFor(() => {
      expect(screen.getByTestId('mock-qr-generator'))
        .toHaveTextContent('Data: {"text":"Hello World"}');
    });
  });

  it('should handle scan results', async () => {
    render(
      <QRStudio 
        features={{
          scanner: true,
          generator: true,
        }}
        onScan={mockOnScan}
      />
    );
    
    // Trigger scan result
    const scanResult = {
      content: 'https://example.com',
      type: 'website',
      parsedData: { url: 'https://example.com' },
    };
    
    (window as any).mockOnScan(scanResult);
    
    expect(mockOnScan).toHaveBeenCalledWith(scanResult);
  });

  it('should show history when enabled', async () => {
    const mockHistory = [
      {
        id: '1',
        type: QRType.TEXT,
        content: 'Test QR',
        timestamp: new Date().toISOString(),
        action: 'generated',
      },
    ];
    
    (QRCodeStudio.getHistory as any).mockResolvedValue({
      items: mockHistory,
    });
    
    render(
      <QRStudio 
        features={{
          history: true,
        }}
      />
    );
    
    // Should show history tab
    const historyTab = screen.getByRole('tab', { name: /history/i });
    await user.click(historyTab);
    
    await waitFor(() => {
      expect(screen.getByText('Test QR')).toBeInTheDocument();
    });
  });

  it('should handle save action', async () => {
    (QRCodeStudio.saveQRCode as any).mockResolvedValue({
      id: '123',
      uri: 'file://saved.png',
    });
    
    render(
      <QRStudio 
        features={{
          generator: true,
        }}
        onSave={mockOnSave}
      />
    );
    
    // Fill form
    const textInput = screen.getByLabelText(/text/i);
    await user.type(textInput, 'Save me');
    
    // Click save
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(QRCodeStudio.saveQRCode).toHaveBeenCalled();
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('should apply theme', () => {
    render(
      <QRStudio 
        theme={{
          primary: '#007AFF',
          secondary: '#5856D6',
          mode: 'dark',
        }}
      />
    );
    
    const studio = screen.getByRole('region', { name: /qr.*studio/i });
    expect(studio).toHaveClass('theme-dark');
    expect(studio).toHaveStyle({
      '--primary-color': '#007AFF',
      '--secondary-color': '#5856D6',
    });
  });

  it('should apply custom className', () => {
    render(
      <QRStudio 
        className="custom-studio"
      />
    );
    
    expect(screen.getByRole('region', { name: /qr.*studio/i }))
      .toHaveClass('custom-studio');
  });

  it('should show download and share buttons', async () => {
    render(
      <QRStudio 
        features={{
          generator: true,
          export: true,
          sharing: true,
        }}
      />
    );
    
    // Fill form to enable actions
    const textInput = screen.getByLabelText(/text/i);
    await user.type(textInput, 'Test');
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  it('should handle array fields', async () => {
    render(
      <QRStudio 
        features={{
          generator: true,
        }}
        config={{
          defaultType: QRType.LINKS_LIST,
        }}
      />
    );
    
    // Should show array field editor
    expect(screen.getByText(/add.*link/i)).toBeInTheDocument();
    
    // Add a link
    const addButton = screen.getByRole('button', { name: /add.*link/i });
    await user.click(addButton);
    
    // Should show link fields
    await waitFor(() => {
      expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    render(
      <QRStudio 
        features={{
          generator: true,
        }}
        config={{
          defaultType: QRType.WEBSITE,
        }}
      />
    );
    
    // Try to save without filling required fields
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);
    
    // Should show validation error
    expect(screen.getByText(/url.*required/i)).toBeInTheDocument();
  });
});