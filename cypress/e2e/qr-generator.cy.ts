describe('QR Generator E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=generator-tab]').click();
  });

  it('should display generator interface', () => {
    cy.get('[data-cy=qr-generator]').should('be.visible');
    cy.get('[data-cy=qr-type-selector]').should('be.visible');
    cy.get('[data-cy=generate-button]').should('be.visible');
  });

  it('should generate a text QR code', () => {
    cy.generateQRCode('text', { text: 'Hello World!' });
    
    // Check QR code display
    cy.get('[data-cy=qr-code-display]').should('be.visible');
    cy.get('[data-cy=qr-code-canvas]').should('be.visible');
    
    // Check download buttons
    cy.get('[data-cy=download-png]').should('be.visible');
    cy.get('[data-cy=download-svg]').should('be.visible');
    cy.get('[data-cy=download-pdf]').should('be.visible');
  });

  it('should generate a website QR code', () => {
    cy.generateQRCode('website', { 
      url: 'https://example.com',
      title: 'Example Website'
    });
    
    // Check QR code display
    cy.get('[data-cy=qr-code-display]').should('be.visible');
    
    // Check metadata display
    cy.get('[data-cy=qr-metadata]').should('be.visible');
    cy.get('[data-cy=qr-metadata-type]').should('contain', 'Website');
    cy.get('[data-cy=qr-metadata-url]').should('contain', 'https://example.com');
  });

  it('should generate a WiFi QR code', () => {
    cy.generateQRCode('wifi', {
      ssid: 'MyNetwork',
      password: 'SecurePassword123',
      security: 'WPA2'
    });
    
    // Check QR code display
    cy.get('[data-cy=qr-code-display]').should('be.visible');
    
    // Check security reminder
    cy.get('[data-cy=wifi-security-reminder]').should('be.visible');
    cy.get('[data-cy=wifi-security-reminder]').should('contain', 'secure location');
  });

  it('should generate a vCard QR code', () => {
    cy.generateQRCode('vcard', {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      email: 'john.doe@example.com'
    });
    
    // Check QR code display
    cy.get('[data-cy=qr-code-display]').should('be.visible');
    
    // Check vCard preview
    cy.get('[data-cy=vcard-preview]').should('be.visible');
    cy.get('[data-cy=vcard-name]').should('contain', 'John Doe');
    cy.get('[data-cy=vcard-phone]').should('contain', '+1234567890');
    cy.get('[data-cy=vcard-email]').should('contain', 'john.doe@example.com');
  });

  it('should validate required fields', () => {
    // Select website type
    cy.get('[data-cy=qr-type-selector]').select('website');
    
    // Try to generate without filling required fields
    cy.get('[data-cy=generate-button]').click();
    
    // Check validation messages
    cy.get('[data-cy=url-input-error]').should('be.visible');
    cy.get('[data-cy=url-input-error]').should('contain', 'URL is required');
    
    // Fill the field and generate
    cy.get('[data-cy=url-input]').type('https://example.com');
    cy.get('[data-cy=generate-button]').click();
    
    // Should generate successfully
    cy.get('[data-cy=qr-code-display]').should('be.visible');
    cy.get('[data-cy=url-input-error]').should('not.exist');
  });

  it('should customize QR code style', () => {
    // Generate a basic QR code
    cy.generateQRCode('text', { text: 'Style Test' });
    
    // Open style options
    cy.get('[data-cy=style-options-toggle]').click();
    cy.get('[data-cy=style-options]').should('be.visible');
    
    // Change colors
    cy.get('[data-cy=foreground-color]').invoke('val', '#FF0000').trigger('change');
    cy.get('[data-cy=background-color]').invoke('val', '#0000FF').trigger('change');
    
    // Change size
    cy.get('[data-cy=qr-size-slider]').invoke('val', 300).trigger('change');
    
    // Apply changes
    cy.get('[data-cy=apply-style-button]').click();
    
    // Check that QR code is regenerated
    cy.get('[data-cy=qr-code-canvas]').should('be.visible');
  });

  it('should add logo to QR code', () => {
    // Generate a QR code
    cy.generateQRCode('website', { url: 'https://example.com' });
    
    // Open logo options
    cy.get('[data-cy=logo-options-toggle]').click();
    cy.get('[data-cy=logo-options]').should('be.visible');
    
    // Upload logo
    const fileName = 'logo.png';
    cy.get('[data-cy=logo-input]').selectFile({
      contents: Cypress.Buffer.from('fake-logo-data'),
      fileName,
      mimeType: 'image/png',
    });
    
    // Apply logo
    cy.get('[data-cy=apply-logo-button]').click();
    
    // Check that QR code is regenerated with logo
    cy.get('[data-cy=qr-code-canvas]').should('be.visible');
    cy.get('[data-cy=logo-indicator]').should('be.visible');
  });

  it('should download QR code in different formats', () => {
    // Generate a QR code
    cy.generateQRCode('text', { text: 'Download Test' });
    
    // Test PNG download
    cy.get('[data-cy=download-png]').click();
    cy.get('[data-cy=download-success]').should('be.visible');
    
    // Test SVG download
    cy.get('[data-cy=download-svg]').click();
    cy.get('[data-cy=download-success]').should('be.visible');
    
    // Test PDF download
    cy.get('[data-cy=download-pdf]').click();
    cy.get('[data-cy=download-success]').should('be.visible');
  });

  it('should save QR code to history', () => {
    // Generate a QR code
    cy.generateQRCode('text', { text: 'History Test' });
    
    // Save to history
    cy.get('[data-cy=save-to-history-button]').click();
    cy.get('[data-cy=save-success]').should('be.visible');
    
    // Go to history tab
    cy.get('[data-cy=history-tab]').click();
    
    // Check if QR code is in history
    cy.get('[data-cy=history-list]').should('be.visible');
    cy.get('[data-cy=history-item]').first().should('contain', 'History Test');
    cy.get('[data-cy=history-item]').first().find('[data-cy=generated-badge]').should('exist');
  });

  it('should batch generate QR codes', () => {
    // Open batch mode
    cy.get('[data-cy=batch-mode-toggle]').click();
    cy.get('[data-cy=batch-generator]').should('be.visible');
    
    // Upload CSV file
    const csvContent = `type,data
text,First QR Code
text,Second QR Code
website,https://example1.com
website,https://example2.com`;
    
    cy.get('[data-cy=csv-input]').selectFile({
      contents: csvContent,
      fileName: 'batch.csv',
      mimeType: 'text/csv',
    });
    
    // Start batch generation
    cy.get('[data-cy=start-batch-button]').click();
    
    // Check progress
    cy.get('[data-cy=batch-progress]').should('be.visible');
    cy.get('[data-cy=batch-progress-bar]').should('be.visible');
    
    // Check results
    cy.get('[data-cy=batch-results]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy=batch-result-item]').should('have.length', 4);
    
    // Download all as ZIP
    cy.get('[data-cy=download-all-zip]').click();
    cy.get('[data-cy=download-success]').should('be.visible');
  });

  it('should handle generation errors', () => {
    // Select email type
    cy.get('[data-cy=qr-type-selector]').select('email');
    
    // Enter invalid email
    cy.get('[data-cy=email-to-input]').type('invalid-email');
    cy.get('[data-cy=generate-button]').click();
    
    // Check error message
    cy.get('[data-cy=generation-error]').should('be.visible');
    cy.get('[data-cy=generation-error]').should('contain', 'Invalid email');
    
    // Fix and retry
    cy.get('[data-cy=email-to-input]').clear().type('valid@example.com');
    cy.get('[data-cy=generate-button]').click();
    
    // Should generate successfully
    cy.get('[data-cy=qr-code-display]').should('be.visible');
    cy.get('[data-cy=generation-error]').should('not.exist');
  });

  it('should support all QR types', () => {
    const qrTypes = [
      'text', 'website', 'email', 'phone', 'sms', 'wifi',
      'vcard', 'event', 'location', 'crypto', 'social',
      'app', 'payment', 'menu', 'product', 'ticket',
      'feedback', 'coupon', 'loyalty', 'authentication',
      'voting', 'health'
    ];
    
    // Check that all types are available
    cy.get('[data-cy=qr-type-selector]').click();
    qrTypes.forEach(type => {
      cy.get(`[data-cy=qr-type-option-${type}]`).should('exist');
    });
  });
});