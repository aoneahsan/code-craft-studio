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

This is a Capacitor plugin that provides comprehensive QR code functionality:

### Core Components Structure
- **QRScanner**: Native camera-based QR code scanning with web fallback
- **QRGenerator**: Generates QR codes for 17+ data types with customization
- **QRStudio**: Full-featured component combining scanner, generator, and analytics

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
- Supports 17 QR types: website, PDF, images, video, WiFi, menu, business, vCard, MP3, apps, links list, coupon, Facebook, Instagram, social media, WhatsApp
- Export formats: PNG, JPG, SVG, PDF, GIF, JSON, WebP, EPS, WMF

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
- ✅ Web implementation with QR scanning (qr-scanner) and generation (qrcode)
- ✅ Three React components: QRScanner, QRGenerator, and QRStudio
- ✅ Data validation for all QR types
- ✅ Customization system with colors, logos, and styles
- ✅ Local storage using localStorage (web fallback)
- ✅ History tracking and basic analytics
- ✅ Automated setup script for easy installation
- ✅ Comprehensive documentation and API reference
- ✅ Build system configured and working

## Pending Implementation

1. **Native Platforms**: iOS and Android native implementations not yet created
2. **Advanced Features**: Landing page builder, cloud sync, real analytics
3. **Export Formats**: PDF, EPS, WMF export formats need implementation
4. **Testing**: Vitest test suite needs to be written
5. **Demo Apps**: Example applications need to be created

## Project Structure Notes

- CSS files are shipped separately in `src/components/**/*.css` and `src/styles/`
- Components don't import CSS directly to avoid build issues
- Users must import `qrcode-studio/src/styles/qrcode-studio.css` in their app
- The package uses React 18+ and requires it as a peer dependency