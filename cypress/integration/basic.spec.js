describe('touch-stone-two', () => {
  it('should assert that <title> is correct', () => {
    cy.visit('http://localhost:3000');
    cy.title()
      .should('include', 'Touchstone 2');
  });

  it('The header should Contain a Save Wordpsace Button', () => {
    cy.get('Button')
      .should('contain', 'Save Workspace')
      .should('contain', 'Preregistration')
      .should('contain', 'Import Block');
  });
});
