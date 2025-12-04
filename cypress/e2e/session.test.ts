describe('useSession behavior', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true');
  });

  it('shows logged in state with valid token', () => {
    cy.setCookie('_datacite', Cypress.env('userCookie'), { log: false });
    cy.visit('/');
    cy.get('#sign-in').should('contain.text', 'Martin Fenner'); // Adjust to expected user name from env cookie
  });

  it('shows logged out state without token', () => {
    cy.visit('/');
    cy.get('#sign-in').should('contain.text', 'Sign In');
  });

  it('shows logged out state with invalid token', () => {
    cy.setCookie('_datacite', '{"authenticated":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid.signature"}}', { log: false });
    cy.visit('/');
    cy.get('#sign-in').should('contain.text', 'Sign In');
  });
});