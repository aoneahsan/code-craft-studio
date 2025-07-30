/// <reference types="cypress" />

// Custom commands for Code Craft Studio testing

Cypress.Commands.add('scanQRCode', (content: string) => {
  // Mock the QR scanner result
  cy.window().then((win) => {
    if ((win as any).mockScanResult) {
      (win as any).mockScanResult({
        content,
        type: detectQRType(content),
        timestamp: new Date().toISOString(),
      });
    }
  });
});

Cypress.Commands.add('generateQRCode', (type: string, data: any) => {
  // Select QR type
  cy.get('[data-cy=qr-type-selector]').select(type);
  
  // Fill in form fields based on type
  switch (type) {
    case 'website':
      cy.get('[data-cy=url-input]').type(data.url);
      if (data.title) cy.get('[data-cy=title-input]').type(data.title);
      break;
      
    case 'text':
      cy.get('[data-cy=text-input]').type(data.text);
      break;
      
    case 'wifi':
      cy.get('[data-cy=ssid-input]').type(data.ssid);
      if (data.password) cy.get('[data-cy=password-input]').type(data.password);
      cy.get('[data-cy=security-select]').select(data.security || 'WPA2');
      break;
      
    case 'email':
      cy.get('[data-cy=email-to-input]').type(data.to);
      if (data.subject) cy.get('[data-cy=email-subject-input]').type(data.subject);
      if (data.body) cy.get('[data-cy=email-body-input]').type(data.body);
      break;
      
    case 'phone':
      cy.get('[data-cy=phone-input]').type(data.phoneNumber);
      break;
      
    case 'vcard':
      if (data.firstName) cy.get('[data-cy=first-name-input]').type(data.firstName);
      if (data.lastName) cy.get('[data-cy=last-name-input]').type(data.lastName);
      if (data.phone) cy.get('[data-cy=phone-input]').type(data.phone);
      if (data.email) cy.get('[data-cy=email-input]').type(data.email);
      break;
  }
  
  // Click generate button
  cy.get('[data-cy=generate-button]').click();
});

Cypress.Commands.add('grantCameraPermission', () => {
  // Mock camera permission
  cy.window().then((win) => {
    const nav = win.navigator as any;
    if (nav.permissions) {
      cy.stub(nav.permissions, 'query').resolves({ state: 'granted' });
    }
    if (nav.mediaDevices) {
      cy.stub(nav.mediaDevices, 'getUserMedia').resolves({
        getTracks: () => [],
        getVideoTracks: () => [],
        getAudioTracks: () => [],
      });
    }
  });
});

// Helper function to detect QR type from content
function detectQRType(content: string): string {
  if (/^https?:\/\//i.test(content)) return 'website';
  if (/^mailto:/i.test(content)) return 'email';
  if (/^tel:/i.test(content)) return 'phone';
  if (/^sms:/i.test(content)) return 'sms';
  if (/^WIFI:/i.test(content)) return 'wifi';
  if (/^BEGIN:VCARD/i.test(content)) return 'vcard';
  if (/^geo:/i.test(content)) return 'location';
  return 'text';
}