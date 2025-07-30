# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

- **Install dependencies**: `yarn` or `yarn install`
- **Build package**: `yarn build` (runs clean, TypeScript compilation, and Rollup bundling)
- **TypeScript compilation**: `yarn tsc`
- **Watch mode**: `yarn watch` (TypeScript watch mode)
- **Lint code**: `yarn lint` (ESLint with TypeScript support)
- **Format code**: `yarn prettier` (Prettier formatting)
- **Clean build**: `yarn clean` (removes dist directory)
- **iOS linting**: `yarn swiftlint` (Swift code linting for iOS)
- **Pre-publish**: `yarn prepublishOnly` (runs before npm publish)

## Architecture Overview

This is a Capacitor plugin that provides comprehensive QR code and barcode functionality:

### Core Components Structure
- **QRScanner**: Native camera-based QR code scanning with web fallback
- **QRGenerator**: Generates QR codes for 22+ data types with customization
- **BarcodeScanner**: Multi-format barcode scanning (EAN, UPC, Code 128, etc.)
- **BarcodeGenerator**: Generates barcodes in 14+ formats with text display
- **QRStudio**: Full-featured component combining all scanning, generation, and analytics

### Plugin Architecture
- **src/index.ts**: Main plugin entry point and API exports
- **src/definitions.ts**: TypeScript interfaces for plugin methods and data types
- **src/web.ts**: Web implementation using jsQR/qrcode.js libraries
- **android/**: Native Android implementation using CameraX and ML Kit
- **ios/**: Native iOS implementation using AVFoundation and Vision framework

### Key Technical Decisions
- Uses Capacitor's plugin architecture for native functionality with web fallbacks
- React components built on top of core plugin functionality
- Offline-first design with Capacitor Preferences API for storage
- Supports 22+ QR types: website, PDF, images, video, WiFi, menu, business, vCard, MP3, apps, links list, coupon, Facebook, Instagram, social media, WhatsApp, text, email, SMS, phone, location, event
- Supports 14+ barcode formats: EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, Code 93, ITF, Codabar, QR Code, Data Matrix, PDF417, Aztec
- Export formats: PNG, JPG, SVG, PDF, GIF, JSON, WebP, EPS, WMF
- Barcode validation with checksum verification for all supported formats
- Uses ZXing-JS for web barcode scanning, ML Kit for Android, and Core Image for iOS

## Development Guidelines

### Package Management
- Always use `yarn` for dependency management
- Keep dependencies updated to latest stable versions
- Run `yarn` to update dependencies when starting work

### Code Quality Standards
- TypeScript strict mode is enabled
- Component files should not exceed 500 lines
- Create small, reusable components
- Use named props in function definitions
- Follow existing code patterns and conventions

### Storage and State
- Use Capacitor Preferences API instead of localStorage
- Implement full offline support for all platforms
- Track local changes pending synchronization

### Testing
- Use Vitest or Cypress for testing (not Jest)
- No testing framework is currently set up - needs implementation

### Documentation
- Use Docusaurus for project documentation
- Keep documentation in the `docs/` folder
- Maintain project development status in `project-development-plan/` folder

## Current Status

The project has been successfully implemented with:
- ✅ Complete TypeScript interfaces and type definitions for all 22+ QR types
- ✅ Complete TypeScript interfaces for 14+ barcode formats
- ✅ Web implementation with QR scanning (qr-scanner) and generation (qrcode)
- ✅ Web implementation with barcode scanning (ZXing-JS) and generation (jsbarcode)
- ✅ Five React components: QRScanner, QRGenerator, BarcodeScanner, BarcodeGenerator, and QRStudio
- ✅ Data validation for all QR types and barcode formats with checksum verification
- ✅ Customization system with colors, logos, and styles
- ✅ Local storage using localStorage (web fallback)
- ✅ History tracking and basic analytics
- ✅ Native Android barcode support (ML Kit integration)
- ✅ Native iOS barcode support (Core Image and Vision framework)
- ✅ Automated setup script for easy installation
- ✅ Comprehensive documentation and API reference
- ✅ Build system configured and working
- ✅ Barcode validation functions and tests

## Pending Implementation

1. **Advanced Features**: Landing page builder, cloud sync, real analytics
2. **Export Formats**: PDF, EPS, WMF export formats need implementation
3. **Testing**: More comprehensive Vitest test suite needs to be written
4. **Demo Apps**: Example applications need to be created
5. **Product Database**: Integration with product databases for EAN/UPC lookup
6. **Batch Operations**: Bulk barcode/QR code generation from CSV

## Project Structure Notes

- CSS files are shipped separately in `src/components/**/*.css` and `src/styles/`
- Components don't import CSS directly to avoid build issues
- Users must import `code-craft-studio/src/styles/code-craft-studio.css` in their app
- The package uses React 18+ and requires it as a peer dependency