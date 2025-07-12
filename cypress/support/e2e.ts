// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global type declarations
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to scan a QR code
       * @example cy.scanQRCode('https://example.com')
       */
      scanQRCode(content: string): Chainable<void>;
      
      /**
       * Custom command to generate a QR code
       * @example cy.generateQRCode('website', { url: 'https://example.com' })
       */
      generateQRCode(type: string, data: any): Chainable<void>;
      
      /**
       * Custom command to grant camera permissions
       * @example cy.grantCameraPermission()
       */
      grantCameraPermission(): Chainable<void>;
    }
  }
}

// Prevent Cypress from failing tests due to uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});