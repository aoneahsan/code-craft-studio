# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-12-30

### Added
- Initial release of QRCode Studio
- QR code scanning functionality with native camera support
- QR code generation for 17+ different types
- React components: QRScanner, QRGenerator, and QRStudio
- Web implementation with fallback support
- Customizable QR code designs (colors, logos, styles)
- Export functionality (PNG, JPG, SVG, PDF, etc.)
- History tracking and management
- Basic analytics support
- TypeScript support with comprehensive type definitions
- Automated setup script for easy installation
- Comprehensive documentation and examples

### Features
- **Scanner**: Native camera scanning on iOS/Android, web fallback using qr-scanner
- **Generator**: Support for website, WiFi, vCard, SMS, email, location, events, and more
- **Components**: Ready-to-use React components with full customization
- **Design**: Customizable colors, logos, frames, dot styles, and corner styles
- **Export**: Multiple format support including vector and raster formats
- **Storage**: Local storage using Capacitor Preferences API
- **Permissions**: Automatic permission handling for camera access

### Platform Support
- Web (Chrome, Safari, Firefox, Edge)
- iOS 13+
- Android 5.0+

### Known Issues
- Landing page builder not yet implemented
- Advanced analytics require backend service
- Native iOS and Android implementations pending
- Export to PDF, EPS, WMF formats not yet supported