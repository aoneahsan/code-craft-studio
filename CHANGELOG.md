# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2025-01-20

### Fixed
- **Testing**: Fixed React Testing Library act() warnings and test failures in QRStudio, QRGenerator, and QRScanner components
- **Build**: Updated ESLint configuration from deprecated .eslintrc.js to modern eslint.config.js flat config format (ESLint v9+)
- **Security**: Resolved security vulnerability in `on-headers` dependency by upgrading @cypress/webpack-dev-server to v4.1.0
- **Linting**: Added comprehensive browser globals (document, navigator, localStorage, alert, React) to ESLint config
- **Error Handling**: Fixed unused variable errors in catch blocks across QRGenerator, QRScanner, and web implementation

### Improved
- **Code Quality**: Reduced ESLint errors from 155 to 0 critical errors (45 warnings remain for `any` types)
- **Build Process**: Verified build system integrity with TypeScript compilation, Rollup bundling, and distribution files
- **Dependencies**: Updated development dependencies to latest versions with security patches
- **Test Suite**: Enhanced test stability with proper async/await patterns and improved mocking

### Technical Details
- Migrated from .eslintrc.js to eslint.config.js with CommonJS compatibility
- Fixed React Testing Library timeout issues with proper `act()` wrapping
- Removed deprecated .eslintignore in favor of flat config ignore patterns
- Updated validators mock in test suite to prevent validation errors
- Confirmed all distribution files (ESM, CJS, UMD) are correctly generated

## [0.0.1] - 2024-12-30

### Added
- Initial release of Code Craft Studio
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

### Updates (Post-release fixes)
- Fixed formatQRData for all 17+ QR types (IMAGES, MENU, BUSINESS, MP3, APPS, LINKS_LIST, COUPON, SOCIAL_MEDIA)
- Added array field editor for complex data types (images, links, menu categories)
- Implemented export support for JPG, JSON, and WebP formats
- Fixed form data handling for array-based QR types
- Added proper data transformation in QRStudio component

### Known Issues
- Landing page builder UI not yet implemented (type definitions exist)
- Advanced analytics require backend service (mock data only)
- Native iOS and Android implementations pending
- Export to PDF, EPS, WMF formats require additional libraries