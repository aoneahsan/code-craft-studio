import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRScanner } from '../../components/QRScanner/QRScanner';
import { QRCodeStudio } from '../../index';

// Mock the QRCodeStudio plugin
vi.mock('../../index', () => ({
  QRCodeStudio: {
    checkPermissions: vi.fn(),
    requestPermissions: vi.fn(),
    startScan: vi.fn(),
    stopScan: vi.fn(),
    addListener: vi.fn(),
  },
}));

// Mock QrScanner from qr-scanner
vi.mock('qr-scanner', () => ({
  default: class MockQrScanner {
    constructor() {}
    start = vi.fn().mockResolvedValue(undefined);
    stop = vi.fn();
    destroy = vi.fn();
    setCamera = vi.fn();
    static hasCamera = vi.fn().mockResolvedValue(true);
  },
}));

describe('QRScanner', () => {
  const mockOnScan = vi.fn();
  const mockOnError = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    (QRCodeStudio.checkPermissions as any).mockResolvedValue({ camera: 'granted' });
    (QRCodeStudio.requestPermissions as any).mockResolvedValue({ camera: 'granted' });
  });

  it('should render scanner interface', () => {
    render(<QRScanner onScan={mockOnScan} />);
    
    expect(screen.getByRole('region', { name: /qr.*scanner/i })).toBeInTheDocument();
  });

  it('should request camera permissions on mount', async () => {
    render(<QRScanner onScan={mockOnScan} />);
    
    await waitFor(() => {
      expect(QRCodeStudio.checkPermissions).toHaveBeenCalled();
    });
  });

  it('should show permission denied message', async () => {
    (QRCodeStudio.checkPermissions as any).mockResolvedValue({ camera: 'denied' });
    
    render(<QRScanner onScan={mockOnScan} />);
    
    await waitFor(() => {
      expect(screen.getByText(/camera permission.*denied/i)).toBeInTheDocument();
    });
  });

  it('should show torch button when enabled', () => {
    render(
      <QRScanner 
        onScan={mockOnScan} 
        options={{ showTorchButton: true }}
      />
    );
    
    expect(screen.getByRole('button', { name: /torch/i })).toBeInTheDocument();
  });

  it('should show flip camera button when enabled', () => {
    render(
      <QRScanner 
        onScan={mockOnScan} 
        options={{ showFlipCameraButton: true }}
      />
    );
    
    expect(screen.getByRole('button', { name: /flip.*camera/i })).toBeInTheDocument();
  });

  it('should handle scan results', async () => {
    const mockListener = {
      remove: vi.fn(),
    };
    
    let scanCallback: any;
    (QRCodeStudio.addListener as any).mockImplementation((event: string, callback: any) => {
      if (event === 'scanResult') {
        scanCallback = callback;
      }
      return Promise.resolve(mockListener);
    });

    render(<QRScanner onScan={mockOnScan} />);
    
    await waitFor(() => {
      expect(QRCodeStudio.startScan).toHaveBeenCalled();
    });

    // Simulate scan result
    const scanResult = {
      content: 'https://example.com',
      type: 'website',
      parsedData: { url: 'https://example.com' },
    };
    
    scanCallback(scanResult);
    
    expect(mockOnScan).toHaveBeenCalledWith(scanResult);
  });

  it('should handle scan errors', async () => {
    (QRCodeStudio.startScan as any).mockRejectedValue(new Error('Camera not available'));
    
    render(<QRScanner onScan={mockOnScan} onError={mockOnError} />);
    
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('should toggle torch when button clicked', async () => {
    render(
      <QRScanner 
        onScan={mockOnScan} 
        options={{ showTorchButton: true }}
      />
    );
    
    const torchButton = screen.getByRole('button', { name: /torch/i });
    await user.click(torchButton);
    
    // Torch state should be toggled
    expect(torchButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should flip camera when button clicked', async () => {
    render(
      <QRScanner 
        onScan={mockOnScan} 
        options={{ showFlipCameraButton: true }}
      />
    );
    
    const flipButton = screen.getByRole('button', { name: /flip.*camera/i });
    await user.click(flipButton);
    
    // Camera should be flipped
    await waitFor(() => {
      expect(QRCodeStudio.stopScan).toHaveBeenCalled();
      expect(QRCodeStudio.startScan).toHaveBeenCalledWith(
        expect.objectContaining({ camera: 'front' })
      );
    });
  });

  it('should stop scanning on unmount', () => {
    const { unmount } = render(<QRScanner onScan={mockOnScan} />);
    
    unmount();
    
    expect(QRCodeStudio.stopScan).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(
      <QRScanner 
        onScan={mockOnScan} 
        className="custom-scanner"
      />
    );
    
    expect(screen.getByRole('region', { name: /qr.*scanner/i }))
      .toHaveClass('custom-scanner');
  });

  it('should show overlay when enabled', () => {
    render(
      <QRScanner 
        onScan={mockOnScan} 
        showOverlay={true}
      />
    );
    
    expect(screen.getByLabelText(/scan.*area/i)).toBeInTheDocument();
  });

  it('should handle scan delay option', async () => {
    const scanDelay = 2000;
    
    render(
      <QRScanner 
        onScan={mockOnScan} 
        options={{ scanDelay }}
      />
    );
    
    await waitFor(() => {
      expect(QRCodeStudio.startScan).toHaveBeenCalledWith(
        expect.objectContaining({ scanDelay })
      );
    });
  });

  it('should handle file upload fallback', async () => {
    (QRCodeStudio.checkPermissions as any).mockResolvedValue({ camera: 'denied' });
    
    render(<QRScanner onScan={mockOnScan} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/upload.*image/i)).toBeInTheDocument();
    });

    const file = new File([''], 'qrcode.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload.*image/i);
    
    await user.upload(input, file);
    
    // File upload should be processed
    expect(mockOnScan).toHaveBeenCalled();
  });
});