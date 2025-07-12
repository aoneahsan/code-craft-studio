describe('QR Studio E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=studio-tab]').click();
  });

  it('should display studio interface', () => {
    cy.get('[data-cy=qr-studio]').should('be.visible');
    cy.get('[data-cy=studio-workspace]').should('be.visible');
    cy.get('[data-cy=studio-toolbar]').should('be.visible');
    cy.get('[data-cy=studio-sidebar]').should('be.visible');
  });

  it('should create a new design', () => {
    // Click new design button
    cy.get('[data-cy=new-design-button]').click();
    
    // Select template
    cy.get('[data-cy=template-modal]').should('be.visible');
    cy.get('[data-cy=template-business-card]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Check workspace is loaded
    cy.get('[data-cy=design-canvas]').should('be.visible');
    cy.get('[data-cy=layers-panel]').should('be.visible');
    cy.get('[data-cy=properties-panel]').should('be.visible');
  });

  it('should add QR codes to design', () => {
    // Create new design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Add QR code element
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-qr-code]').click();
    
    // Configure QR code
    cy.get('[data-cy=qr-config-modal]').should('be.visible');
    cy.get('[data-cy=qr-type-select]').select('website');
    cy.get('[data-cy=qr-url-input]').type('https://mycompany.com');
    cy.get('[data-cy=add-qr-button]').click();
    
    // Check QR code is added to canvas
    cy.get('[data-cy=qr-element-1]').should('be.visible');
    cy.get('[data-cy=layer-qr-1]').should('be.visible');
  });

  it('should add text elements', () => {
    // Start with a design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Add text element
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-text]').click();
    
    // Edit text
    cy.get('[data-cy=text-element-1]').should('be.visible');
    cy.get('[data-cy=text-element-1]').dblclick();
    cy.get('[data-cy=text-editor]').clear().type('Company Name');
    cy.get('[data-cy=design-canvas]').click(); // Click outside to save
    
    // Check text properties
    cy.get('[data-cy=text-element-1]').click();
    cy.get('[data-cy=font-family-select]').select('Arial');
    cy.get('[data-cy=font-size-input]').clear().type('24');
    cy.get('[data-cy=text-color-picker]').invoke('val', '#333333').trigger('change');
  });

  it('should add shapes and images', () => {
    // Start with a design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Add shape
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-shape]').click();
    cy.get('[data-cy=shape-rectangle]').click();
    
    // Check shape is added
    cy.get('[data-cy=shape-element-1]').should('be.visible');
    
    // Add image
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-image]').click();
    
    // Upload image
    cy.get('[data-cy=image-upload-input]').selectFile({
      contents: Cypress.Buffer.from('fake-image-data'),
      fileName: 'logo.png',
      mimeType: 'image/png',
    });
    
    // Check image is added
    cy.get('[data-cy=image-element-1]').should('be.visible');
  });

  it('should arrange elements with layers', () => {
    // Create design with multiple elements
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Add multiple elements
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-shape]').click();
    cy.get('[data-cy=shape-rectangle]').click();
    
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-text]').click();
    
    // Select first element
    cy.get('[data-cy=shape-element-1]').click();
    
    // Move to front
    cy.get('[data-cy=bring-to-front-button]').click();
    
    // Check layer order
    cy.get('[data-cy=layer-shape-1]').should('have.attr', 'data-index', '1');
    cy.get('[data-cy=layer-text-1]').should('have.attr', 'data-index', '0');
    
    // Send to back
    cy.get('[data-cy=send-to-back-button]').click();
    cy.get('[data-cy=layer-shape-1]').should('have.attr', 'data-index', '0');
  });

  it('should use alignment tools', () => {
    // Create design with elements
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Add two elements
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-shape]').click();
    cy.get('[data-cy=shape-rectangle]').click();
    
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-shape]').click();
    cy.get('[data-cy=shape-circle]').click();
    
    // Select both elements
    cy.get('[data-cy=shape-element-1]').click();
    cy.get('[data-cy=shape-element-2]').click({ shiftKey: true });
    
    // Align horizontally
    cy.get('[data-cy=align-horizontal-center]').click();
    
    // Align vertically
    cy.get('[data-cy=align-vertical-center]').click();
    
    // Distribute horizontally
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-shape]').click();
    cy.get('[data-cy=shape-rectangle]').click();
    
    cy.get('[data-cy=select-all-button]').click();
    cy.get('[data-cy=distribute-horizontal]').click();
  });

  it('should save and load designs', () => {
    // Create a design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-business-card]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Add some elements
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-text]').click();
    
    // Save design
    cy.get('[data-cy=save-design-button]').click();
    cy.get('[data-cy=design-name-input]').type('My Business Card');
    cy.get('[data-cy=save-confirm-button]').click();
    
    // Check save success
    cy.get('[data-cy=save-success-message]').should('be.visible');
    
    // Go to saved designs
    cy.get('[data-cy=my-designs-button]').click();
    
    // Check design is listed
    cy.get('[data-cy=design-list]').should('be.visible');
    cy.get('[data-cy=design-item]').should('contain', 'My Business Card');
    
    // Load the design
    cy.get('[data-cy=design-item]').first().click();
    cy.get('[data-cy=load-design-button]').click();
    
    // Check design is loaded
    cy.get('[data-cy=design-canvas]').should('be.visible');
    cy.get('[data-cy=text-element-1]').should('be.visible');
  });

  it('should export designs', () => {
    // Create a design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-poster]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Export as PNG
    cy.get('[data-cy=export-button]').click();
    cy.get('[data-cy=export-format-select]').select('png');
    cy.get('[data-cy=export-quality-slider]').invoke('val', 100).trigger('change');
    cy.get('[data-cy=export-confirm-button]').click();
    
    // Check export success
    cy.get('[data-cy=export-success]').should('be.visible');
    
    // Export as PDF
    cy.get('[data-cy=export-button]').click();
    cy.get('[data-cy=export-format-select]').select('pdf');
    cy.get('[data-cy=export-confirm-button]').click();
    cy.get('[data-cy=export-success]').should('be.visible');
    
    // Export as SVG
    cy.get('[data-cy=export-button]').click();
    cy.get('[data-cy=export-format-select]').select('svg');
    cy.get('[data-cy=export-confirm-button]').click();
    cy.get('[data-cy=export-success]').should('be.visible');
  });

  it('should use grid and guides', () => {
    // Create new design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Toggle grid
    cy.get('[data-cy=toggle-grid-button]').click();
    cy.get('[data-cy=design-grid]').should('be.visible');
    
    // Adjust grid settings
    cy.get('[data-cy=grid-settings-button]').click();
    cy.get('[data-cy=grid-size-input]').clear().type('20');
    cy.get('[data-cy=grid-color-picker]').invoke('val', '#cccccc').trigger('change');
    cy.get('[data-cy=apply-grid-settings]').click();
    
    // Toggle guides
    cy.get('[data-cy=toggle-guides-button]').click();
    cy.get('[data-cy=design-guides]').should('be.visible');
    
    // Add custom guide
    cy.get('[data-cy=add-guide-button]').click();
    cy.get('[data-cy=guide-orientation-select]').select('horizontal');
    cy.get('[data-cy=guide-position-input]').type('200');
    cy.get('[data-cy=add-guide-confirm]').click();
    
    // Check guide is visible
    cy.get('[data-cy=guide-horizontal-200]').should('be.visible');
  });

  it('should handle undo and redo', () => {
    // Create design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Add element
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-text]').click();
    
    // Edit text
    cy.get('[data-cy=text-element-1]').dblclick();
    cy.get('[data-cy=text-editor]').clear().type('First Text');
    cy.get('[data-cy=design-canvas]').click();
    
    // Add another element
    cy.get('[data-cy=add-element-button]').click();
    cy.get('[data-cy=element-shape]').click();
    cy.get('[data-cy=shape-rectangle]').click();
    
    // Undo last action
    cy.get('[data-cy=undo-button]').click();
    cy.get('[data-cy=shape-element-1]').should('not.exist');
    
    // Undo again
    cy.get('[data-cy=undo-button]').click();
    cy.get('[data-cy=text-element-1]').should('contain', 'Click to edit');
    
    // Redo
    cy.get('[data-cy=redo-button]').click();
    cy.get('[data-cy=text-element-1]').should('contain', 'First Text');
    
    // Redo again
    cy.get('[data-cy=redo-button]').click();
    cy.get('[data-cy=shape-element-1]').should('be.visible');
  });

  it('should collaborate with team', () => {
    // Create design
    cy.get('[data-cy=new-design-button]').click();
    cy.get('[data-cy=template-blank]').click();
    cy.get('[data-cy=use-template-button]').click();
    
    // Share design
    cy.get('[data-cy=share-button]').click();
    cy.get('[data-cy=share-modal]').should('be.visible');
    
    // Add collaborator
    cy.get('[data-cy=collaborator-email-input]').type('colleague@example.com');
    cy.get('[data-cy=collaborator-role-select]').select('editor');
    cy.get('[data-cy=add-collaborator-button]').click();
    
    // Check collaborator is added
    cy.get('[data-cy=collaborator-list]').should('contain', 'colleague@example.com');
    
    // Generate share link
    cy.get('[data-cy=generate-link-button]').click();
    cy.get('[data-cy=share-link-input]').should('have.value').and('include', 'http');
    
    // Copy link
    cy.get('[data-cy=copy-link-button]').click();
    cy.get('[data-cy=copy-success]').should('be.visible');
  });

  it('should use templates library', () => {
    // Open templates library
    cy.get('[data-cy=templates-library-button]').click();
    cy.get('[data-cy=templates-modal]').should('be.visible');
    
    // Filter by category
    cy.get('[data-cy=category-business]').click();
    cy.get('[data-cy=template-grid]').find('[data-cy^=template-]').should('have.length.greaterThan', 0);
    
    // Search templates
    cy.get('[data-cy=template-search-input]').type('restaurant');
    cy.get('[data-cy=template-grid]').find('[data-cy^=template-]').should('have.length.greaterThan', 0);
    
    // Preview template
    cy.get('[data-cy=template-menu-1]').click();
    cy.get('[data-cy=template-preview]').should('be.visible');
    
    // Use template
    cy.get('[data-cy=use-template-button]').click();
    cy.get('[data-cy=design-canvas]').should('be.visible');
  });
});