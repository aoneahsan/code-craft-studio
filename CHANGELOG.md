# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-08-02

### Added
- Provider-less architecture with `useCodeCraftStudio` hook
- Works in plain React apps without Capacitor
- Dynamic platform detection and adapter loading
- Platform capabilities API
- Storage abstraction for web and Capacitor
- Migration guide for upgrading from v1.x
- Examples for both React and Capacitor apps

### Changed
- Capacitor is now an optional dependency
- Refactored internal architecture to use platform adapters
- Improved TypeScript types and interfaces
- Updated build configuration for conditional imports

### Fixed
- Fixed TypeScript compilation errors
- Fixed interface property mismatches
- Fixed barcode scanner implementation
- Fixed export format type checking

## [1.1.0] - 2025-01-01

### Added
- Initial release with full QR code and barcode support
- 22+ QR code types
- 14+ barcode formats
- React components
- Native iOS and Android support
- Web fallback implementations
- Analytics and history tracking
- Multiple export formats

## [1.0.0] - 2024-12-01

### Added
- Initial beta release