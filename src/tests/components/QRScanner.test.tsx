import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
    removeAllListeners: vi.fn(),
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
    (QRCodeStudio.addListener as any).mockResolvedValue({ remove: vi.fn() });
  });

  it('should render scanner interface', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
        />
      );
    });
    
    await waitFor(() => {
      expect(screen.getByText(/grant camera permission/i) || screen.getByText(/camera preview/i) || screen.getByText(/scanning/i)).toBeInTheDocument();
    });
  });

  it('should check permissions on mount', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
        />
      );
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.checkPermissions).toHaveBeenCalled();
    });
  });

  it('should request permissions when denied', async () => {
    (QRCodeStudio.checkPermissions as any).mockResolvedValue({ camera: 'denied' });

    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
        />
      );
    });
    
    await waitFor(() => {
      expect(screen.getByText(/grant camera permission/i)).toBeInTheDocument();
    });

    const permissionButton = screen.getByRole('button', { name: /grant permission/i });
    
    await act(async () => {
      await user.click(permissionButton);
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.requestPermissions).toHaveBeenCalled();
    });
  });

  it('should start scanning when permissions granted', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
        />
      );
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.startScan).toHaveBeenCalled();
    });
  });

  it('should show torch button when enabled', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
          options={{ showTorchButton: true }}
        />
      );
    });
    
    await waitFor(() => {
      const torchButton = screen.queryByRole('button', { name: /torch/i }) || 
                         screen.queryByText(/💡/) ||
                         screen.queryByText(/🔦/);
      expect(torchButton).toBeInTheDocument();
    });
  });

  it('should show flip camera button when enabled', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
          options={{ showFlipCameraButton: true }}
        />
      );
    });
    
    await waitFor(() => {
      const flipButton = screen.queryByRole('button', { name: /flip/i }) || 
                        screen.queryByText(/🔄/) ||
                        screen.queryByText(/flip/i);
      expect(flipButton).toBeInTheDocument();
    });
  });

  it('should toggle torch when button clicked', async () => {
    const mockListener = { remove: vi.fn() };
    (QRCodeStudio.addListener as any).mockResolvedValue(mockListener);

    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
          options={{ showTorchButton: true }}
        />
      );
    });
    
    await waitFor(() => {
      const torchButton = screen.queryByRole('button', { name: /torch/i }) || 
                         screen.queryByText(/💡/) ||
                         screen.queryByText(/🔦/);
      if (torchButton) {
        expect(torchButton).toBeInTheDocument();
      }
    });
  });

  it('should handle scan results', async () => {
    const scanResult = {
      content: 'https://example.com',
      format: 'QR_CODE',
      type: 'website',
      parsedData: { url: 'https://example.com' },
      timestamp: Date.now(),
    };

    let scanListener: any;
    (QRCodeStudio.addListener as any).mockImplementation((event: string, callback: any) => {
      if (event === 'scanResult') {
        scanListener = callback;
      }
      return Promise.resolve({ remove: vi.fn() });
    });

    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
        />
      );
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.addListener).toHaveBeenCalledWith('scanResult', expect.any(Function));
    });

    if (scanListener) {
      await act(async () => {
        scanListener(scanResult);
      });
      
      expect(mockOnScan).toHaveBeenCalledWith(scanResult);
    }
  });

  it('should handle scan errors', async () => {
    const scanError = {
      code: 'SCAN_ERROR',
      message: 'Camera error',
    };

    let errorListener: any;
    (QRCodeStudio.addListener as any).mockImplementation((event: string, callback: any) => {
      if (event === 'scanError') {
        errorListener = callback;
      }
      return Promise.resolve({ remove: vi.fn() });
    });

    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
          onError={mockOnError}
        />
      );
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.addListener).toHaveBeenCalledWith('scanError', expect.any(Function));
    });

    if (errorListener) {
      await act(async () => {
        errorListener(scanError);
      });
      
      expect(mockOnError).toHaveBeenCalledWith(scanError);
    }
  });

  it('should cleanup on unmount', async () => {
    const mockRemove = vi.fn();
    (QRCodeStudio.addListener as any).mockResolvedValue({ remove: mockRemove });

    const { unmount } = await act(async () => {
      return render(
        <QRScanner 
          onScan={mockOnScan}
        />
      );
    });
    
    await act(async () => {
      unmount();
    });
    
    expect(QRCodeStudio.stopScan).toHaveBeenCalled();
    expect(QRCodeStudio.removeAllListeners).toHaveBeenCalled();
  });

  it('should apply custom className', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
          className="custom-scanner"
        />
      );
    });
    
    await waitFor(() => {
      const container = document.querySelector('.qr-scanner-container');
      expect(container).toHaveClass('custom-scanner');
    });
  });

  it('should show overlay by default', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
        />
      );
    });
    
    await waitFor(() => {
      const overlay = document.querySelector('.qr-scanner-overlay') ||
                     screen.queryByText(/position qr code/i) ||
                     screen.queryByText(/scan/i);
      expect(overlay).toBeInTheDocument();
    });
  });

  it('should hide overlay when disabled', async () => {
    await act(async () => {
      render(
        <QRScanner 
          onScan={mockOnScan}
          showOverlay={false}
        />
      );
    });
    
    // Should not show overlay elements
    const overlay = document.querySelector('.qr-scanner-overlay');
    expect(overlay).not.toBeInTheDocument();
  });
});