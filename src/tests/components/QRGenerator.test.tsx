import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRGenerator } from '../../components/QRGenerator/QRGenerator';
import { QRCodeStudio } from '../../index';
import { QRType } from '../../types';

// Mock the QRCodeStudio plugin
vi.mock('../../index', () => ({
  QRCodeStudio: {
    generate: vi.fn(),
    saveQRCode: vi.fn(),
  },
}));

// Mock the validators
vi.mock('../../core/validators/qr-validators', () => ({
  validateQRData: vi.fn(),
  QRValidationError: class extends Error {
    constructor(message: string, public field?: string) {
      super(message);
      this.name = 'QRValidationError';
    }
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

  it('should render generator interface', async () => {
    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
        />
      );
    });
    
    // Look for the loading state initially
    await waitFor(() => {
      expect(screen.getByText(/generating qr code/i) || screen.getByAltText(/qr code/i)).toBeInTheDocument();
    });
  });

  it('should generate QR code on mount', async () => {
    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
        />
      );
    });
    
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
    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
        />
      );
    });
    
    await waitFor(() => {
      const qrImage = screen.getByAltText(/qr code/i);
      expect(qrImage).toHaveAttribute('src', 'data:image/png;base64,mockdata');
    });
  });

  it('should regenerate QR code when data changes', async () => {
    let rerender: any;
    await act(async () => {
      const result = render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
        />
      );
      rerender = result.rerender;
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledTimes(1);
    });
    
    await act(async () => {
      rerender(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'World' }}
        />
      );
    });
    
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
    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
          size={500}
        />
      );
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 500,
        })
      );
    });
  });

  it('should apply custom design options', async () => {
    const design = {
      colors: { dark: '#000000', light: '#FFFFFF' },
      dotsStyle: 'rounded' as const,
    };

    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
          design={design}
        />
      );
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          design,
        })
      );
    });
  });

  it('should call onGenerate callback', async () => {
    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
          onGenerate={mockOnGenerate}
        />
      );
    });
    
    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith({
        dataUrl: 'data:image/png;base64,mockdata',
        svg: '<svg>mock</svg>',
      });
    });
  });

  it('should handle generation errors', async () => {
    (QRCodeStudio.generate as any).mockRejectedValue(new Error('Generation failed'));

    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
        />
      );
    });
    
    await waitFor(() => {
      expect(screen.getByText(/generation failed/i)).toBeInTheDocument();
    });
  });

  it('should show loading state', async () => {
    // Mock a delayed response
    (QRCodeStudio.generate as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        dataUrl: 'data:image/png;base64,mockdata',
        svg: '<svg>mock</svg>',
      }), 100))
    );

    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
        />
      );
    });
    
    expect(screen.getByText(/generating qr code/i)).toBeInTheDocument();
  });

  it('should apply custom className', async () => {
    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.TEXT}
          data={{ text: 'Hello' }}
          className="custom-generator"
        />
      );
    });
    
    await waitFor(() => {
      const container = screen.getByText(/generating qr code/i).closest('.qr-generator-container');
      expect(container).toHaveClass('custom-generator');
    });
  });

  it('should handle different QR types', async () => {
    await act(async () => {
      render(
        <QRGenerator 
          type={QRType.WEBSITE}
          data={{ url: 'https://example.com' }}
        />
      );
    });
    
    await waitFor(() => {
      expect(QRCodeStudio.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: QRType.WEBSITE,
          data: { url: 'https://example.com' },
        })
      );
    });
  });
});