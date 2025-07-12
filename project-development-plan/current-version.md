# Current Version: 0.0.1

## Release Date: July 12, 2024

## Version Summary
Initial release of QRCode Studio - A comprehensive Capacitor plugin for QR code scanning and generation.

## Features Included

### Core Functionality
- ✅ Web-based QR code scanning using qr-scanner library
- ✅ QR code generation for 22+ types
- ✅ React components (QRScanner, QRGenerator, QRStudio)
- ✅ TypeScript support with full type definitions
- ✅ Design customization (colors, logos, styles)
- ✅ Export formats: PNG, JPG, SVG, JSON, WebP

### QR Code Types
1. TEXT - Plain text content
2. WEBSITE - URLs with metadata
3. WIFI - WiFi network credentials
4. EMAIL - Email composition
5. PHONE - Phone numbers
6. SMS - SMS messages
7. WHATSAPP - WhatsApp messages
8. VCARD - Contact cards
9. MECARD - Simplified contacts
10. LOCATION - GPS coordinates
11. EVENT - Calendar events
12. CRYPTO - Cryptocurrency addresses
13. SOCIAL_MEDIA - Social profiles
14. PDF - PDF documents
15. VIDEO - Video content
16. FACEBOOK - Facebook pages
17. INSTAGRAM - Instagram profiles
18. IMAGES - Image galleries
19. MENU - Restaurant menus
20. BUSINESS - Business information
21. MP3 - Audio files
22. APPS - App store links
23. LINKS_LIST - Multiple links
24. COUPON - Discount codes

### Components
- QRScanner - Camera-based QR scanning
- QRGenerator - QR code generation with customization
- QRStudio - Full-featured studio component
- ArrayFieldEditor - Complex form field handling

### Developer Tools
- Setup script (npx qrcode-studio-setup)
- Comprehensive documentation
- Example implementations
- TypeScript definitions

## Known Limitations
- Native iOS/Android implementations not included
- Some export formats (PDF, GIF, EPS, WMF) require additional libraries
- Analytics and landing pages need backend implementation
- No unit tests in initial release

## Breaking Changes
None - Initial release

## Migration Guide
Not applicable - Initial release

## Dependencies
- @capacitor/core: ^7.0.0
- @capacitor/preferences: ^7.0.1
- qrcode: ^1.5.4
- qr-scanner: ^1.4.2
- react: >=18.0.0 (peer)
- react-dom: >=18.0.0 (peer)