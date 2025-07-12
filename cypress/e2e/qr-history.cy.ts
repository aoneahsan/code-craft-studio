describe('QR History E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear history before each test
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should display empty history initially', () => {
    cy.get('[data-cy=history-tab]').click();
    cy.get('[data-cy=qr-history]').should('be.visible');
    cy.get('[data-cy=empty-history-message]').should('be.visible');
    cy.get('[data-cy=empty-history-message]').should('contain', 'No QR codes');
  });

  it('should save scanned QR codes to history', () => {
    // Scan a QR code
    cy.get('[data-cy=scanner-tab]').click();
    cy.grantCameraPermission();
    cy.scanQRCode('https://example.com');
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Check history item
    cy.get('[data-cy=history-list]').should('be.visible');
    cy.get('[data-cy=history-item]').should('have.length', 1);
    cy.get('[data-cy=history-item]').first().should('contain', 'https://example.com');
    cy.get('[data-cy=history-item]').first().find('[data-cy=scan-badge]').should('exist');
    cy.get('[data-cy=history-item]').first().find('[data-cy=history-timestamp]').should('be.visible');
  });

  it('should save generated QR codes to history', () => {
    // Generate a QR code
    cy.get('[data-cy=generator-tab]').click();
    cy.generateQRCode('text', { text: 'Generated Text' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Check history item
    cy.get('[data-cy=history-list]').should('be.visible');
    cy.get('[data-cy=history-item]').should('have.length', 1);
    cy.get('[data-cy=history-item]').first().should('contain', 'Generated Text');
    cy.get('[data-cy=history-item]').first().find('[data-cy=generated-badge]').should('exist');
  });

  it('should display QR code details', () => {
    // Generate multiple QR codes
    cy.get('[data-cy=generator-tab]').click();
    
    // Generate website QR
    cy.generateQRCode('website', { url: 'https://example.com', title: 'Example Site' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Generate WiFi QR
    cy.get('[data-cy=qr-type-selector]').select('wifi');
    cy.generateQRCode('wifi', { ssid: 'MyWiFi', password: 'secret123', security: 'WPA2' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Click on first item to view details
    cy.get('[data-cy=history-item]').first().click();
    cy.get('[data-cy=qr-details-modal]').should('be.visible');
    
    // Check details
    cy.get('[data-cy=details-type]').should('contain', 'WiFi');
    cy.get('[data-cy=details-content]').should('contain', 'MyWiFi');
    cy.get('[data-cy=details-qr-preview]').should('be.visible');
    
    // Close modal
    cy.get('[data-cy=close-details-button]').click();
    cy.get('[data-cy=qr-details-modal]').should('not.exist');
  });

  it('should filter history by type', () => {
    // Generate different types of QR codes
    cy.get('[data-cy=generator-tab]').click();
    
    cy.generateQRCode('text', { text: 'Text QR' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    cy.generateQRCode('website', { url: 'https://example.com' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    cy.generateQRCode('wifi', { ssid: 'TestWiFi', security: 'WPA2' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Should show all items initially
    cy.get('[data-cy=history-item]').should('have.length', 3);
    
    // Filter by text
    cy.get('[data-cy=type-filter]').select('text');
    cy.get('[data-cy=history-item]').should('have.length', 1);
    cy.get('[data-cy=history-item]').should('contain', 'Text QR');
    
    // Filter by website
    cy.get('[data-cy=type-filter]').select('website');
    cy.get('[data-cy=history-item]').should('have.length', 1);
    cy.get('[data-cy=history-item]').should('contain', 'example.com');
    
    // Show all
    cy.get('[data-cy=type-filter]').select('all');
    cy.get('[data-cy=history-item]').should('have.length', 3);
  });

  it('should search history', () => {
    // Generate QR codes
    cy.get('[data-cy=generator-tab]').click();
    
    cy.generateQRCode('text', { text: 'Hello World' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    cy.generateQRCode('text', { text: 'Goodbye World' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    cy.generateQRCode('website', { url: 'https://hello.com' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Search for "hello"
    cy.get('[data-cy=search-input]').type('hello');
    cy.get('[data-cy=history-item]').should('have.length', 2);
    
    // Clear search
    cy.get('[data-cy=search-clear-button]').click();
    cy.get('[data-cy=history-item]').should('have.length', 3);
    
    // Search for "goodbye"
    cy.get('[data-cy=search-input]').type('goodbye');
    cy.get('[data-cy=history-item]').should('have.length', 1);
  });

  it('should delete history items', () => {
    // Generate QR codes
    cy.get('[data-cy=generator-tab]').click();
    
    cy.generateQRCode('text', { text: 'Item 1' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    cy.generateQRCode('text', { text: 'Item 2' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    cy.get('[data-cy=history-item]').should('have.length', 2);
    
    // Delete first item
    cy.get('[data-cy=history-item]').first().find('[data-cy=delete-button]').click();
    cy.get('[data-cy=confirm-delete-modal]').should('be.visible');
    cy.get('[data-cy=confirm-delete-button]').click();
    
    // Check item is deleted
    cy.get('[data-cy=history-item]').should('have.length', 1);
    cy.get('[data-cy=history-item]').should('not.contain', 'Item 2');
  });

  it('should clear all history', () => {
    // Generate multiple QR codes
    cy.get('[data-cy=generator-tab]').click();
    
    for (let i = 1; i <= 5; i++) {
      cy.generateQRCode('text', { text: `Item ${i}` });
      cy.get('[data-cy=save-to-history-button]').click();
    }
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    cy.get('[data-cy=history-item]').should('have.length', 5);
    
    // Clear all history
    cy.get('[data-cy=clear-history-button]').click();
    cy.get('[data-cy=confirm-clear-modal]').should('be.visible');
    cy.get('[data-cy=confirm-clear-button]').click();
    
    // Check history is empty
    cy.get('[data-cy=empty-history-message]').should('be.visible');
    cy.get('[data-cy=history-item]').should('not.exist');
  });

  it('should export history', () => {
    // Generate QR codes
    cy.get('[data-cy=generator-tab]').click();
    
    cy.generateQRCode('text', { text: 'Export Item 1' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    cy.generateQRCode('website', { url: 'https://export.com' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Export as JSON
    cy.get('[data-cy=export-history-button]').click();
    cy.get('[data-cy=export-format-select]').select('json');
    cy.get('[data-cy=export-confirm-button]').click();
    cy.get('[data-cy=export-success]').should('be.visible');
    
    // Export as CSV
    cy.get('[data-cy=export-history-button]').click();
    cy.get('[data-cy=export-format-select]').select('csv');
    cy.get('[data-cy=export-confirm-button]').click();
    cy.get('[data-cy=export-success]').should('be.visible');
  });

  it('should favorite history items', () => {
    // Generate QR codes
    cy.get('[data-cy=generator-tab]').click();
    
    cy.generateQRCode('text', { text: 'Regular Item' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    cy.generateQRCode('text', { text: 'Favorite Item' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Favorite the first item
    cy.get('[data-cy=history-item]').first().find('[data-cy=favorite-button]').click();
    cy.get('[data-cy=history-item]').first().find('[data-cy=favorite-icon]').should('have.class', 'active');
    
    // Filter by favorites
    cy.get('[data-cy=show-favorites-toggle]').click();
    cy.get('[data-cy=history-item]').should('have.length', 1);
    cy.get('[data-cy=history-item]').should('contain', 'Favorite Item');
    
    // Unfavorite
    cy.get('[data-cy=history-item]').first().find('[data-cy=favorite-button]').click();
    cy.get('[data-cy=empty-favorites-message]').should('be.visible');
  });

  it('should regenerate QR code from history', () => {
    // Generate a QR code
    cy.get('[data-cy=generator-tab]').click();
    cy.generateQRCode('website', { url: 'https://regenerate.com', title: 'Regen Test' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Click regenerate
    cy.get('[data-cy=history-item]').first().find('[data-cy=regenerate-button]').click();
    
    // Should navigate to generator with pre-filled data
    cy.get('[data-cy=qr-generator]').should('be.visible');
    cy.get('[data-cy=qr-type-selector]').should('have.value', 'website');
    cy.get('[data-cy=url-input]').should('have.value', 'https://regenerate.com');
    cy.get('[data-cy=title-input]').should('have.value', 'Regen Test');
    cy.get('[data-cy=qr-code-display]').should('be.visible');
  });

  it('should sort history items', () => {
    // Generate QR codes with delays to ensure different timestamps
    cy.get('[data-cy=generator-tab]').click();
    
    cy.generateQRCode('text', { text: 'First Item' });
    cy.get('[data-cy=save-to-history-button]').click();
    cy.wait(1000);
    
    cy.generateQRCode('text', { text: 'Second Item' });
    cy.get('[data-cy=save-to-history-button]').click();
    cy.wait(1000);
    
    cy.generateQRCode('text', { text: 'Third Item' });
    cy.get('[data-cy=save-to-history-button]').click();
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Default sort should be newest first
    cy.get('[data-cy=history-item]').first().should('contain', 'Third Item');
    
    // Sort by oldest first
    cy.get('[data-cy=sort-select]').select('oldest');
    cy.get('[data-cy=history-item]').first().should('contain', 'First Item');
    
    // Sort by type
    cy.get('[data-cy=sort-select]').select('type');
    cy.get('[data-cy=history-item]').should('have.length', 3);
  });
});