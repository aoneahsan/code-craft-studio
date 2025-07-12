import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRGenerator } from '../../components/QRGenerator/QRGenerator';
import { QRCodeStudio } from '../../index';
import { QRType } from '../../types';

// Mock the QRCodeStudio plugin
vi.mock('../../index', () => ({
  QRCodeStudio: {
    generate: vi.fn(),
    exportAs: vi.fn(),
    saveQRCode: vi.fn(),
    shareQRCode: vi.fn(),
  },
}));

describe('QRGenerator', () => {
  const mockOnGenerate = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    (QRCodeStudio.generate as any).mockResolvedValue({
      dataUrl: 'data:image/png;base64,mockdata',
      svg: '<svg>mock</svg>',
    });
  });

  it('should render generator interface', () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
      />
    );
    
    expect(screen.getByRole('region', { name: /qr.*generator/i })).toBeInTheDocument();
  });

  it('should generate QR code on mount', async () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
      />
    );
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledWith({
        type: QRType.TEXT,
        data: { text: 'Hello' },
        size: 300,
        design: undefined,
      });
    });
  });

  it('should display generated QR code', async () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
      />
    );
    
    await waitFor(() => {
      const qrImage = screen.getByAltText(/qr code/i);
      expect(qrImage).toHaveAttribute('src', 'data:image/png;base64,mockdata');
    });
  });

  it('should regenerate QR code when data changes', async () => {
    const { rerender } = render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
      />
    );
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledTimes(1);
    });
    
    rerender(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'World' }}
      />
    );
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledTimes(2);
      expect(QRCodeStudio.generate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: { text: 'World' },
        })
      );
    });
  });

  it('should apply custom size', async () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        size={500}
      />
    );
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 500,
        })
      );
    });
  });

  it('should apply custom design', async () => {
    const customDesign = {
      colors: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      dotsStyle: 'rounded' as const,
    };
    
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        design={customDesign}
      />
    );
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          design: customDesign,
        })
      );
    });
  });

  it('should show download button when enabled', async () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        showDownload={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });
  });

  it('should handle download action', async () => {
    (QRCodeStudio.saveQRCode as any).mockResolvedValue({
      uri: 'file://saved.png',
    });
    
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        showDownload={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });
    
    const downloadButton = screen.getByRole('button', { name: /download/i });
    await user.click(downloadButton);
    
    expect(QRCodeStudio.saveQRCode).toHaveBeenCalledWith({
      qrCode: {
        dataUrl: 'data:image/png;base64,mockdata',
        svg: '<svg>mock</svg>',
      },
      fileName: expect.any(String),
      format: 'png',
    });
  });

  it('should show share button when enabled', async () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        showShare={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  it('should handle share action', async () => {
    (QRCodeStudio.shareQRCode as any).mockResolvedValue({ shared: true });
    
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        showShare={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    await user.click(shareButton);
    
    expect(QRCodeStudio.shareQRCode).toHaveBeenCalledWith({
      qrCode: {
        dataUrl: 'data:image/png;base64,mockdata',
        svg: '<svg>mock</svg>',
      },
      message: expect.any(String),
    });
  });

  it('should show export options when enabled', async () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        showExportOptions={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    });
  });

  it('should handle export format selection', async () => {
    (QRCodeStudio.exportAs as any).mockResolvedValue({
      data: '<svg>exported</svg>',
      format: 'svg',
    });
    
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        showExportOptions={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    });
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    await user.click(exportButton);
    
    // Should show format options
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /svg/i })).toBeInTheDocument();
    });
    
    const svgButton = screen.getByRole('button', { name: /svg/i });
    await user.click(svgButton);
    
    expect(QRCodeStudio.exportAs).toHaveBeenCalledWith({
      qrCode: {
        dataUrl: 'data:image/png;base64,mockdata',
        svg: '<svg>mock</svg>',
      },
      format: 'svg',
    });
  });

  it('should call onGenerate callback', async () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        onGenerate={mockOnGenerate}
      />
    );
    
    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith({
        dataUrl: 'data:image/png;base64,mockdata',
        svg: '<svg>mock</svg>',
      });
    });
  });

  it('should handle generation errors', async () => {
    const error = new Error('Generation failed');
    (QRCodeStudio.generate as any).mockRejectedValue(error);
    
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error.*generating/i)).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
      />
    );
    
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <QRGenerator 
        type={QRType.TEXT}
        data={{ text: 'Hello' }}
        className="custom-generator"
      />
    );
    
    expect(screen.getByRole('region', { name: /qr.*generator/i }))
      .toHaveClass('custom-generator');
  });

  it('should handle different QR types', async () => {
    render(
      <QRGenerator 
        type={QRType.WIFI}
        data={{
          ssid: 'MyNetwork',
          password: 'MyPassword',
          security: 'WPA2',
        }}
      />
    );
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: QRType.WIFI,
          data: {
            ssid: 'MyNetwork',
            password: 'MyPassword',
            security: 'WPA2',
          },
        })
      );
    });
  });
});