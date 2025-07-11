describe('LofiMusic Player', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the app', () => {
    cy.contains('LofiMusic Player').should('exist');
  });

  it('opens the track sidebar on button click', () => {
    cy.get('button[title="Open Sidebar"]').click();
    cy.contains('Track List').should('be.visible');
  });
}); 