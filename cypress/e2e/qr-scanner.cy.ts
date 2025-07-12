describe('QR Scanner E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.grantCameraPermission();
  });

  it('should display scanner interface', () => {
    cy.get('[data-cy=scanner-tab]').click();
    cy.get('[data-cy=qr-scanner]').should('be.visible');
    cy.get('[data-cy=scanner-overlay]').should('be.visible');
  });

  it('should request camera permission', () => {
    cy.get('[data-cy=scanner-tab]').click();
    cy.get('[data-cy=permission-button]').should('not.exist');
    cy.get('[data-cy=scanner-video]').should('be.visible');
  });

  it('should scan a website QR code', () => {
    cy.get('[data-cy=scanner-tab]').click();
    
    // Simulate scanning a QR code
    cy.scanQRCode('https://example.com');
    
    // Check result display
    cy.get('[data-cy=scan-result]').should('be.visible');
    cy.get('[data-cy=scan-result-type]').should('contain', 'website');
    cy.get('[data-cy=scan-result-content]').should('contain', 'https://example.com');
    
    // Check action buttons
    cy.get('[data-cy=open-url-button]').should('be.visible');
    cy.get('[data-cy=copy-button]').should('be.visible');
  });

  it('should scan a WiFi QR code', () => {
    cy.get('[data-cy=scanner-tab]').click();
    
    // Simulate scanning a WiFi QR code
    cy.scanQRCode('WIFI:T:WPA2;S:MyNetwork;P:MyPassword;;');
    
    // Check result display
    cy.get('[data-cy=scan-result]').should('be.visible');
    cy.get('[data-cy=scan-result-type]').should('contain', 'wifi');
    cy.get('[data-cy=wifi-ssid]').should('contain', 'MyNetwork');
    cy.get('[data-cy=wifi-security]').should('contain', 'WPA2');
    
    // Check connect button
    cy.get('[data-cy=connect-wifi-button]').should('be.visible');
  });

  it('should scan a vCard QR code', () => {
    cy.get('[data-cy=scanner-tab]').click();
    
    // Simulate scanning a vCard
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1234567890
EMAIL:john@example.com
END:VCARD`;
    
    cy.scanQRCode(vcard);
    
    // Check result display
    cy.get('[data-cy=scan-result]').should('be.visible');
    cy.get('[data-cy=scan-result-type]').should('contain', 'vcard');
    cy.get('[data-cy=contact-name]').should('contain', 'John Doe');
    cy.get('[data-cy=contact-phone]').should('contain', '+1234567890');
    cy.get('[data-cy=contact-email]').should('contain', 'john@example.com');
    
    // Check save contact button
    cy.get('[data-cy=save-contact-button]').should('be.visible');
  });

  it('should handle scan errors', () => {
    cy.get('[data-cy=scanner-tab]').click();
    
    // Mock scan error
    cy.window().then((win) => {
      if ((win as any).mockScanError) {
        (win as any).mockScanError(new Error('Unable to decode QR code'));
      }
    });
    
    // Check error display
    cy.get('[data-cy=scan-error]').should('be.visible');
    cy.get('[data-cy=scan-error-message]').should('contain', 'Unable to decode');
    cy.get('[data-cy=retry-scan-button]').should('be.visible');
  });

  it('should toggle torch', () => {
    cy.get('[data-cy=scanner-tab]').click();
    cy.get('[data-cy=torch-button]').should('be.visible');
    
    // Toggle torch on
    cy.get('[data-cy=torch-button]').click();
    cy.get('[data-cy=torch-button]').should('have.class', 'active');
    
    // Toggle torch off
    cy.get('[data-cy=torch-button]').click();
    cy.get('[data-cy=torch-button]').should('not.have.class', 'active');
  });

  it('should flip camera', () => {
    cy.get('[data-cy=scanner-tab]').click();
    cy.get('[data-cy=flip-camera-button]').should('be.visible');
    
    // Click flip camera
    cy.get('[data-cy=flip-camera-button]').click();
    cy.get('[data-cy=camera-label]').should('contain', 'Front Camera');
    
    // Flip back
    cy.get('[data-cy=flip-camera-button]').click();
    cy.get('[data-cy=camera-label]').should('contain', 'Back Camera');
  });

  it('should save scan to history', () => {
    cy.get('[data-cy=scanner-tab]').click();
    
    // Scan a QR code
    cy.scanQRCode('https://example.com');
    
    // Go to history
    cy.get('[data-cy=history-tab]').click();
    
    // Check if scan is in history
    cy.get('[data-cy=history-list]').should('be.visible');
    cy.get('[data-cy=history-item]').first().should('contain', 'https://example.com');
    cy.get('[data-cy=history-item]').first().should('contain', 'website');
    cy.get('[data-cy=history-item]').first().find('[data-cy=scan-badge]').should('exist');
  });

  it('should handle file upload fallback', () => {
    // Revoke camera permission
    cy.window().then((win) => {
      const nav = win.navigator as any;
      if (nav.permissions) {
        cy.stub(nav.permissions, 'query').resolves({ state: 'denied' });
      }
    });
    
    cy.visit('/');
    cy.get('[data-cy=scanner-tab]').click();
    
    // Should show file upload
    cy.get('[data-cy=file-upload]').should('be.visible');
    cy.get('[data-cy=upload-label]').should('contain', 'Upload QR code image');
    
    // Upload file
    const fileName = 'qr-code.png';
    cy.get('[data-cy=file-input]').selectFile({
      contents: Cypress.Buffer.from('fake-image-data'),
      fileName,
      mimeType: 'image/png',
    });
    
    // Should process the uploaded file
    cy.get('[data-cy=processing-indicator]').should('be.visible');
  });
});